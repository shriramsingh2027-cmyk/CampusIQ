// ============ AUTHENTICATION FUNCTIONS ============
const API_BASE_URL = "http://localhost:5050";


function switchToRegister() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "block";
  document.getElementById("formTitle").innerText = "Create Account";
  document.getElementById("formSubtitle").innerText = "Sign up for CampusIQ";
}

function switchToLogin() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("formTitle").innerText = "Welcome to CampusIQ";
  document.getElementById("formSubtitle").innerText = "Student Login";
}

async function handleLogin() {
  const studentId = document.getElementById("studentId").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorDiv = document.getElementById("errorMessage");
  const successDiv = document.getElementById("successMessage");

  // Hide messages
  errorDiv.style.display = "none";
  successDiv.style.display = "none";

  // Client-side validation
  if (!studentId) {
    errorDiv.innerText = "❌ Please enter your Student ID";
    errorDiv.style.display = "block";
    return;
  }

  if (!password) {
    errorDiv.innerText = "❌ Please enter your password";
    errorDiv.style.display = "block";
    return;
  }

  try {
    const response = await fetch("http://localhost:5050/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, password })
    });

    const data = await response.json();

    if (data.success) {
      // Store student ID in localStorage
      localStorage.setItem("studentId", studentId);
      successDiv.innerText = "✅ " + data.message;
      successDiv.style.display = "block";
      console.log("Login successful, redirecting...");
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 2000);
    } else {
      errorDiv.innerText = "❌ " + (data.message || "Login failed");
      errorDiv.style.display = "block";
      console.log("Login failed:", data.message);
    }
  } catch (error) {
    console.error("Login error:", error);
    errorDiv.innerText = "❌ Connection error. Please try again.";
    errorDiv.style.display = "block";
  }
}

async function handleRegister() {
  const studentId = document.getElementById("regStudentId").value.trim();
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const errorDiv = document.getElementById("regErrorMessage");
  const successDiv = document.getElementById("regSuccessMessage");

  // Hide messages
  errorDiv.style.display = "none";
  successDiv.style.display = "none";

  // Validation
  if (!studentId) {
    errorDiv.innerText = "❌ Please enter your Student ID";
    errorDiv.style.display = "block";
    return;
  }

  if (studentId.length < 6) {
    errorDiv.innerText = "❌ Student ID must be at least 6 characters";
    errorDiv.style.display = "block";
    return;
  }

  if (!name) {
    errorDiv.innerText = "❌ Please enter your full name";
    errorDiv.style.display = "block";
    return;
  }

  if (!password) {
    errorDiv.innerText = "❌ Please enter a password";
    errorDiv.style.display = "block";
    return;
  }

  if (password.length < 4) {
    errorDiv.innerText = "❌ Password must be at least 4 characters";
    errorDiv.style.display = "block";
    return;
  }

  try {
    const response = await fetch("http://localhost:5050/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, password, name, email })
    });

    const data = await response.json();

    if (data.success) {
      document.getElementById("regStudentId").value = "";
      document.getElementById("regName").value = "";
      document.getElementById("regEmail").value = "";
      document.getElementById("regPassword").value = "";

      // Switch to login and show success message there
      switchToLogin();
      const loginSuccessDiv = document.getElementById("successMessage");
      loginSuccessDiv.innerText = "✅ " + data.message;
      loginSuccessDiv.style.display = "block";
    } else {
      errorDiv.innerText = "❌ " + data.message;
      errorDiv.style.display = "block";
    }
  } catch (error) {
    errorDiv.innerText = "❌ Connection error. Please try again.";
    errorDiv.style.display = "block";
  }
}

function validateAndLogin() {
  window.location.href = "dashboard.html";
}

function toggleProfile() {
  const menu = document.getElementById("profileMenu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function logout() {
  window.location.href = "login.html";
}

function openProfile() {
  window.location.href = "profile.html";
}

async function handleChangePassword() {
  const currentPassword = document.getElementById("currentPassword").value.trim();
  const newPassword = document.getElementById("newPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const errorDiv = document.getElementById("passwordError");
  const successDiv = document.getElementById("passwordSuccess");
  const studentId = localStorage.getItem("studentId"); // Retrieve stored ID

  // Reset messages
  errorDiv.style.display = "none";
  successDiv.style.display = "none";

  if (!studentId) {
    errorDiv.innerText = "❌ User session not found. Please login again.";
    errorDiv.style.display = "block";
    return;
  }

  if (!currentPassword || !newPassword || !confirmPassword) {
    errorDiv.innerText = "❌ All fields are required.";
    errorDiv.style.display = "block";
    return;
  }

  if (newPassword !== confirmPassword) {
    errorDiv.innerText = "❌ New passwords do not match.";
    errorDiv.style.display = "block";
    return;
  }

  if (newPassword.length < 4) {
    errorDiv.innerText = "❌ New password must be at least 4 characters.";
    errorDiv.style.display = "block";
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, oldPassword: currentPassword, newPassword })
    });

    const data = await response.json();

    if (data.success) {
      successDiv.innerText = "✅ " + data.message;
      successDiv.style.display = "block";

      // Clear fields
      document.getElementById("currentPassword").value = "";
      document.getElementById("newPassword").value = "";
      document.getElementById("confirmPassword").value = "";
    } else {
      errorDiv.innerText = "❌ " + data.message;
      errorDiv.style.display = "block";
    }
  } catch (error) {
    console.error("Error:", error);
    errorDiv.innerText = "❌ Connection error. Please try again.";
    errorDiv.style.display = "block";
  }
}



