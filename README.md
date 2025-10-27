# Rock Paper Scissors Lizard Spock dApp

A decentralized Rock Paper Scissors Lizard Spock game built on Ethereum (Sepolia testnet).

## 🎮 Live Demo

**URL:** [Will be added after deployment]

**Network:** Sepolia Testnet  
**Browser:** Chrome with MetaMask extension

## 📋 Features

- ✅ Commitment scheme with cryptographic salt for fairness
- ✅ Secure random salt generation using Web Crypto API
- ✅ Timeout mechanisms to prevent griefing
- ✅ Persistent game state via localStorage
- ✅ Real-time transaction status updates
- ✅ Automatic network switching to Sepolia
- ✅ Modern, clean UI with green/white theme

## 🎯 How to Play

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

## 🔐 Security Features

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

## 🎲 Nash Equilibrium Answer

**Mixed Strategy Nash Equilibrium:**  
Each player should play each of the 5 moves with equal probability of **1/5 (20%)**.

**Reasoning:**
- The game is symmetric - all moves are equivalent
- Each move beats exactly 2 others and loses to exactly 2 others
- Any deviation from uniform randomness can be exploited
- Expected payoff is 0 for both players using this strategy

## 🛠️ Technology Stack

- **Frontend:** React 19 + TypeScript
- **Blockchain:** Ethereum (Sepolia Testnet)
- **Web3 Library:** Ethers.js v6
- **Wallet:** MetaMask
- **Smart Contract:** Solidity 0.4.26 (provided, not modified)
- **Styling:** Custom CSS with modern green/white theme

## 📦 Project Structure

```
src/
├── components/
│   ├── GameCreator.tsx    # Player 1 creates game
│   ├── GamePlayer.tsx     # Player 2 joins & Player 1 reveals
│   └── GameStatus.tsx     # Display current game state
├── contracts/
│   ├── RPS.json           # Contract ABI
│   └── contractConfig.ts  # Bytecode & enums
├── utils/
│   ├── web3.ts            # Ethereum interaction
│   └── gameLogic.ts       # Game logic & crypto
├── App.tsx                # Main component
└── App.css                # Styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- MetaMask browser extension
- Sepolia testnet ETH ([Get from faucet](https://sepoliafaucet.com/))

### Installation

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
