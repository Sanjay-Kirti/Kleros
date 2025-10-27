import React, { useState } from 'react';
import { Move } from '../contracts/contractConfig';
import { 
  playMove,
  revealMove,
  callJ1Timeout,
  callJ2Timeout,
  getContractState
} from '../utils/web3';
import {
  getMoveName,
  saveGameData,
  parseEth,
  GameData,
  hasTimedOut
} from '../utils/gameLogic';

interface GamePlayerProps {
  gameData: GameData;
  currentAccount: string;
  onUpdate: (gameData: GameData) => void;
}

export const GamePlayer: React.FC<GamePlayerProps> = ({ gameData, currentAccount, onUpdate }) => {
  const [selectedMove, setSelectedMove] = useState<Move>(Move.Null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  const isPlayer1 = currentAccount.toLowerCase() === gameData.player1Address?.toLowerCase();
  const isPlayer2 = currentAccount.toLowerCase() === gameData.player2Address?.toLowerCase();

  const handlePlayer2Move = async () => {
    if (selectedMove === Move.Null) {
      setError('Please select a move');
      return;
    }

    if (!gameData.contractAddress) {
      setError('No game contract found');
      return;
    }

    setLoading(true);
    setError(null);
    setTxStatus('Submitting your move...');

    try {
      const stake = parseEth(gameData.stake || '0');
      
      await playMove(
        gameData.contractAddress,
        selectedMove,
        stake
      );

      setTxStatus('Move submitted successfully!');

      // Update game data
      const updatedData: GameData = {
        ...gameData,
        gameState: 'J2_PLAYED',
        lastAction: Math.floor(Date.now() / 1000),
      };

      saveGameData(updatedData);
      onUpdate(updatedData);

    } catch (err: any) {
      console.error('Play move error:', err);
      setError(err.message || 'Failed to submit move');
      setTxStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReveal = async () => {
    if (!gameData.contractAddress || !gameData.salt || gameData.player1Move === undefined) {
      setError('Missing game data for reveal');
      return;
    }

    setLoading(true);
    setError(null);
    setTxStatus('Revealing your move...');

    try {
      await revealMove(
        gameData.contractAddress,
        gameData.player1Move,
        gameData.salt
      );

      setTxStatus('Move revealed! Game complete.');

      // Update game data
      const updatedData: GameData = {
        ...gameData,
        gameState: 'REVEALED',
      };

      saveGameData(updatedData);
      onUpdate(updatedData);

    } catch (err: any) {
      console.error('Reveal error:', err);
      setError(err.message || 'Failed to reveal move');
      setTxStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeout = async (type: 'j1' | 'j2') => {
    if (!gameData.contractAddress) {
      setError('No game contract found');
      return;
    }

    setLoading(true);
    setError(null);
    setTxStatus('Claiming timeout...');

    try {
      // Check if timeout has actually occurred
      const state = await getContractState(gameData.contractAddress);
      const timeoutDuration = Number(state.timeout);
      const lastAction = Number(state.lastAction);
      
      if (!hasTimedOut(lastAction, timeoutDuration)) {
        setError('Timeout period has not elapsed yet');
        setLoading(false);
        return;
      }

      if (type === 'j1') {
        await callJ1Timeout(gameData.contractAddress);
      } else {
        await callJ2Timeout(gameData.contractAddress);
      }

      setTxStatus('Timeout claimed successfully!');

      // Update game data
      const updatedData: GameData = {
        ...gameData,
        gameState: 'TIMEOUT',
      };

      saveGameData(updatedData);
      onUpdate(updatedData);

    } catch (err: any) {
      console.error('Timeout error:', err);
      setError(err.message || 'Failed to claim timeout');
      setTxStatus(null);
    } finally {
      setLoading(false);
    }
  };

  // Player 2 view - needs to submit move
  if (isPlayer2 && gameData.gameState === 'WAITING_FOR_J2') {
    return (
      <div className="game-player">
        <h2>Your Turn to Play!</h2>
        <p>You've been challenged to a game. Stake: {gameData.stake} ETH</p>
        
        <div className="form-section">
          <label>Select Your Move:</label>
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
          onClick={handlePlayer2Move}
          disabled={loading || selectedMove === Move.Null}
        >
          {loading ? 'Submitting Move...' : `Submit Move (${gameData.stake} ETH)`}
        </button>

        <button
          className="button secondary"
          onClick={() => handleTimeout('j2')}
          disabled={loading}
        >
          Claim Timeout (if Player 1 is inactive)
        </button>
      </div>
    );
  }

  // Player 1 view - needs to reveal
  if (isPlayer1 && gameData.gameState === 'J2_PLAYED') {
    return (
      <div className="game-player">
        <h2>Time to Reveal Your Move!</h2>
        <p>Player 2 has played. Now reveal your move to determine the winner.</p>
        
        <div className="info-box">
          <p><strong>Your Move:</strong> {getMoveName(gameData.player1Move || Move.Null)}</p>
          <p><strong>Note:</strong> Your move is securely stored locally. Click reveal to determine the winner.</p>
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
          onClick={handleReveal}
          disabled={loading}
        >
          {loading ? 'Revealing...' : 'Reveal Your Move'}
        </button>

        <button
          className="button secondary"
          onClick={() => handleTimeout('j1')}
          disabled={loading}
        >
          Claim Timeout (if Player 2 is inactive)
        </button>
      </div>
    );
  }

  // Waiting view
  if (isPlayer1 && gameData.gameState === 'WAITING_FOR_J2') {
    return (
      <div className="game-player">
        <h2>Waiting for Opponent</h2>
        <p>Waiting for {gameData.player2Address?.slice(0, 6)}...{gameData.player2Address?.slice(-4)} to play their move.</p>
        <p>Share the contract address with them: <code>{gameData.contractAddress}</code></p>
        
        <button
          className="button secondary"
          onClick={() => handleTimeout('j2')}
          disabled={loading}
        >
          Claim Timeout (if Player 2 doesn't respond)
        </button>
      </div>
    );
  }

  // Spectator or completed game
  return (
    <div className="game-player">
      <h2>Game View</h2>
      {gameData.gameState === 'REVEALED' ? (
        <p>Game completed! Check the status above for the winner.</p>
      ) : gameData.gameState === 'TIMEOUT' ? (
        <p>Game ended due to timeout.</p>
      ) : (
        <p>You are viewing this game as a spectator.</p>
      )}
    </div>
  );
};
