import React, { useState } from 'react';
import { Move } from '../contracts/contractConfig';
import { 
  deployRPSContract,
  switchToSepolia,
  getNetwork
} from '../utils/web3';
import {
  generateSalt,
  hashMove,
  saveGameData,
  parseEth,
  getMoveName,
  GameData
} from '../utils/gameLogic';

interface GameCreatorProps {
  currentAccount: string;
  onGameCreated: (gameData: GameData) => void;
}

export const GameCreator: React.FC<GameCreatorProps> = ({ currentAccount, onGameCreated }) => {
  const [selectedMove, setSelectedMove] = useState<Move>(Move.Null);
  const [opponentAddress, setOpponentAddress] = useState('');
  const [stakeAmount, setStakeAmount] = useState('0.001');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  const handleCreateGame = async () => {
    // Validate inputs
    if (selectedMove === Move.Null) {
      setError('Please select a move');
      return;
    }

    if (!opponentAddress || !opponentAddress.startsWith('0x') || opponentAddress.length !== 42) {
      setError('Please enter a valid Ethereum address');
      return;
    }

    if (opponentAddress.toLowerCase() === currentAccount.toLowerCase()) {
      setError('You cannot play against yourself');
      return;
    }

    const stake = parseEth(stakeAmount);
    if (stake === BigInt(0)) {
      setError('Please enter a valid stake amount');
      return;
    }

    setLoading(true);
    setError(null);
    setTxStatus('Preparing transaction...');

    try {
      // Check network
      const network = await getNetwork();
      if (network.chainId !== BigInt(11155111)) {
        setTxStatus('Switching to Sepolia network...');
        await switchToSepolia();
      }

      // Generate salt and hash the move
      const salt = generateSalt();
      const moveHash = hashMove(selectedMove, salt);

      setTxStatus('Deploying game contract...');
      
      // Deploy the contract
      const contractAddress = await deployRPSContract(
        moveHash,
        opponentAddress,
        stake
      );

      setTxStatus('Game created successfully!');

      // Save game data to localStorage
      const gameData: GameData = {
        contractAddress,
        player1Move: selectedMove,
        salt,
        player1Address: currentAccount,
        player2Address: opponentAddress,
        stake: stakeAmount,
        gameState: 'WAITING_FOR_J2',
        lastAction: Math.floor(Date.now() / 1000),
      };

      saveGameData(gameData);
      onGameCreated(gameData);

    } catch (err: any) {
      console.error('Create game error:', err);
      setError(err.message || 'Failed to create game');
      setTxStatus(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="game-creator">
      <h2>Create New Game</h2>
      
      <div className="form-section">
        <label>Your Move:</label>
        <div className="move-selector">
          {[Move.Rock, Move.Paper, Move.Scissors, Move.Spock, Move.Lizard].map(move => (
            <button
              key={move}
              className={`move-button ${selectedMove === move ? 'selected' : ''}`}
              onClick={() => setSelectedMove(move)}
              disabled={loading}
            >
              {getMoveName(move)}
            </button>
          ))}
        </div>
      </div>

      <div className="form-section">
        <label>Opponent Address:</label>
        <input
          type="text"
          placeholder="0x..."
          value={opponentAddress}
          onChange={(e) => setOpponentAddress(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="form-section">
        <label>Stake Amount (ETH):</label>
        <input
          type="number"
          min="0"
          step="0.001"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(e.target.value)}
          disabled={loading}
        />
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {txStatus && (
        <div className="tx-status">
          <p>{txStatus}</p>
        </div>
      )}

      <button
        className="button primary large"
        onClick={handleCreateGame}
        disabled={loading || selectedMove === Move.Null}
      >
        {loading ? 'Creating Game...' : 'Create Game'}
      </button>

      <div className="info-box">
        <p><strong>How it works:</strong></p>
        <ul>
          <li>1. Choose your move (kept secret)</li>
          <li>2. Set opponent's address</li>
          <li>3. Set stake amount</li>
          <li>4. Create the game</li>
          <li>5. Wait for opponent to play</li>
          <li>6. Reveal your move to determine winner</li>
        </ul>
      </div>
    </div>
  );
};
