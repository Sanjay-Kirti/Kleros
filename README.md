# Rock Paper Scissors Lizard Spock dApp

A decentralized Rock Paper Scissors Lizard Spock game built on Ethereum (Sepolia testnet).

## Live Demo

**URL:** https://kleros-lake.vercel.app/

**Network:** Sepolia Testnet  
**Browser:** Chrome with MetaMask extension

## How to Play

### Player 1 (Game Creator):
1. Connect MetaMask wallet
2. Select your move (Rock/Paper/Scissors/Spock/Lizard)
3. Enter Player 2's Ethereum address
4. Set stake amount (e.g., 0.001 ETH)
5. Click "Create Game" - deploys a new contract
6. Wait for Player 2 to play
7. Reveal your move to determine winner

### Player 2:
1. Connect MetaMask wallet (use the address Player 1 specified)
2. Game automatically loads
3. Select your move
4. Click "Submit Move" with the same stake amount
5. Wait for Player 1 to reveal

### Winner Determination:
- Winner gets both stakes (2x the bet)
- Tie: both players get their stake back
- If opponent doesn't respond: claim timeout after 5 minutes

## Security Features

1. **Cryptographic Commitment Scheme:**
   - Player 1's move is hashed with a 256-bit random salt
   - Only the hash is stored on-chain initially
   - Prevents Player 2 from seeing Player 1's move

2. **Secure Salt Generation:**
   - Uses `window.crypto.getRandomValues()` (not `Math.random()`)
   - 256-bit entropy matches Ethereum's security level

3. **Input Validation:**
   - Frontend validates all inputs before transactions
   - Smart contract validates on-chain
   - Prevents invalid addresses, zero stakes, self-play

4. **Timeout Protection:**
   - Player 1 can claim if Player 2 doesn't play (5 min)
   - Player 2 can claim if Player 1 doesn't reveal (5 min)

## Nash Equilibrium Answer

**Mixed Strategy Nash Equilibrium:**  
Each player should play each of the 5 moves with equal probability of **1/5 (20%)**.

**Reasoning:**
- The game is symmetric - all moves are equivalent
- Each move beats exactly 2 others and loses to exactly 2 others
- Any deviation from uniform randomness can be exploited
- Expected payoff is 0 for both players using this strategy

## Technology Stack

- **Frontend:** React 19 + TypeScript
- **Blockchain:** Ethereum (Sepolia Testnet)
- **Web3 Library:** Ethers.js v6
- **Wallet:** MetaMask
- **Smart Contract:** Solidity 0.4.26 (not modified)




