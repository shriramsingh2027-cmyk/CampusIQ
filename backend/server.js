import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: `${__dirname}/.env` });

const app = express();
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const dbPath = `${__dirname}/campusiq.db`;
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("Database error:", err);
  else console.log("Connected to SQLite database");
});

// Create users table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentId TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    email TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Add a demo user if table is empty
db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
  if (row && row.count === 0) {
    db.run("INSERT INTO users (studentId, password, name, email) VALUES (?, ?, ?, ?)",
      ["2023000640", "password", "Demo Student", "demo@campus.edu"],
      (err) => {
        if (err) console.error("Error inserting demo user:", err);
        else console.log("Demo user created: ID=2023000640, Password=password");
      }
    );
  }
});

app.post("/ask-ai", async (req, res) => {
  const question = req.body.question;

  if (!question) {
    return res.json({ reply: "Question missing" });
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error("GEMINI_API_KEY is not set in environment");
    return res.status(500).json({ reply: "Server misconfigured: GEMINI_API_KEY not set." });
  }

  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${key}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are CampusIQ AI Mentor. Guide a college student clearly, practically, and step-by-step.\n\nStudent question:\n${question}`
              }
            ]
          }
        ]
      })
    });

    let data;
    try {
      data = await response.json();
    } catch (parseErr) {
      const text = await response.text();
      console.error("Non-JSON response from Generative API:", text);
      return res.status(502).json({ reply: "AI service returned non-JSON response." });
    }

    console.log("Generative API status:", response.status);
    console.debug("Generative API response:", JSON.stringify(data));

    const replyCandidates = [
      data?.candidates?.[0]?.content?.[0]?.text,
      data?.candidates?.[0]?.content?.parts?.[0]?.text,
      data?.candidates?.[0]?.message?.content?.[0]?.text,
      data?.output?.[0]?.content?.[0]?.text,
      data?.candidates?.[0]?.text,
      data?.content?.[0]?.text,
      data?.output?.[0]?.text
    ];

    const reply = replyCandidates.find((r) => typeof r === "string" && r.trim().length > 0) ||
      (data?.error?.message ? `AI error: ${data.error.message}` : "AI could not generate a response.");

    if (!response.ok) {
      console.error("Generative API error status", response.status, data);

      if (response.status === 429) {
        const fallbackReply = generateFallbackResponse(question);
        return res.json({
          reply: fallbackReply,
          note: "⚠️ Using offline guidance (API quota exceeded). Add billing to unlock unlimited access."
        });
      }

      return res.status(502).json({ reply: `AI service error (status ${response.status}). Check server logs for details.` });
    }

    res.json({ reply });

  } catch (err) {
    console.error("Request to Generative API failed:", err);
    res.status(502).json({ reply: "AI failed internally" });
  }
});

function generateFallbackResponse(question) {
  const q = question.toLowerCase();

  if (q.includes("internship") || q.includes("intern")) {
    return `💼 Internship Guidance:\n\n1. Build a Strong Resume - Highlight projects, skills, relevant experience\n2. Learn In-Demand Skills - AI/ML, Web Dev, Cloud fundamentals\n3. Apply Early - Start in December-January for summer internships\n4. Platforms - LinkedIn, Internshala, AngelList, company pages\n5. Interview Prep - Practice DSA, system design, behavioral questions\n6. Networking - Connect with alumni, attend tech events\n\nStart building projects NOW! 🚀`;
  }

  if (q.includes("hackathon")) {
    return `🏆 Hackathon Guide:\n\n1. Choose Your Team - Find 2-3 teammates with complementary skills\n2. Brainstorm Ideas - Pick problems solvable in 24-48 hours\n3. Tech Stack - Use familiar technologies\n4. Planning - Spend 2 hours on planning and architecture\n5. MVP First - Build core features first, add extras later\n6. Popular Events - TechSprint, Smart India Hackathon, HackCMU\n7. Presentation - Code cleanly, document well, present clearly\n\nStart small, iterate fast! 💪`;
  }

  if (q.includes("skill") || q.includes("learn")) {
    return `📚 Skill Building Strategy:\n\n1. Choose a Path - Web Dev, AI/ML, Cloud, DevOps\n2. Learn Structured - Use Udemy, Coursera, official docs\n3. Build Projects - Apply knowledge through real projects\n4. Practice Coding - 30 mins daily on LeetCode/HackerRank\n5. Open Source - Contribute to build portfolio\n6. Stay Updated - Follow blogs, communities, YouTube channels\n7. Consistency - Daily practice beats weekend marathons\n\nPick ONE skill and master it deeply! 🎯`;
  }

  if (q.includes("ai") || q.includes("ml") || q.includes("machine")) {
    return `🤖 AI/ML Learning Path:\n\n1. Foundation - Python, Linear Algebra, Stats, Probability\n2. Core ML - Supervised, Unsupervised, Neural Networks\n3. Advanced - Deep Learning, NLP, Computer Vision\n4. Resources - Andrew Ng's course, FastAI, TensorFlow docs\n5. Projects - Classification → Sentiment → Vision → Custom\n6. Research - Follow papers, try models on Hugging Face\n7. Interview - Understand algorithms deeply\n\nStart with Python + math! 🧠`;
  }

  if (q.includes("3rd year") || q.includes("career") || q.includes("path")) {
    return `🎓 3rd Year Strategy:\n\n1. Internship - Secure 1-2 summer internships for experience\n2. Skills - Master one domain deeply\n3. Placements - Start DSA + System Design prep\n4. Projects - Build 2-3 portfolio projects\n5. Network - Connect with mentors, seniors, professionals\n6. Contribute - Freelance, open source, side projects\n7. Balance - Academics + Placements + Learning\n\nThis year defines your career! 📈`;
  }

  return `🤖 CampusIQ AI Mentor (Offline Mode):\n\nOur AI is at capacity right now. Here's practical advice:\n\n1. Internships - Build projects, apply to companies\n2. Skills - Follow structured learning paths\n3. Hackathons - Team up, plan, code, iterate\n4. Career - Network, learn, contribute\n\n💡 Best mentor = consistent practice + real projects\n\nAsk about internships, skills, hackathons, or career paths!`;
}

