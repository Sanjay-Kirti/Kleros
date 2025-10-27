# 🧪 Complete Testing Checklist

## Pre-Testing Setup

### Requirements:
- [ ] Chrome browser with MetaMask installed
- [ ] Two Ethereum accounts with Sepolia ETH
  - Account 1 (Player 1): `0x5d6aFAC77Dd0E875e7D5Ef60Eb0D201F62CfbB50`
  - Account 2 (Player 2): `0x913eED02050BCda2b74A7ed6295252944ae3369C`
- [ ] At least 0.01 Sepolia ETH in each account
- [ ] App running at http://localhost:3000

---

## Test Suite 1: Basic Functionality

### Test 1.1: Initial Load
- [ ] Open http://localhost:3000
- [ ] Page loads without errors
- [ ] See "Rock Paper Scissors Lizard Spock" title
- [ ] See "Connect Wallet" button
- [ ] Footer shows "Created by Sanjay Kirti"

### Test 1.2: MetaMask Connection
- [ ] Click "Connect Wallet"
- [ ] MetaMask popup appears
- [ ] Select Account 1
- [ ] Click "Connect"
- [ ] Address displayed: "Connected: 0x5d6a...bB50"
- [ ] No errors in console

### Test 1.3: Network Check
- [ ] If on wrong network, see "Please switch to Sepolia network"
- [ ] Click "Switch to Sepolia"
- [ ] MetaMask switches network
- [ ] UI updates to show game creation form

---

## Test Suite 2: Game Creation (Player 1)

### Test 2.1: Form Validation
- [ ] Try clicking "Create Game" without selecting move
  - **Expected:** Error: "Please select a move"
- [ ] Select "Rock"
- [ ] Leave opponent address empty, click "Create Game"
  - **Expected:** Error: "Please enter a valid Ethereum address"
- [ ] Enter invalid address "0x123", click "Create Game"
  - **Expected:** Error: "Please enter a valid Ethereum address"
- [ ] Enter your own address, click "Create Game"
  - **Expected:** Error: "You cannot play against yourself"
- [ ] Set stake to "0", click "Create Game"
  - **Expected:** Error: "Please enter a valid stake amount"

### Test 2.2: Successful Game Creation
- [ ] Select move: **Rock**
- [ ] Enter opponent: `0x913eED02050BCda2b74A7ed6295252944ae3369C`
- [ ] Set stake: `0.001`
- [ ] Click "Create Game"
- [ ] Status shows: "Preparing transaction..."
- [ ] Status shows: "Deploying game contract..."
- [ ] MetaMask popup appears
- [ ] Confirm transaction
- [ ] Wait for confirmation (~15 seconds)
- [ ] Status shows: "Game created successfully!"
- [ ] Contract address displayed
- [ ] Game state shows "WAITING_FOR_J2"

### Test 2.3: LocalStorage Persistence
- [ ] Note the contract address
- [ ] Close browser tab
- [ ] Reopen http://localhost:3000
- [ ] Connect wallet
- [ ] Game automatically loads
- [ ] Same contract address shown
- [ ] Your move still saved (not visible, but in localStorage)

---

## Test Suite 3: Player 2 Joins

### Test 3.1: Switch to Player 2
- [ ] In MetaMask, switch to Account 2
- [ ] Refresh page
- [ ] Connect wallet with Account 2
- [ ] See "Player 2: Make Your Move" section
- [ ] See stake amount: 0.001 ETH

### Test 3.2: Player 2 Move Submission
- [ ] Select move: **Paper** (should beat Rock)
- [ ] Click "Submit Move (0.001 ETH)"
- [ ] MetaMask popup shows:
  - To: [contract address]
  - Value: 0.001 ETH
  - Function: play(2)
- [ ] Confirm transaction
- [ ] Wait for confirmation
- [ ] Status shows: "Move submitted successfully!"
- [ ] UI updates to show "Waiting for Player 1 to reveal"

---

## Test Suite 4: Player 1 Reveals

### Test 4.1: Switch Back to Player 1
- [ ] In MetaMask, switch to Account 1
- [ ] Refresh page
- [ ] See "Time to Reveal Your Move!" section
- [ ] Your move shown: "Rock"

### Test 4.2: Reveal and Determine Winner
- [ ] Click "Reveal Your Move"
- [ ] MetaMask popup shows:
  - To: [contract address]
  - Function: solve(1, [salt])
- [ ] Confirm transaction
- [ ] Wait for confirmation
- [ ] Game result displayed:
  - **Player 1:** Rock
  - **Player 2:** Paper
  - **Winner:** Player 2 wins!
  - **Player 2 receives:** 0.002 ETH

