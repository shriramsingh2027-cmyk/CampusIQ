# 📤 GITHUB UPLOAD INSTRUCTIONS

## ✅ Pre-Upload Checklist

Before uploading to GitHub, make sure:

1. ✅ `.env` file is in `.gitignore` (done)
2. ✅ No API keys in code (removed)
3. ✅ All bugs fixed (done)
4. ✅ Database working (verified)
5. ✅ README updated (done)

## 🚀 Upload to GitHub

### Step 1: Configure Git (if not already done)
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

### Step 2: Add All Changes
```bash
cd /Users/shri/hackathon
git add .
```

### Step 3: Check What Will Be Uploaded
```bash
git status
```

You should see:
- ✅ Modified files (README.md, frontend/script.js, backend/campusiq.db)
- ✅ New files (.gitignore, .env.example, TEST_LOGIN.md, DEPLOYMENT_READY.md, start.sh)
- ❌ NO .env file (should be listed in .gitignore)

### Step 4: Commit Changes
```bash
git commit -m "Fix: Database connection, remove AI features, add security config and documentation"
```

### Step 5: Push to GitHub
```bash
git push origin main
```

## 🔐 What NOT to Upload

These files should NEVER be committed:

❌ `.env` (contains API keys)
❌ `node_modules/` (too large)
❌ `*.log` files
❌ `.DS_Store`

## ✅ What IS Uploaded

These files should be on GitHub:

✅ `.gitignore` (protects sensitive files)
✅ `.env.example` (template for setup)
✅ `README.md` (project guide)
✅ `frontend/` (HTML, CSS, JS)
✅ `backend/server.js` (backend code)
✅ `backend/package.json` (dependencies list)
✅ `backend/campusiq.db` (test database)
✅ `TEST_LOGIN.md` (testing guide)
✅ `DEPLOYMENT_READY.md` (status document)
✅ `start.sh` (startup script)

## 📊 After Upload

1. GitHub will show your repository
2. Other developers can clone it:
   ```bash
   git clone https://github.com/shriramsingh2027-cmyk/CampusIQ1.git
   cd CampusIQ1
   ```
3. They should follow setup in README.md

## 🛟 If Something Goes Wrong

### To undo last commit (before push):
```bash
git reset --soft HEAD~1
```

### To see what was committed:
```bash
git log --oneline -5
```

### To check for exposed secrets:
```bash
grep -r "GEMINI_API_KEY" .
```

---

**That's it! Your project is ready for GitHub upload.** 🎉
