import { ethers } from 'ethers';
import { Move } from '../contracts/contractConfig';

// Generate a secure random salt
export function generateSalt(): string {
  const randomBytes = new Uint8Array(32);
  window.crypto.getRandomValues(randomBytes);
  return '0x' + Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Hash the move with salt (mimics the contract's hash function)
export function hashMove(move: Move, salt: string): string {
  // Solidity 0.4.26 keccak256(_c1, _salt) uses packed encoding
  // Analysis of bytecode confirms packed encoding (0x01 prefix pattern)
  return ethers.solidityPackedKeccak256(['uint8', 'uint256'], [move, salt]);
}

// Determine winner based on contract logic
export function determineWinner(move1: Move, move2: Move): 'player1' | 'player2' | 'tie' {
  if (move1 === move2) return 'tie';
  if (move1 === Move.Null || move2 === Move.Null) return 'tie';
  
  // Contract logic: if moves have same parity, lower wins; else higher wins
  const move1Parity = move1 % 2;
  const move2Parity = move2 % 2;
  
  if (move1Parity === move2Parity) {
    return move1 < move2 ? 'player1' : 'player2';
  } else {
    return move1 > move2 ? 'player1' : 'player2';
  }
}

// Get move name for display
export function getMoveName(move: Move): string {
  const moveNames = {
    [Move.Null]: 'None',
    [Move.Rock]: 'Rock',
    [Move.Paper]: 'Paper',
    [Move.Scissors]: 'Scissors',
    [Move.Spock]: 'Spock',
    [Move.Lizard]: 'Lizard',
  };
  return moveNames[move] || 'Unknown';
}

// Save game data to localStorage
export interface GameData {
  contractAddress: string;
  player1Move?: Move;
  salt?: string;
  player1Address?: string;
  player2Address?: string;
  stake?: string;
  gameState?: string;
  lastAction?: number;
}

export function saveGameData(data: GameData): void {
  const key = `rpsls_game_${data.contractAddress}`;
  localStorage.setItem(key, JSON.stringify(data));
  // Also save to current game
  localStorage.setItem('rpsls_current_game', JSON.stringify(data));
}

export function loadGameData(contractAddress?: string): GameData | null {
  const key = contractAddress ? `rpsls_game_${contractAddress}` : 'rpsls_current_game';
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

export function clearGameData(contractAddress?: string): void {
  if (contractAddress) {
    localStorage.removeItem(`rpsls_game_${contractAddress}`);
  }
  localStorage.removeItem('rpsls_current_game');
}

// Format ETH for display
export function formatEth(wei: bigint): string {
  return ethers.formatEther(wei) + ' ETH';
}

// Parse ETH input
export function parseEth(eth: string): bigint {
  try {
    return ethers.parseEther(eth);
  } catch {
    return BigInt(0);
  }
}

// Check if timeout has occurred
export function hasTimedOut(lastAction: number, timeoutDuration: number): boolean {
  const now = Math.floor(Date.now() / 1000);
  return now > lastAction + timeoutDuration;
}

// Get remaining time until timeout
export function getTimeRemaining(lastAction: number, timeoutDuration: number): string {
  const now = Math.floor(Date.now() / 1000);
  const timeLeft = (lastAction + timeoutDuration) - now;
  
  if (timeLeft <= 0) return 'Timeout reached';
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  return `${minutes}m ${seconds}s`;
}
