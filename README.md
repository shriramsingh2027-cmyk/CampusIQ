# CampusIQ - Student Opportunity & Mentoring Platform

A web application that helps college students discover opportunities (hackathons, internships, scholarships) and connect with resources.

## 🎯 Features

### ✅ Implemented
- **Student Authentication**: Secure login and signup with SQLite database
- **Dashboard**: Student overview with key information
- **Live Events**: Browse and filter upcoming opportunities
- **Profile Management**: View and update student profile
- **Database Integration**: SQLite for persistent user data

### 🔄 Disabled Features (To Be Implemented Later)
- AI Mentor
- Smart Recommendations
- College Helpdesk

## 📁 Project Structure

```
hackathon/
├── frontend/
│   ├── login.html           # Login/Signup page
│   ├── dashboard.html       # Student dashboard
│   ├── events.html          # Live events page
│   ├── profile.html         # Student profile
│   ├── script.js            # Frontend JavaScript
│   └── style.css            # Styling
├── backend/
│   ├── server.js            # Express backend
│   ├── campusiq.db          # SQLite database
│   ├── package.json         # Node dependencies
│   └── .env.example         # Environment template
├── README.md
└── TEST_LOGIN.md            # Testing guide
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- Python (v3.7+)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hackathon
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env and add your API keys (if needed)
   ```

3. **Start Servers**
   
   Terminal 1 - Backend:
   ```bash
   cd backend
   node server.js
   # Backend running at http://localhost:5050
   ```

   Terminal 2 - Frontend:
   ```bash
   cd /path/to/hackathon
   python3 -m http.server 8000
   # Frontend available at http://localhost:8000
   ```

4. **Open Application**
   - Visit: http://localhost:8000/frontend/login.html

## 🧪 Testing

See `TEST_LOGIN.md` for detailed testing instructions.

### Quick Test
- **Demo User**
  - ID: `2023000640`
  - Password: `password`

## 🔐 Security Notes

- `.env` file is NOT committed to GitHub (see `.gitignore`)
- Use `.env.example` as a template for local setup
- Never commit sensitive API keys or credentials
- Database file can be included for development/testing

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | Authenticate user |
| POST | `/register` | Create new account |
| POST | `/change-password` | Update password |

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Server**: Python HTTP Server (development)

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributors

- Shri Ram Singh

---

**Note**: AI features are currently disabled to avoid API quota issues. Database includes demo user for testing.