// mentor page (disabled - no AI)

function askMentor() {
  const input = document.getElementById("mentorInput").value;
  const output = document.getElementById("mentorOutput");

  if (input.trim() === "") {
    output.innerText = "Please ask a question so I can help you 🙂";
    return;
  }

  output.innerText = "✅ Thank you for your question. AI features are currently disabled.";
}






// recommend (disabled - no AI)

function getRecommendations() {
  const domain = document.getElementById("domain").value;
  const year = document.getElementById("year").value;
  const goal = document.getElementById("goal").value;

  const list = document.getElementById("recommendationList");
  const box = document.getElementById("recommendationBox");

  if (!domain || !year || !goal) {
    alert("Please select all fields");
    return;
  }

  box.style.display = "block";
  list.innerHTML = '<div class="card" style="margin:0; padding: 12px;"><b>✅ AI recommendations are disabled.</b><br>Please explore the Live Events page to find opportunities.</div>';
}

// ============ HELPDESK FUNCTION (disabled - no AI) ============

function askHelpdeskAI() {
  const question = document.getElementById("helpdeskInput").value.trim();
  const output = document.getElementById("helpdeskOutput");
  const errorDiv = document.getElementById("helpdeskError");

  if (!question) {
    output.innerText = "Please enter a question so I can assist you.";
    return;
  }

  output.innerText = "✅ Thank you for your question. Helpdesk AI is currently disabled.";
  errorDiv.style.display = "none";
}

// Legacy function for backward compatibility
function askHelpdesk() {
  askHelpdeskAI();
}
// ============ UI UPDATES ============
document.addEventListener("DOMContentLoaded", () => {
  const studentId = localStorage.getItem("studentId");
  if (studentId) {
    const profileIdEl = document.getElementById("profileStudentId");
    if (profileIdEl) {
      profileIdEl.innerHTML = `<b>ID:</b> ${studentId}`;
    }
  }

  // Try to render calendar if on the correct page
  renderCalendar();

  // Try to render registered events if on the correct page
  renderRegisteredEvents();
});

// ============ CALENDAR FUNCTIONALITY ============

