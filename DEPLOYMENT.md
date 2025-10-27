# 🚀 Deployment Guide

## Option 1: Vercel (Recommended - Easiest)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
cd /Users/luke/Documents/Developer/Kleros/rpsls-dapp
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? **Your account**
- Link to existing project? **N**
- Project name? **rpsls-dapp** (or your choice)
- Directory? **./** (press Enter)
- Override settings? **N**

### Step 4: Production Deployment
```bash
vercel --prod
```

Your app will be live at: `https://rpsls-dapp.vercel.app` (or similar)

---

## Option 2: Netlify

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Build the app
```bash
npm run build
```

### Step 3: Deploy
```bash
netlify deploy
```

Follow prompts:
- Create & configure new site? **Y**
- Team? **Your team**
- Site name? **rpsls-dapp**
- Publish directory? **build**

### Step 4: Production Deploy
```bash
netlify deploy --prod
```

---

## Option 3: GitHub Pages

### Step 1: Add homepage to package.json
```json
{
  "homepage": "https://yourusername.github.io/rpsls-dapp"
}
```

### Step 2: Install gh-pages
```bash
npm install --save-dev gh-pages
```

### Step 3: Add deploy scripts to package.json
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

### Step 4: Deploy
```bash
npm run deploy
```

---

## Post-Deployment Checklist

After deploying, test the live site:

1. ✅ Open the URL in Chrome
2. ✅ Connect MetaMask
3. ✅ Create a test game
4. ✅ Switch to Player 2 account
5. ✅ Play the game
6. ✅ Switch back to Player 1
7. ✅ Reveal and verify winner

---

## Update README with Live URL

After deployment, update README.md line 7:
```markdown
**URL:** https://your-deployed-url.vercel.app
```

---

## For Kleros Submission

Provide in Google Doc:
1. **Live URL:** https://your-deployed-url.vercel.app
2. **GitHub Repo:** https://github.com/yourusername/rpsls-dapp
3. **Network:** Sepolia Testnet
4. **Browser Tested:** Chrome with MetaMask
5. **Nash Equilibrium Answer:** (Already in README.md)
