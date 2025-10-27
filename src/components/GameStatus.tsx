import React, { useEffect, useState } from 'react';
import { getContractState, ContractState } from '../utils/web3';
import { 
  GameData, 
  getMoveName, 
  formatEth,
  getTimeRemaining,
  determineWinner
} from '../utils/gameLogic';
import { Move } from '../contracts/contractConfig';

interface GameStatusProps {
  gameData: GameData;
  currentAccount: string;
  onUpdate: (gameData: GameData) => void;
}

export const GameStatus: React.FC<GameStatusProps> = ({ gameData, currentAccount }) => {
  const [contractState, setContractState] = useState<ContractState | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameData.contractAddress) return;

    const loadContractState = async () => {
      try {
        const state = await getContractState(gameData.contractAddress);
        setContractState(state);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load contract state:', err);
        setError('Failed to load game state');
        setLoading(false);
      }
    };

    loadContractState();

    // Update every 5 seconds
    const interval = setInterval(loadContractState, 5000);

    return () => clearInterval(interval);
  }, [gameData.contractAddress]);

  useEffect(() => {
    if (!contractState) return;

    // Update time remaining
    const updateTime = () => {
      const remaining = getTimeRemaining(
        Number(contractState.lastAction),
        Number(contractState.timeout)
      );
      setTimeRemaining(remaining);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [contractState]);

  if (loading) {
    return (
      <div className="game-status">
        <h2>Game Status</h2>
        <p>Loading game state...</p>
      </div>
    );
  }

  if (error || !contractState) {
    return (
      <div className="game-status">
        <h2>Game Status</h2>
        <div className="error-message">
          <p>{error || 'Failed to load game'}</p>
        </div>
      </div>
    );
  }

  const isPlayer1 = currentAccount.toLowerCase() === contractState.j1.toLowerCase();
  const isPlayer2 = currentAccount.toLowerCase() === contractState.j2.toLowerCase();
  const stake = contractState.stake;
  const player2HasPlayed = contractState.c2 !== Move.Null;
  const gameComplete = stake === BigInt(0);

  // Determine game result if complete
  let winner = null;
  let player1Move = null;
  let player2Move = null;
  
  if (gameComplete && gameData.player1Move !== undefined && contractState.c2 !== Move.Null) {
    player1Move = gameData.player1Move;
    player2Move = contractState.c2;
    winner = determineWinner(player1Move, player2Move);
  }

  return (
    <div className="game-status">
      <h2>Game Status</h2>
      
      <div className="status-grid">
        <div className="status-item">
          <strong>Contract:</strong>
          <a 
            href={`https://sepolia.etherscan.io/address/${gameData.contractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {gameData.contractAddress?.slice(0, 6)}...{gameData.contractAddress?.slice(-4)}
          </a>
        </div>

        <div className="status-item">
          <strong>Stake:</strong>
          <span>{formatEth(stake)}</span>
        </div>

        <div className="status-item">
          <strong>Your Role:</strong>
          <span>
            {isPlayer1 ? 'Player 1 (Creator)' : isPlayer2 ? 'Player 2 (Opponent)' : 'Spectator'}
          </span>
        </div>

        <div className="status-item">
          <strong>Game State:</strong>
          <span className={`status-${gameData.gameState?.toLowerCase()}`}>
            {gameComplete ? 'COMPLETED' : 
             player2HasPlayed ? 'Player 2 Played - Waiting for Reveal' : 
             'Waiting for Player 2'}
          </span>
        </div>

        <div className="status-item">
          <strong>Time Remaining:</strong>
          <span>{timeRemaining}</span>
        </div>

        <div className="status-item">
          <strong>Player 1:</strong>
          <span>{contractState.j1.slice(0, 6)}...{contractState.j1.slice(-4)}</span>
        </div>

        <div className="status-item">
          <strong>Player 2:</strong>
          <span>{contractState.j2.slice(0, 6)}...{contractState.j2.slice(-4)}</span>
        </div>

        {player2HasPlayed && (
          <div className="status-item">
            <strong>Player 2 Move:</strong>
            <span>{getMoveName(contractState.c2)}</span>
          </div>
        )}
      </div>

      {gameComplete && winner && (
        <div className="game-result">
          <h3>Game Result</h3>
          <div className="result-details">
            <p><strong>Player 1:</strong> {getMoveName(player1Move!)}</p>
            <p><strong>Player 2:</strong> {getMoveName(player2Move!)}</p>
            <p className="winner">
              <strong>Winner:</strong> 
              {winner === 'tie' ? 'It\'s a tie!' : 
               winner === 'player1' ? 'Player 1 wins!' : 
               'Player 2 wins!'}
            </p>
            {winner !== 'tie' && (
              <p>
                {winner === 'player1' ? 
                  `Player 1 receives ${formatEth(stake * BigInt(2))}` :
                  `Player 2 receives ${formatEth(stake * BigInt(2))}`
                }
              </p>
            )}
          </div>
        </div>
      )}

      <div className="info-box">
        <p><strong>Game Rules:</strong></p>
        <ul>
          <li>Rock crushes Scissors & Lizard</li>
          <li>Paper covers Rock & disproves Spock</li>
          <li>Scissors cuts Paper & decapitates Lizard</li>
          <li>Spock vaporizes Rock & smashes Scissors</li>
          <li>Lizard eats Paper & poisons Spock</li>
        </ul>
      </div>
    </div>
  );
};
