import React, { useState, useEffect } from 'react';
import './App.css';
import { GameCreator } from './components/GameCreator';
import { GamePlayer } from './components/GamePlayer';
import { GameStatus } from './components/GameStatus';
import { 
  connectWallet, 
  getCurrentAccount, 
  onAccountChange,
  switchToSepolia,
  getNetwork,
  isMetaMaskInstalled
} from './utils/web3';
import { loadGameData, GameData } from './utils/gameLogic';

function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load account and game data on mount
  useEffect(() => {
    const init = async () => {
      if (!isMetaMaskInstalled()) {
        setError('Please install MetaMask to use this dApp');
        return;
      }

      try {
        const currentAccount = await getCurrentAccount();
        if (currentAccount) {
          setAccount(currentAccount);
          await checkNetwork();
        }

        // Load saved game data
        const savedGame = loadGameData();
        if (savedGame) {
          setGameData(savedGame);
        }

        // Listen for account changes
        onAccountChange((accounts) => {
          setAccount(accounts[0] || null);
        });

      } catch (err) {
        console.error('Init error:', err);
      }
    };

    init();
  }, []);

  const checkNetwork = async () => {
    try {
      const network = await getNetwork();
      // Sepolia chainId is 11155111n
      setIsCorrectNetwork(network.chainId === 11155111n);
    } catch (err) {
      console.error('Network check error:', err);
      setIsCorrectNetwork(false);
    }
  };

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const connectedAccount = await connectWallet();
      setAccount(connectedAccount);
      
      // Check and switch network if needed
      await checkNetwork();
      if (!isCorrectNetwork) {
        await switchToSepolia();
        await checkNetwork();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchNetwork = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await switchToSepolia();
      await checkNetwork();
    } catch (err: any) {
      setError(err.message || 'Failed to switch network');
    } finally {
      setLoading(false);
    }
  };

  const handleGameUpdate = (data: GameData) => {
    setGameData(data);
  };

  const handleNewGame = () => {
    setGameData(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Rock Paper Scissors Lizard Spock</h1>
        
        {!isMetaMaskInstalled() ? (
          <div className="error-message">
            <p>Please install MetaMask to use this dApp</p>
            <a 
              href="https://metamask.io/download/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="button"
            >
              Install MetaMask
            </a>
          </div>
        ) : !account ? (
          <div className="connect-section">
            <button 
              onClick={handleConnect} 
              disabled={loading}
              className="button primary"
            >
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          </div>
        ) : !isCorrectNetwork ? (
          <div className="network-section">
            <p>Please switch to Sepolia network</p>
            <button 
              onClick={handleSwitchNetwork}
              disabled={loading}
              className="button warning"
            >
              {loading ? 'Switching...' : 'Switch to Sepolia'}
            </button>
          </div>
        ) : (
          <div className="game-container">
            <div className="account-info">
              <p>Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
              {gameData && (
                <button onClick={handleNewGame} className="button secondary">
                  New Game
                </button>
              )}
            </div>

            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            {gameData ? (
              <>
                <GameStatus 
                  gameData={gameData}
                  currentAccount={account}
                  onUpdate={handleGameUpdate}
                />
                <GamePlayer
                  gameData={gameData}
                  currentAccount={account}
                  onUpdate={handleGameUpdate}
                />
              </>
            ) : (
              <GameCreator
                currentAccount={account}
                onGameCreated={handleGameUpdate}
              />
            )}
          </div>
        )}
      </header>
      <footer className="footer">
        Created by Sanjay Kirti
      </footer>
    </div>
  );
}

export default App;