### Test 4.3: Verify ETH Transfer
- [ ] Check Player 2's balance increased by ~0.002 ETH (minus gas)
- [ ] Check contract balance is 0
- [ ] Game state shows as completed

---

## Test Suite 5: Edge Cases

### Test 5.1: Tie Game
- [ ] Create new game
- [ ] Player 1 selects: **Scissors**
- [ ] Player 2 selects: **Scissors**
- [ ] Player 1 reveals
- [ ] Result shows: "It's a tie!"
- [ ] Both players get 0.001 ETH back

### Test 5.2: All Move Combinations
Test each winning combination:
- [ ] Rock beats Scissors ✓
- [ ] Rock beats Lizard ✓
- [ ] Paper beats Rock ✓
- [ ] Paper beats Spock ✓
- [ ] Scissors beats Paper ✓
- [ ] Scissors beats Lizard ✓
- [ ] Spock beats Rock ✓
- [ ] Spock beats Scissors ✓
- [ ] Lizard beats Spock ✓
- [ ] Lizard beats Paper ✓

### Test 5.3: Player 2 Timeout
- [ ] Create new game
- [ ] Don't let Player 2 play
- [ ] Wait 5+ minutes
- [ ] Player 1 clicks "Claim Timeout" button
- [ ] Player 1 gets 0.001 ETH back
- [ ] Game ends

### Test 5.4: Player 1 Timeout
- [ ] Create new game
- [ ] Player 2 plays
- [ ] Player 1 doesn't reveal
- [ ] Wait 5+ minutes
- [ ] Player 2 clicks "Claim Timeout" button
- [ ] Player 2 gets 0.002 ETH (both stakes)
- [ ] Game ends

---

## Test Suite 6: Security Checks

### Test 6.1: Salt Randomness
- [ ] Create 3 games with same move (Rock)
- [ ] Check contract addresses (different)
- [ ] Check c1Hash values (all different)
- [ ] **Confirms:** Salt is random each time

### Test 6.2: Cannot Change Move After Commitment
- [ ] Create game with Rock
- [ ] Note the commitment hash
- [ ] Try to reveal with Paper
- [ ] **Expected:** Transaction reverts
- [ ] **Confirms:** Commitment scheme works

### Test 6.3: Player 2 Cannot See Player 1's Move
- [ ] Create game as Player 1
- [ ] Switch to Player 2
- [ ] Check contract state on Etherscan
- [ ] See only c1Hash (not the actual move)
- [ ] **Confirms:** Move is hidden

---

## Test Suite 7: UI/UX

### Test 7.1: Responsive Design
- [ ] Resize browser window
- [ ] Mobile view (375px width)
- [ ] Tablet view (768px width)
- [ ] Desktop view (1920px width)
- [ ] All elements visible and usable

### Test 7.2: Loading States
- [ ] During transaction, button shows "Creating Game..."
- [ ] Button is disabled during loading
- [ ] Status messages update in real-time
- [ ] No double-clicking possible

### Test 7.3: Error Handling
- [ ] Reject MetaMask transaction
  - **Expected:** Error message shown
  - **Expected:** Can try again
- [ ] Disconnect wallet during game
  - **Expected:** Graceful handling
- [ ] Network error
  - **Expected:** Clear error message

---

## Test Suite 8: Browser Compatibility

### Test 8.1: Chrome (Primary)
- [ ] All features work
- [ ] MetaMask connects
- [ ] Transactions succeed

### Test 8.2: Firefox (Optional)
- [ ] Basic functionality works
- [ ] MetaMask connects

### Test 8.3: Brave (Optional)
- [ ] Basic functionality works
- [ ] Built-in wallet or MetaMask

---

## Final Checklist Before Deployment

- [ ] All tests in Suite 1-7 pass
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Build succeeds: `npm run build`
- [ ] Production build tested locally
- [ ] README.md updated
- [ ] Code commented where necessary
- [ ] Git repo clean (no debug files)

---

## Deployment Testing

After deploying to production:

- [ ] Live URL loads
- [ ] Can connect MetaMask
- [ ] Can create game
- [ ] Can play as Player 2
- [ ] Can reveal as Player 1
- [ ] Winner determined correctly
- [ ] ETH transferred correctly

---

## Known Issues / Limitations

Document any issues found:
- [ ] None currently

---

## Test Results

**Date Tested:** _______________  
**Tester:** Sanjay Kirti  
**Environment:** Chrome + MetaMask on Sepolia  
**Result:** ☐ PASS ☐ FAIL  

**Notes:**
