# 🚀 GitHub + Vercel Deployment Guide

## 📋 Pre-Deployment Checklist

✅ **Completed:**
- [x] All unnecessary files removed
- [x] Build tested and working
- [x] Code cleaned up
- [x] Documentation complete
- [x] Git initialized

---

## 🔧 Step-by-Step Deployment

### **Step 1: Commit All Changes to Git**

```bash
cd /Users/luke/Documents/Developer/Kleros/rpsls-dapp

# Add all files
git add .

# Commit with descriptive message
git commit -m "Complete RPSLS dApp for Kleros submission

- Implemented commitment scheme with cryptographic salt
- Added timeout mechanisms
- Created modern UI with green/white theme
- Full documentation included
- Ready for production deployment"

# Verify commit
git log --oneline -1
```

---

### **Step 2: Create GitHub Repository**

**Option A: Via GitHub Website (Recommended)**

1. Go to https://github.com/new
2. Repository name: `rpsls-dapp`
3. Description: `Rock Paper Scissors Lizard Spock - Decentralized Game on Ethereum`
4. Visibility: **Public** (required for free Vercel deployment)
5. **DO NOT** initialize with README (we already have one)
6. Click "Create repository"

**Option B: Via GitHub CLI**

```bash
# Install GitHub CLI if not installed
brew install gh

# Login
gh auth login

# Create repo
gh repo create rpsls-dapp --public --source=. --remote=origin
```

---

### **Step 3: Push to GitHub**

After creating the repo, GitHub will show you commands. Use these:

```bash
# Add GitHub as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/rpsls-dapp.git

# Verify remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

**Verify:** Visit `https://github.com/YOUR_USERNAME/rpsls-dapp` to see your code

---

### **Step 4: Deploy to Vercel**

**Method 1: Vercel Website (Easiest)**

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Click "Import Git Repository"
4. Select your GitHub account
5. Find `rpsls-dapp` and click "Import"
6. **Framework Preset:** Vercel auto-detects "Create React App" ✅
7. **Root Directory:** `./` (leave as is)
8. **Build Command:** `npm run build` (auto-filled)
9. **Output Directory:** `build` (auto-filled)
10. Click "Deploy"

**Wait 2-3 minutes...**

✅ **Deployment Complete!**

Your app will be live at: `https://rpsls-dapp.vercel.app` (or similar)

---

**Method 2: Vercel CLI (Alternative)**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link to GitHub repo
vercel link

# Deploy to production
vercel --prod
```

---

### **Step 5: Test Deployment**

1. **Open the live URL** in Chrome
2. **Connect MetaMask** (make sure you're on Sepolia)
3. **Create a test game:**
   - Select Rock
   - Enter Player 2 address: `0x913eED02050BCda2b74A7ed6295252944ae3369C`
   - Stake: 0.001 ETH
   - Create game
4. **Switch to Player 2 account**
5. **Play move** (e.g., Paper)
6. **Switch back to Player 1**
7. **Reveal move**
8. **Verify winner** is displayed correctly

---

### **Step 6: Update Documentation**

After successful deployment, update these files with your live URL:

**1. README.md (Line 7):**
```markdown
**URL:** https://rpsls-dapp.vercel.app
```

**2. KLEROS_SUBMISSION.md (Line 8):**
```markdown
**URL:** https://rpsls-dapp.vercel.app
```

**3. Commit and push updates:**
```bash
git add README.md KLEROS_SUBMISSION.md
git commit -m "Add live deployment URL"
git push
```

Vercel will automatically redeploy with the updated README!

---

## 🎯 Final Submission to Kleros

### **What to Submit in Google Doc:**

1. **Live Application URL:**
   ```
   https://rpsls-dapp.vercel.app
   ```

2. **GitHub Repository:**
   ```
   https://github.com/YOUR_USERNAME/rpsls-dapp
   ```

3. **Network:**
   ```
   Sepolia Testnet
   ```

4. **Browser Tested:**
   ```
   Chrome with MetaMask extension
   ```

5. **Nash Equilibrium Answer:**
   ```
   Mixed Strategy Nash Equilibrium: Each player should play each 
   of the 5 moves with equal probability of 1/5 (20%).
   
   Reasoning: The game is symmetric with each move beating exactly 
   2 others and losing to exactly 2 others. Any deviation from 
   uniform randomness can be exploited by the opponent. Expected 
   payoff is 0 for both players using this strategy.
   ```

---

## 🔄 Auto-Deployment Setup

Once connected to Vercel, every `git push` will automatically deploy!

```bash
# Make changes
git add .
git commit -m "Update UI"
git push

# Vercel automatically:
# 1. Detects the push
# 2. Runs npm run build
# 3. Deploys new version
# 4. Updates live URL
```

---

## 📊 Vercel Dashboard Features

After deployment, you can:

- **View Deployments:** See all deployment history
- **Check Logs:** Debug any build issues
- **Monitor Analytics:** See visitor stats
- **Custom Domain:** Add your own domain (optional)
- **Environment Variables:** Add secrets if needed

---

## 🐛 Troubleshooting

### **Build Fails on Vercel**

**Check:**
1. Does `npm run build` work locally?
2. Are all dependencies in package.json?
3. Check Vercel build logs for specific error

**Fix:**
```bash
# Test build locally
npm run build

# If it works, push again
git push
```

### **App Loads but MetaMask Won't Connect**

**Check:**
1. Is MetaMask installed?
2. Are you on Sepolia network?
3. Check browser console for errors

### **Transactions Fail**

**Check:**
1. Do you have Sepolia ETH?
2. Is gas price too low?
3. Check Etherscan for transaction details

---

## ✅ Deployment Complete!

Your RPSLS dApp is now:
- ✅ Live on the internet
- ✅ Accessible via HTTPS
- ✅ Hosted on global CDN
- ✅ Auto-deploying on git push
- ✅ Ready for Kleros submission

**Next:** Submit to Kleros and wait for review! 🎉
