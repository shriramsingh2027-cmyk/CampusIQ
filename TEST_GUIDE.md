# 🧪 Complete Testing Guide for CampusIQ

## **Step-by-Step Test Flow**

### **1️⃣ LOGIN TEST**
**Start:** http://localhost:8000/login.html

**Test Case 1: Demo User**
- Student ID: `2023000640`
- Password: `password`
- Expected: ✅ Login successful → Redirects to dashboard

**Test Case 2: Empty Fields**
- Click Login without entering anything
- Expected: ❌ Error message "Please enter your Student ID"

**Test Case 3: Invalid Credentials**
- Student ID: `9999999999`
- Password: `wrong123`
- Expected: ❌ Error message "Invalid Student ID or password"

**Test Case 4: Register New User**
- Click "Register here"
- Fill form: ID: `2024001111`, Name: `Test User`, Email: `test@test.com`, Password: `test123`
- Click Register
- Expected: ✅ Success message
- Auto-switch to login
- Login with new credentials
- Expected: ✅ Should work now

---

### **2️⃣ DASHBOARD TEST**
**Start:** http://localhost:8000/dashboard.html

**Profile Menu Test:**
1. Click the profile icon (👤) in top-right
2. Menu should appear with:
   - ID: 2023000640
   - Change Password
   - Logout (in red)
3. Click Logout
4. Expected: ✅ Redirects to login.html

---

### **3️⃣ MENTOR (AI) TEST**
**Start:** http://localhost:8000/mentor.html

**Test:**
1. Type: "i need intern suggestions"
2. Click "Get Mentor Guidance"
3. Expected: 
   - ✅ Shows response (AI if quota available, fallback if not)
   - Loading state shows briefly
   - Response appears with formatting

---

### **4️⃣ RECOMMEND (AI) TEST**
**Start:** http://localhost:8000/recommend.html

**Test:**
1. Domain: "AI / ML"
2. Year: "3rd Year"
3. Goal: "Internships"
4. Skills: "Python, Machine Learning, TensorFlow"
5. Click "Get Smart Recommendations"
6. Expected:
   - ✅ Loading state: "🤖 Generating personalized recommendations..."
   - Shows AI-generated recommendations
   - Formatted with numbered steps and bullet points

---

### **5️⃣ HELPDESK (AI) TEST**
**Start:** http://localhost:8000/helpdesk.html

**Test:**
1. Ask: "What is minimum attendance required?"
2. Click "Get Answer"
3. Expected:
   - ✅ Loading state: "🤖 Finding answer..."
   - Shows intelligent response about attendance
   - Formatted nicely

**Test Different Question:**
1. Ask: "How do internship credits work?"
2. Expected: ✅ Different, relevant response

---

### **6️⃣ COMPLETE USER JOURNEY**

1. **Start at login page** → http://localhost:8000/login.html
2. **Register new account** 
   - Click "Register here"
   - Fill in details
   - Register successfully
3. **Login with new account**
   - Use your new credentials
   - Should land on dashboard
4. **Explore all pages**
   - Dashboard
   - Mentor (ask AI questions)
   - Recommend (get recommendations with skills)
   - Helpdesk (ask college questions)
5. **Test profile menu**
   - Click profile icon
   - Verify menu appears
   - Click Logout
   - Should go back to login
6. **Login again**
   - Use demo account: 2023000640 / password
   - Should work

---

## ✅ **Expected Results**

All of the above should work without errors. If you encounter any issues:

**Profile menu not showing:**
- Check browser console for errors (F12)
- Try refreshing the page

**AI responses not working:**
- Check if backend is running: `ps aux | grep "node.*server.js"`
- Check logs: `tail -20 /tmp/backend.log`

**Login not working:**
- Verify database exists: `ls /Users/shri/hackathon/backend/campusiq.db`
- Check credentials are correct

---

## 🚀 **Quick Command to Start Everything**

```bash
# Terminal 1: Start Backend
cd /Users/shri/hackathon/backend
node server.js

# Terminal 2: Start Frontend
cd /Users/shri/hackathon
python3 -m http.server 8000
```

Then open: http://localhost:8000/login.html