function getGoogleCalendarUrl(eventName, dateString) {
  // Simple heuristic for date parsing
  // Expected formats like: "20 Jan 2026", "Feb 2026", "Rolling"

  let start = new Date();

  // Handle "Rolling" or unparseable
  if (dateString.toLowerCase().includes("rolling")) {
    start.setDate(start.getDate() + 7); // Default to next week
  } else {
    // Try to parse typical string
    const parsed = new Date(dateString);
    if (!isNaN(parsed)) {
      start = parsed;
    } else {
      start.setDate(start.getDate() + 1); // Default tomorrow
    }
  }

  // Format to YYYYMMDD
  const formatDate = (date) => {
    return date.toISOString().replace(/-|:|\.\d\d\d/g, "").substring(0, 8);
  };

  const dayStr = formatDate(start);
  const nextDay = new Date(start);
  nextDay.setDate(start.getDate() + 1);
  const nextDayStr = formatDate(nextDay);

  // Encode details
  const title = encodeURIComponent(`CampusIQ Event: ${eventName}`);
  const details = encodeURIComponent("Saved from CampusIQ Live Events portal.");

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dayStr}/${nextDayStr}`;
}

// Step 1: User clicks "Add to Calendar"
function addToCalendar(eventName, eventDate) {
  const studentId = localStorage.getItem("studentId");
  if (!studentId) {
    alert("Please log in to save events.");
    return;
  }

  // Check duplication first
  let calendar = JSON.parse(localStorage.getItem(`calendar_${studentId}`)) || [];
  if (calendar.some(e => e.name === eventName)) {
    showModal("Already Added", "This event is already in your calendar timeline.", false);
    return;
  }

  // Show Step 1: Ask for Google Calendar
  const gCalUrl = getGoogleCalendarUrl(eventName, eventDate);
  showGoogleAskModal(eventName, eventDate, gCalUrl);
}

// Custom Modal for Step 1
function showGoogleAskModal(eventName, eventDate, gCalUrl) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const box = document.createElement("div");
  box.className = "modal-box";

  box.innerHTML = `
    <div class="modal-icon">📲</div>
    <h2 style="margin-bottom: 12px; color: #1F2937;">Google Calendar Reminder?</h2>
    <p style="color: #6B7280; margin-bottom: 24px;">Do you want to add this to your <b>Google Calendar</b> (Phone) as a reminder?</p>
    
    <button id="btnYes" style="width:100%; padding:12px; background:var(--primary); color:white; border:none; border-radius:8px; font-weight:600; margin-bottom:10px; cursor:pointer;">
      Yes, Add Reminder 📅
    </button>
    <button id="btnNo" style="width:100%; padding:12px; background:white; color:#6B7280; border:1px solid #E5E7EB; border-radius:8px; font-weight:600; cursor:pointer;">
      No, just Sidebar
    </button>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  // Handlers
  document.getElementById("btnYes").onclick = () => {
    window.open(gCalUrl, '_blank');
    overlay.remove();
    finalizeEventAdd(eventName, eventDate); // Proceed to Step 2
  };

  document.getElementById("btnNo").onclick = () => {
    overlay.remove();
    finalizeEventAdd(eventName, eventDate); // Proceed to Step 2
  };
}


// Step 2: Save locally and show final confirmation
function finalizeEventAdd(eventName, eventDate) {
  const studentId = localStorage.getItem("studentId");
  let calendar = JSON.parse(localStorage.getItem(`calendar_${studentId}`)) || [];

  calendar.push({
    name: eventName,
    date: eventDate,
    addedOn: new Date().toISOString()
  });

  localStorage.setItem(`calendar_${studentId}`, JSON.stringify(calendar));

  // 2nd Confirmation
  showModal(
    "Added to Sidebar!",
    `"<b>${eventName}</b>" has been saved to your personal timeline on the sidebar.`,
    true
  );
}