// ============ AUTHENTICATION ENDPOINTS ============

// Login endpoint
app.post("/login", (req, res) => {
  const { studentId, password } = req.body;

  if (!studentId || !password) {
    return res.status(400).json({ success: false, message: "Student ID and password are required" });
  }

  db.get(
    "SELECT * FROM users WHERE studentId = ? AND password = ?",
    [studentId, password],
    (err, user) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Database error" });
      }

      if (user) {
        return res.json({
          success: true,
          message: "Login successful",
          user: { id: user.id, studentId: user.studentId, name: user.name }
        });
      } else {
        return res.status(401).json({ success: false, message: "Invalid Student ID or password" });
      }
    }
  );
});

// Register endpoint
app.post("/register", (req, res) => {
  const { studentId, password, name, email } = req.body;

  if (!studentId || !password || !name) {
    return res.status(400).json({ success: false, message: "Student ID, password, and name are required" });
  }

  if (studentId.length < 6) {
    return res.status(400).json({ success: false, message: "Student ID must be at least 6 characters" });
  }

  if (password.length < 4) {
    return res.status(400).json({ success: false, message: "Password must be at least 4 characters" });
  }

  db.run(
    "INSERT INTO users (studentId, password, name, email) VALUES (?, ?, ?, ?)",
    [studentId, password, name, email],
    (err) => {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(409).json({ success: false, message: "Student ID already registered" });
        }
        return res.status(500).json({ success: false, message: "Registration failed" });
      }

      return res.json({
        success: true,
        message: "Registration successful. You can now login."
      });
    }
  );
});

// Change Password endpoint
app.post("/change-password", (req, res) => {
  const { studentId, oldPassword, newPassword } = req.body;

  if (!studentId || !oldPassword || !newPassword) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  if (newPassword.length < 4) {
    return res.status(400).json({ success: false, message: "New password must be at least 4 characters" });
  }

  db.get(
    "SELECT * FROM users WHERE studentId = ? AND password = ?",
    [studentId, oldPassword],
    (err, user) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Database error" });
      }

      if (!user) {
        return res.status(401).json({ success: false, message: "Incorrect current password" });
      }

      db.run(
        "UPDATE users SET password = ? WHERE studentId = ?",
        [newPassword, studentId],
        (updateErr) => {
          if (updateErr) {
            return res.status(500).json({ success: false, message: "Failed to update password" });
          }

          return res.json({
            success: true,
            message: "Password updated successfully"
          });
        }
      );
    }
  );
});

// ============ AI RECOMMENDATION ENDPOINT ============

