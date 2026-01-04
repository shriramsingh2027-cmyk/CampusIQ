# Testing Login & Signup

## ✅ Status
- Backend: Running on http://localhost:5050
- Frontend: Running on http://localhost:8000
- Database: SQLite campusiq.db with 12 users

## 🧪 Test Instructions

### Test 1: Login with Demo User
1. Go to: http://localhost:8000/frontend/login.html
2. Enter:
   - Student ID: `2023000640`
   - Password: `password`
3. Click Login
4. Expected: Redirects to dashboard.html

### Test 2: Create New User (Sign Up)
1. Go to: http://localhost:8000/frontend/login.html
2. Click "Sign Up"
3. Fill form:
   - Student ID: `2024998877` (must be unique)
   - Name: `Your Name`
   - Email: `your@email.com`
   - Password: `test123`
4. Click "Create Account"
5. Expected: Success message, then returns to login
6. Login with new credentials to verify

### Test 3: Dashboard Access
After successful login, verify:
- Dashboard page loads
- Profile menu works (click 👤)
- Logout works

## ✅ AI Features Status
- AI Mentor: Disabled (no API errors)
- Recommendations: Disabled (no API errors)
- Helpdesk: Disabled (no API errors)

All features have fallback messages to prevent errors.