function renderCalendar() {
  const content = document.getElementById("calendarContent");
  const emptyState = document.getElementById("emptyState");

  if (!content) return; // Not on calendar page

  const studentId = localStorage.getItem("studentId");
  if (!studentId) {
    content.innerHTML = '<div class="card">Please log in to view your calendar.</div>';
    return;
  }

  const calendar = JSON.parse(localStorage.getItem(`calendar_${studentId}`)) || [];

  if (calendar.length === 0) {
    content.style.display = "none";
    emptyState.style.display = "block";
    return;
  }

  content.innerHTML = "";
  content.style.display = "flex";
  emptyState.style.display = "none";

  calendar.forEach((event, index) => {
    const card = document.createElement("div");
    card.className = "card blue-bordered-card";
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h3 style="margin:0;">${event.name}</h3>
          <p style="color:var(--text-light); margin-top:4px;">📅 Due: <b>${event.date}</b></p>
        </div>
        <button onclick="removeFromCalendar(${index})" style="background:#fee; color:#c33; border:1px solid #c33; padding: 6px 12px; font-size:12px;">✖ Remove</button>
      </div>
    `;
    content.appendChild(card);
  });
}

function removeFromCalendar(index) {
  const studentId = localStorage.getItem("studentId");
  let calendar = JSON.parse(localStorage.getItem(`calendar_${studentId}`)) || [];

  if (confirm(`Remove "${calendar[index].name}" from your calendar?`)) {
    calendar.splice(index, 1);
    localStorage.setItem(`calendar_${studentId}`, JSON.stringify(calendar));
    renderCalendar(); // Re-render
  }
}

// ============ EVENT BUTTON INTERACTIONS ============

function showModal(title, message, isSuccess = true) {
  // Create overlay
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  // Create box
  const box = document.createElement("div");
  box.className = "modal-box";

  // Content
  const icon = isSuccess ? "🎉" : "👀";
  const btnColor = isSuccess ? "var(--primary)" : "#4F46E5";

  box.innerHTML = `
    <div class="modal-icon">${icon}</div>
    <h2 style="margin-bottom: 12px; color: #1F2937;">${title}</h2>
    <p style="color: #6B7280; margin-bottom: 24px; line-height: 1.6;">${message}</p>
    <button onclick="this.closest('.modal-overlay').remove()" style="width:100%; padding:12px; background:${btnColor}; font-size:15px;">
      ${isSuccess ? "Continue" : "Got it"}
    </button>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  // Close on outside click
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
}

function viewEvent(eventName) {
  // Create detailed event view modal
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const box = document.createElement("div");
  box.className = "modal-box";
  box.style.maxWidth = "500px";

  // Generate event-specific details
  const eventDetails = {
    'TechSprint Hackathon 2026': {
      organizer: 'IEEE Student Chapter',
      location: 'Virtual + Main Auditorium',
      duration: '24 hours',
      prize: '₹50,000',
      description: 'Build innovative solutions across domains like AI, IoT, and Web Development.'
    },
    'AI Research Internship': {
      organizer: 'Research Lab, IIT Delhi',
      location: 'Delhi, India',
      duration: '8 weeks',
      stipend: '₹15,000/month',
      description: 'Work on cutting-edge AI research projects with experienced mentors.'
    },
    'International Summer School': {
      organizer: 'University of Cambridge',
      location: 'Cambridge, UK',
      duration: '6 weeks',
      fee: '£2,500',
      description: 'Intensive program covering advanced research methodologies and academic writing.'
    }
  };

  const details = eventDetails[eventName] || {
    organizer: 'Event Organizer',
    location: 'TBA',
    duration: 'Varies',
    description: 'More details coming soon!'
  };

  box.innerHTML = `
    <div class="modal-icon">📋</div>
    <h2 style="margin-bottom: 16px; color: #1F2937;">${eventName}</h2>
    <div style="text-align: left; margin-bottom: 24px;">
      <p style="margin: 8px 0; color: #6B7280;"><b>Organizer:</b> ${details.organizer}</p>
      <p style="margin: 8px 0; color: #6B7280;"><b>Location:</b> ${details.location}</p>
      <p style="margin: 8px 0; color: #6B7280;"><b>Duration:</b> ${details.duration}</p>
      ${details.prize ? `<p style="margin: 8px 0; color: #6B7280;"><b>Prize Pool:</b> ${details.prize}</p>` : ''}
      ${details.stipend ? `<p style="margin: 8px 0; color: #6B7280;"><b>Stipend:</b> ${details.stipend}</p>` : ''}
      ${details.fee ? `<p style="margin: 8px 0; color: #6B7280;"><b>Fee:</b> ${details.fee}</p>` : ''}
      <p style="margin: 16px 0 0 0; color: #374151; line-height: 1.6;">${details.description}</p>
    </div>
    <button onclick="this.closest('.modal-overlay').remove()" style="width:100%; padding:12px; background:var(--primary); color:white; border:none; border-radius:8px; font-weight:600; cursor:pointer;">
      Close
    </button>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
}

function registerEvent(eventName, actionType = "Register") {
  const studentId = localStorage.getItem("studentId");
  if (!studentId) {
    alert("Please log in to " + actionType.toLowerCase() + ".");
    return;
  }

  // Show registration form modal
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const box = document.createElement("div");
  box.className = "modal-box";
  box.style.maxWidth = "450px";

  box.innerHTML = `
    <div class="modal-icon">📝</div>
    <h2 style="margin-bottom: 12px; color: #1F2937;">${actionType} for Event</h2>
    <p style="color: #6B7280; margin-bottom: 20px;"><b>${eventName}</b></p>
    
    <div style="text-align: left; margin-bottom: 20px;">
      <label style="display: block; margin-bottom: 6px; color: #374151; font-weight: 500;">Full Name *</label>
      <input type="text" id="regName" placeholder="Enter your full name" style="width: 100%; padding: 10px; border: 1px solid #E5E7EB; border-radius: 6px; margin-bottom: 12px; box-sizing: border-box; font-size: 14px;">
      
      <label style="display: block; margin-bottom: 6px; color: #374151; font-weight: 500;">Email Address *</label>
      <input type="email" id="regEmail" placeholder="your.email@example.com" style="width: 100%; padding: 10px; border: 1px solid #E5E7EB; border-radius: 6px; margin-bottom: 12px; box-sizing: border-box; font-size: 14px;">
      
      <label style="display: block; margin-bottom: 6px; color: #374151; font-weight: 500;">Phone Number *</label>
      <input type="tel" id="regPhone" placeholder="+91 98765 43210" style="width: 100%; padding: 10px; border: 1px solid #E5E7EB; border-radius: 6px; margin-bottom: 16px; box-sizing: border-box; font-size: 14px;">
      
      <div style="background: #F9FAFB; padding: 12px; border-radius: 8px; border: 1px solid #E5E7EB;">
        <label style="display: flex; align-items: flex-start; color: #374151; cursor: pointer; font-size: 13px;">
          <input type="checkbox" id="regAgree" style="margin-right: 10px; margin-top: 3px; cursor: pointer; width: 16px; height: 16px;">
          <span>I agree to the <b>terms and conditions</b> and confirm that the information provided is accurate.</span>
        </label>
      </div>
    </div>
    
    <button id="submitReg" style="width:100%; padding:12px; background:var(--primary); color:white; border:none; border-radius:8px; font-weight:600; margin-bottom: 8px; cursor:pointer;">
      Submit ${actionType}
    </button>
    <button onclick="this.closest('.modal-overlay').remove()" style="width:100%; padding:12px; background:white; color:#6B7280; border:1px solid #E5E7EB; border-radius:8px; font-weight:600; cursor:pointer;">
      Cancel
    </button>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  // Handle form submission
  document.getElementById("submitReg").onclick = () => {
    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const phone = document.getElementById("regPhone").value.trim();
    const agree = document.getElementById("regAgree").checked;

    // Validation
    if (!name) {
      alert("Please enter your full name");
      return;
    }
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }
    if (!phone) {
      alert("Please enter your phone number");
      return;
    }
    if (!agree) {
      alert("Please agree to the terms and conditions");
      return;
    }

    // Show loading state
    const submitBtn = document.getElementById("submitReg");
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.6";
    submitBtn.innerHTML = "Processing...";

    // Simulate backend processing
    setTimeout(() => {

      // Save registration to localStorage
      const registrations = JSON.parse(localStorage.getItem(`registrations_${studentId}`)) || [];
      registrations.push({
        eventName: eventName,
        actionType: actionType,
        name: name,
        email: email,
        phone: phone,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(`registrations_${studentId}`, JSON.stringify(registrations));
      overlay.remove();

      // Show success modal with user's data
      showModal(
        `${actionType} Successful!`,
        `Thank you, <b>${name}</b>!<br><br>You have successfully registered for <b>${eventName}</b>.<br><br>A confirmation email has been sent to <b>${email}</b>.<br>We'll contact you at <b>${phone}</b> if needed.`,
        true
      );
    }, 800);
  };

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
}

// ============ REGISTERED EVENTS FUNCTIONALITY ============

function renderRegisteredEvents() {
  const content = document.getElementById("registeredEventsContent");
  const emptyState = document.getElementById("emptyStateRegistered");

  if (!content) return; // Not on registered events page

  const studentId = localStorage.getItem("studentId");
  if (!studentId) {
    content.innerHTML = '<div class="card">Please log in to view your registered events.</div>';
    return;
  }

  const registrations = JSON.parse(localStorage.getItem(`registrations_${studentId}`)) || [];

  if (registrations.length === 0) {
    content.style.display = "none";
    emptyState.style.display = "block";
    return;
  }

  content.innerHTML = "";
  content.style.display = "flex";
  emptyState.style.display = "none";

  registrations.forEach((reg, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.borderLeft = "4px solid var(--primary)";

    const regDate = new Date(reg.timestamp);
    const formattedDate = regDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:start;">
        <div style="flex:1;">
          <h3 style="margin:0 0 8px 0; color: var(--text);">${reg.eventName}</h3>
          <div style="color: var(--text-light); font-size: 14px; margin-bottom: 12px;">
            <div style="margin-bottom: 4px;">📅 Registered: ${formattedDate}</div>
            <div style="margin-bottom: 4px;">👤 Name: <b>${reg.name}</b></div>
            <div style="margin-bottom: 4px;">📧 Email: <b>${reg.email}</b></div>
            <div style="margin-bottom: 4px;">📞 Phone: <b>${reg.phone}</b></div>
            <div style="margin-top: 8px; padding: 6px 12px; background: #EFF6FF; border-radius: 6px; display: inline-block; color: var(--primary); font-weight: 600; font-size: 12px;">
              ${reg.actionType}
            </div>
          </div>
        </div>
        <button onclick="removeRegistration(${index})" style="background:#FEE2E2; color:#DC2626; border:1px solid #FCA5A5; padding: 6px 12px; font-size:12px; border-radius: 6px; cursor: pointer;">
          ✖ Remove
        </button>
      </div>
    `;
    content.appendChild(card);
  });
}

function removeRegistration(index) {
  const studentId = localStorage.getItem("studentId");
  let registrations = JSON.parse(localStorage.getItem(`registrations_${studentId}`)) || [];

  if (confirm(`Remove this registration?`)) {
    registrations.splice(index, 1);
    localStorage.setItem(`registrations_${studentId}`, JSON.stringify(registrations));
    renderRegisteredEvents(); // Re-render
  }
}