app.post("/get-recommendation", async (req, res) => {
  const { domain, year, goal, skills } = req.body;

  if (!domain || !year || !goal) {
    return res.json({ reply: "Please select all required fields" });
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return res.status(500).json({ reply: "Server misconfigured" });
  }

  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${key}`;

  try {
    const prompt = `You are a college career advisor at CampusIQ. Provide personalized recommendations for a student with:
- Domain: ${domain}
- Year: ${year}
- Goal: ${goal}
${skills ? `- Current Skills: ${skills}` : ""}

Give 3-4 specific, actionable recommendations with resources, timelines, and next steps. Be practical and encouraging.`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    let data = await response.json();
    console.log("Recommendation API status:", response.status);

    const replyCandidates = [
      data?.candidates?.[0]?.content?.[0]?.text,
      data?.candidates?.[0]?.content?.parts?.[0]?.text
    ];

    const reply = replyCandidates.find((r) => typeof r === "string" && r.trim().length > 0) ||
      "Could not generate recommendations. Please try again.";

    if (!response.ok) {
      if (response.status === 429) {
        return res.json({
          reply: generateFallbackRecommendation(domain, year, goal, skills)
        });
      }
      return res.json({ reply: "AI service temporarily unavailable." });
    }

    res.json({ reply });

  } catch (err) {
    console.error("Recommendation request failed:", err);
    res.json({ reply: generateFallbackRecommendation(domain, year, goal, skills) });
  }
});

// ============ AI HELPDESK ENDPOINT ============

app.post("/ask-helpdesk", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.json({ reply: "Please ask a question" });
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return res.status(500).json({ reply: "Server misconfigured" });
  }

  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${key}`;

  try {
    const prompt = `You are a helpful college helpdesk assistant for CampusIQ. Answer this academic/administrative question clearly and accurately:

Question: ${question}

Provide clear, concise, official guidance. If you don't know, suggest where they can find the answer.`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    let data = await response.json();
    console.log("Helpdesk API status:", response.status);

    const replyCandidates = [
      data?.candidates?.[0]?.content?.[0]?.text,
      data?.candidates?.[0]?.content?.parts?.[0]?.text
    ];

    const reply = replyCandidates.find((r) => typeof r === "string" && r.trim().length > 0) ||
      "Could not process question. Please try again.";

    if (!response.ok) {
      if (response.status === 429) {
        return res.json({
          reply: generateFallbackHelpdesk(question)
        });
      }
      return res.json({ reply: "Helpdesk service temporarily unavailable." });
    }

    res.json({ reply });

  } catch (err) {
    console.error("Helpdesk request failed:", err);
    res.json({ reply: generateFallbackHelpdesk(question) });
  }
});

// ============ FALLBACK FUNCTIONS ============

function generateFallbackRecommendation(domain, year, goal, skills) {
  return `📊 Smart Recommendation for ${domain.toUpperCase()} | Year ${year} | Goal: ${goal.toUpperCase()}\n\n` +
    `Based on your profile${skills ? ` and skills (${skills})` : ""}, here's your path:\n\n` +
    `1. **Immediate Actions** (Next 2 weeks)\n` +
    `   - Set up portfolio on GitHub/LinkedIn\n` +
    `   - Complete 1 relevant online course\n\n` +
    `2. **Mid-term Goals** (Next 3 months)\n` +
    `   - Build 2-3 projects in your domain\n` +
    `   - Apply to ${goal === 'internship' ? 'internships' : goal === 'hackathon' ? 'hackathons' : 'opportunities'}\n\n` +
    `3. **Long-term Strategy** (Next 6 months)\n` +
    `   - Contribute to open source\n` +
    `   - Network with professionals in ${domain}\n\n` +
    `💡 Pro tip: Consistency beats intensity. Start small, iterate fast!`;
}

function generateFallbackHelpdesk(question) {
  const q = question.toLowerCase();

  if (q.includes("attend")) {
    return "📌 **Attendance Requirements**\n\nMinimum 75% attendance required to be eligible for final exams. Medical certificates can be used for legitimate absences. Contact your department head for exemptions.";
  }
  if (q.includes("internship") || q.includes("credit")) {
    return "📌 **Internship Credits**\n\nInternship credits are awarded based on:\n- Duration (minimum 4 weeks)\n- Completion certificate\n- Faculty approval\n- Quality of work\n\nContact your placement cell for details.";
  }
  if (q.includes("exam") || q.includes("eligible")) {
    return "📌 **Exam Eligibility**\n\nYou're eligible for exams if:\n✓ Minimum 75% attendance\n✓ Fees paid on time\n✓ No pending academic issues\n\nCheck your student portal for eligibility status.";
  }
  if (q.includes("internal") || q.includes("assessment")) {
    return "📌 **Internal Assessment**\n\nInternal marks are based on:\n- Assignments (40%)\n- Quizzes (30%)\n- Class participation (20%)\n- Attendance (10%)\n\nTotal: 50 marks contributing to final grade.";
  }
  if (q.includes("club") || q.includes("participation")) {
    return "📌 **Club Participation**\n\nYou can join clubs if:\n✓ Minimum 6.0 CGPA\n✓ No academic probation\n✓ Attendance maintained\n\nRegister through the student portal.";
  }

  return "📌 **General Support**\n\nYour question will be forwarded to the appropriate department. You'll receive a response within 24-48 hours. For urgent matters, contact your department office directly.";
}

app.listen(5050, () => {
  console.log("Backend running at http://localhost:5050");
});
