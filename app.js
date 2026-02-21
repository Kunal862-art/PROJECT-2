// SafeStep Platform - Complete Fixed Frontend JavaScript
// Version 3.0 - Production Ready with dynamic API base

// API Base URL - when running locally point to your local backend
// Local: "http://localhost:5000/api"  (use this when running backend.py locally)
// Production: "https://your-app-name.onrender.com/api"
// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL = "https://project-2-84qm.onrender.com/api";

// Application Data
const appData = {
  users: [],
  trainings: [],
  userEnrollments: [],
  currentUserSessions: [],
};

// Current user state
let currentUser = null;

// ==================== API HELPER FUNCTIONS ====================

async function apiCall(endpoint, method = "GET", data = null) {
  const options = {
    method: method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    let result;
    try {
      result = await response.json();
    } catch (jsonError) {
      console.error("JSON Parse Error:", jsonError, "Response:", response);
      return {
        success: false,
        message: "Backend returned invalid response",
        error: jsonError.message,
      };
    }

    if (!response.ok && response.status === 401) {
      currentUser = null;
      updateUIForLoggedOutUser();
    }

    return { status: response.status, ...result };
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      message: "Backend is not running! Start it with: python backend-final.py",
      error: error.message,
    };
  }
}

// ==================== DOM CONTENT LOADED ====================

document.addEventListener("DOMContentLoaded", function () {
  console.log("SafeStep Platform Frontend Started");
  initializeEventListeners();
  initializeNavigation();
  setTimeout(() => {
    initializeChart();
    initializeMap();
    checkAuthStatus();
    loadTrainings();
  }, 100);
});

// ==================== AUTHENTICATION FUNCTIONS ====================

async function checkAuthStatus() {
  console.log("Checking authentication status...");
  const result = await apiCall("/auth/check", "GET");

  if (result.success && result.logged_in && result.user) {
    console.log("User already logged in:", result.user);
    currentUser = result.user;
    updateUIForLoggedInUser();
    loadUserData();
  } else {
    console.log("No active session");
    updateUIForLoggedOutUser();
  }
}

async function handleSignIn(e) {
  e.preventDefault();

  const name = document.getElementById("signInName").value.trim();
  const email = document.getElementById("signInEmail").value.trim();
  const role = document.getElementById("signInRole").value;
  const state = document.getElementById("signInState").value;
  const password = document.getElementById("signInPassword").value;
  const confirmPassword = document.getElementById(
    "signInConfirmPassword"
  ).value;

  // Validation
  if (!name || !email || !role || !state || !password || !confirmPassword) {
    alert("Please fill in all fields");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  if (!email.includes("@")) {
    alert("Please enter a valid email");
    return;
  }

  // Call API
  console.log("Registering user:", email);
  const result = await apiCall("/auth/register", "POST", {
    name: name,
    email: email,
    role: role,
    state: state,
    password: password,
    confirmPassword: confirmPassword,
  });

  if (result.success) {
    currentUser = result.user;
    console.log("Registration successful:", currentUser);
    alert("Account created successfully! Welcome " + name);
    closeModal("signInModal");
    document.getElementById("signInForm").reset();
    updateUIForLoggedInUser();
    loadUserData();
  } else {
    console.error("Registration failed:", result.message);
    alert("Registration failed: " + result.message);
  }
}

async function handleLogIn(e) {
  e.preventDefault();

  const email = document.getElementById("logInEmail").value.trim();
  const password = document.getElementById("logInPassword").value;

  if (!email || !password) {
    alert("Please enter both email and password");
    return;
  }

  console.log("Logging in user:", email);
  const result = await apiCall("/auth/login", "POST", {
    email: email,
    password: password,
  });

  if (result.success) {
    currentUser = result.user;
    console.log("Login successful:", currentUser);
    alert("Welcome back, " + currentUser.name + "!");
    closeModal("logInModal");
    document.getElementById("logInForm").reset();
    updateUIForLoggedInUser();
    loadUserData();
  } else {
    console.error("Login failed:", result.message);
    alert("Login failed: " + result.message);
  }
}

async function logout() {
  console.log("Logging out user...");
  const result = await apiCall("/auth/logout", "POST");

  if (result.success) {
    currentUser = null;
    console.log("Logout successful");
    alert("You have been logged out");
    updateUIForLoggedOutUser();
    setTimeout(() => location.reload(), 500);
  } else {
    alert("Logout failed: " + result.message);
  }
}

// ==================== UI UPDATE FUNCTIONS ====================

function updateUIForLoggedInUser() {
  console.log("Updating UI for logged-in user");

  const authButtons = document.querySelector(".auth-buttons");
  if (authButtons) {
    authButtons.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1.5rem; color: white; padding: 0 1rem;">
                <div>
                    <div style="font-weight: 600; font-size: 0.95rem;">Welcome, ${currentUser.name}</div>
                    <div style="font-size: 0.8rem; opacity: 0.85;">${currentUser.role} • ${currentUser.state}</div>
                </div>
                <button onclick="logout()" style="
                    padding: 0.5rem 1rem;
                    background: rgba(255, 255, 255, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.3s ease;
                ">Logout</button>
            </div>
        `;
  }

  const mainContent = document.querySelector(".main-content");
  if (mainContent) {
    mainContent.style.display = "flex";
  }

  showSection("dashboard");
  loadDashboardStats();
  showAdminPanels();
  loadReports();
}

function updateUIForLoggedOutUser() {
  console.log("Updating UI for logged-out user");

  const authButtons = document.querySelector(".auth-buttons");
  if (authButtons) {
    authButtons.innerHTML = `
            <button id="signInBtn" class="btn btn-primary">Sign In</button>
            <button id="logInBtn" class="btn btn-outline">Log In</button>
        `;

    document
      .getElementById("signInBtn")
      ?.addEventListener("click", function (e) {
        e.preventDefault();
        openModal("signInModal");
      });

    document
      .getElementById("logInBtn")
      ?.addEventListener("click", function (e) {
        e.preventDefault();
        openModal("logInModal");
      });
  }

  const mainContent = document.querySelector(".main-content");
  if (mainContent) {
    mainContent.style.display = "flex";
  }

  showSection("dashboard");
}

// ==================== DATA LOADING FUNCTIONS ====================

async function loadUserData() {
  if (!currentUser) {
    console.log("User not logged in, skipping user data load");
    return;
  }

  console.log("Loading user data...");

  const profileResult = await apiCall("/user/profile", "GET");
  if (profileResult.success) {
    currentUser = { ...currentUser, ...profileResult.user };
    console.log("Profile loaded");
  } else {
    console.error("Failed to load profile:", profileResult.message);
  }

  const enrollmentsResult = await apiCall("/user/enrollments", "GET");
  if (enrollmentsResult.success) {
    appData.userEnrollments = enrollmentsResult.enrollments;
    console.log("Enrollments loaded:", enrollmentsResult.enrollments.length);
  } else {
    console.error("Failed to load enrollments:", enrollmentsResult.message);
  }

  const sessionsResult = await apiCall("/user/sessions", "GET");
  if (sessionsResult.success) {
    appData.currentUserSessions = sessionsResult.sessions;
    console.log("Sessions loaded:", sessionsResult.sessions.length);
  } else {
    console.error("Failed to load sessions:", sessionsResult.message);
  }
}

async function loadTrainings() {
  console.log("Loading trainings...");
  const result = await apiCall("/trainings", "GET");

  if (result.success) {
    appData.trainings = result.trainings;
    console.log("Trainings loaded:", result.trainings.length);
  } else {
    console.warn("Failed to load trainings:", result.message);
  }
}

async function loadDashboardStats() {
  if (!currentUser) {
    console.log("User not logged in, skipping dashboard stats");
    return;
  }

  console.log("Loading dashboard stats...");
  const result = await apiCall("/dashboard/stats", "GET");

  if (result.success) {
    const statsData = result.stats;
    console.log("Stats:", statsData);

    const statsElements = document.querySelectorAll("[data-stat]");
    statsElements.forEach((el) => {
      const statKey = el.getAttribute("data-stat");
      if (statsData[statKey] !== undefined) {
        el.textContent = statsData[statKey];
        console.log("Updated", statKey, "to", statsData[statKey]);
      }
    });
  } else {
    console.error("Failed to load stats:", result.message);
  }
}

async function enrollTraining(trainingId) {
  if (!currentUser) {
    alert("Please log in first");
    return;
  }

  const result = await apiCall(`/trainings/${trainingId}/enroll`, "POST");

  if (result.success) {
    alert(result.message);
    loadUserData();
    loadTrainings();
  } else {
    alert("Enrollment failed: " + result.message);
  }
}

// ==================== MODAL FUNCTIONS ====================

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    console.log("Modal opened:", modalId);
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
    console.log("Modal closed:", modalId);
  }
}

// ==================== EVENT LISTENERS ====================

function initializeEventListeners() {
  console.log("Initializing event listeners...");

  // Sign In button
  const signInBtn = document.getElementById("signInBtn");
  if (signInBtn) {
    signInBtn.addEventListener("click", function (e) {
      e.preventDefault();
      openModal("signInModal");
    });
  }

  // Log In button
  const logInBtn = document.getElementById("logInBtn");
  if (logInBtn) {
    logInBtn.addEventListener("click", function (e) {
      e.preventDefault();
      openModal("logInModal");
    });
  }

  // Close buttons
  const closeSignIn = document.getElementById("closeSignIn");
  if (closeSignIn) {
    closeSignIn.addEventListener("click", function () {
      closeModal("signInModal");
    });
  }

  const closeLogIn = document.getElementById("closeLogIn");
  if (closeLogIn) {
    closeLogIn.addEventListener("click", function () {
      closeModal("logInModal");
    });
  }

  // Switch modals
  const switchToLogIn = document.getElementById("switchToLogIn");
  if (switchToLogIn) {
    switchToLogIn.addEventListener("click", function (e) {
      e.preventDefault();
      closeModal("signInModal");
      openModal("logInModal");
    });
  }

  const switchToSignIn = document.getElementById("switchToSignIn");
  if (switchToSignIn) {
    switchToSignIn.addEventListener("click", function (e) {
      e.preventDefault();
      closeModal("logInModal");
      openModal("signInModal");
    });
  }

  // Close on backdrop click
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });

  // Close on ESC key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal").forEach((modal) => {
        if (modal.classList.contains("active")) {
          closeModal(modal.id);
        }
      });
    }
  });

  // Form submissions
  const signInForm = document.getElementById("signInForm");
  if (signInForm) {
    signInForm.addEventListener("submit", handleSignIn);
  }

  const logInForm = document.getElementById("logInForm");
  if (logInForm) {
    logInForm.addEventListener("submit", handleLogIn);
  }

  console.log("Event listeners initialized");
}

// ==================== NAVIGATION ====================

function initializeNavigation() {
  console.log("Initializing navigation...");

  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      if (!currentUser) {
        alert("Please log in first");
        return;
      }
      const target = this.getAttribute("href").substring(1);
      showSection(target);

      navLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    });
  });

  const sidebarLinks = document.querySelectorAll(".sidebar-link");
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      if (!currentUser) {
        alert("Please log in first");
        return;
      }
      const target = this.getAttribute("href").substring(1);
      showSection(target);

      sidebarLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    });
  });
}

function showSection(sectionId) {
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active");
  });

  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add("active");
    console.log("Showing section:", sectionId);
  }
}

// ==================== CHART INITIALIZATION ====================

function initializeChart() {
  const ctx = document.getElementById("trendsChart");
  if (ctx && typeof Chart !== "undefined") {
    try {
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
          datasets: [
            {
              label: "Trainings",
              data: [12, 15, 18, 14, 16, 13],
              backgroundColor: "rgba(40, 167, 69, 0.8)",
              borderColor: "rgba(40, 167, 69, 1)",
              borderWidth: 2,
            },
            {
              label: "Participants (x100)",
              data: [4.85, 6.2, 7.3, 5.6, 6.4, 5.2],
              backgroundColor: "rgba(0, 180, 216, 0.8)",
              borderColor: "rgba(0, 180, 216, 1)",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              position: "top",
            },
          },
        },
      });
      console.log("Chart initialized");
    } catch (e) {
      console.error("Chart error:", e);
    }
  }
}

// ==================== MAP INITIALIZATION ====================

function initializeMap() {
  const mapContainer = document.getElementById("mapContainer");
  if (mapContainer && typeof L !== "undefined") {
    try {
      const map = L.map("mapContainer").setView([20, 78], 4);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(map);

      appData.trainings.forEach((training) => {
        if (training.latitude && training.longitude) {
          L.circleMarker([training.latitude, training.longitude], {
            radius: 8,
            fillColor: "#28a745",
            color: "#1e3a5f",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
          })
            .bindPopup(
              `<strong>${training.title}</strong><br>${training.location}`
            )
            .addTo(map);
        }
      });
      console.log("Map initialized");
    } catch (e) {
      console.error("Map error:", e);
    }
  }
}

// ==================== ADMIN FUNCTIONS ====================

function showAdminPanels() {
  if (!currentUser) return;

  const adminRoles = ["NDMA Admin", "State Admin", "District/SDMA"];
  const isAdmin = adminRoles.includes(currentUser.role);

  // Show/hide admin menu items
  document.getElementById("adminTrainingsMenu").style.display = isAdmin
    ? "list-item"
    : "none";
  document.getElementById("adminAttendanceMenu").style.display = isAdmin
    ? "list-item"
    : "none";
  document.getElementById("adminReportsMenu").style.display = isAdmin
    ? "list-item"
    : "none";

  if (isAdmin) {
    loadAdminTrainingsList();
  }
}

async function loadAdminTrainingsList() {
  const result = await apiCall("/trainings", "GET");

  if (result.success && result.trainings) {
    const container = document.getElementById("adminTrainingsList");
    container.innerHTML = "";

    result.trainings.forEach((training) => {
      const card = document.createElement("div");
      card.className = "training-admin-card";
      card.innerHTML = `
        <h4>${training.title}</h4>
        <div class="training-info">
          <p><strong>Dates:</strong> ${training.start_date} to ${training.end_date}</p>
          <p><strong>Trainer:</strong> ${training.trainer}</p>
          <p><strong>Location:</strong> ${training.location}</p>
          <p><strong>Capacity:</strong> ${training.enrolled}/${training.capacity}</p>
        </div>
        <div class="training-actions">
          <button class="btn btn-primary btn-small" onclick="editTraining(${training.id})">Edit</button>
          <button class="btn btn-outline btn-small" onclick="loadAttendanceForTraining(${training.id})">Attendance</button>
        </div>
      `;
      container.appendChild(card);
    });
  }
}

async function editTraining(trainingId) {
  const newTitle = prompt("Enter new training title:");
  if (!newTitle) return;

  const result = await apiCall(`/admin/trainings/${trainingId}`, "PUT", {
    title: newTitle,
  });

  if (result.success) {
    alert("Training updated successfully!");
    loadAdminTrainingsList();
  } else {
    alert("Error: " + result.message);
  }
}

async function loadAttendanceForTraining(trainingId) {
  const result = await apiCall(`/trainings/${trainingId}/report`, "GET");

  if (result.success) {
    const training = result.report.training;
    const participants = result.report.participants;

    const container = document.getElementById("participantsList");
    container.innerHTML = "";

    participants.forEach((participant) => {
      const item = document.createElement("div");
      item.className = "participant-item";
      item.innerHTML = `
        <input type="checkbox" id="participant_${participant.id}" value="${participant.id}">
        <label for="participant_${participant.id}">${participant.name} (${participant.role})</label>
      `;
      container.appendChild(item);
    });

    document.getElementById("attendanceParticipants").style.display = "block";
    showSection("admin-attendance");
  }
}

async function submitAttendance() {
  const checkboxes = document.querySelectorAll(
    '#participantsList input[type="checkbox"]:checked'
  );
  const participantIds = Array.from(checkboxes).map((cb) => parseInt(cb.value));

  if (participantIds.length === 0) {
    alert("Please select at least one participant");
    return;
  }

  // Get training ID from the page context (you may need to store it)
  const trainingId = sessionStorage.getItem("currentTrainingId");

  const result = await apiCall(
    `/trainings/${trainingId}/mark-attendance`,
    "POST",
    {
      participants: participantIds,
    }
  );

  if (result.success) {
    alert(result.message);
    loadAdminTrainingsList();
  } else {
    alert("Error: " + result.message);
  }
}

async function loadReports() {
  const result = await apiCall("/trainings", "GET");

  if (result.success && result.trainings) {
    const select = document.getElementById("reportTrainingSelect");
    select.innerHTML = '<option value="">Choose a training...</option>';

    result.trainings.forEach((training) => {
      const option = document.createElement("option");
      option.value = training.id;
      option.textContent = training.title;
      select.appendChild(option);
    });

    select.onchange = function () {
      if (this.value) {
        generateReport(this.value);
      }
    };
  }
}

async function generateReport(trainingId) {
  const result = await apiCall(`/trainings/${trainingId}/report`, "GET");

  if (result.success) {
    const report = result.report;
    const stats = report.statistics;

    // Update stats
    document.getElementById("reportTotalEnrolled").textContent =
      stats.total_enrolled;
    document.getElementById("reportPresent").textContent = stats.present;
    document.getElementById("reportAbsent").textContent = stats.absent;
    document.getElementById("reportAttendanceRate").textContent =
      stats.attendance_rate + "%";

    // Create participants table
    const participantsDiv = document.getElementById("participantsReport");
    let tableHTML = '<table class="report-table"><thead><tr>';
    tableHTML +=
      "<th>Participant Name</th><th>Email</th><th>Role</th><th>State</th><th>Attendance</th></tr></thead><tbody>";

    report.participants.forEach((p) => {
      const status = report.attendance[p.id] || "Absent";
      tableHTML += `<tr>
        <td>${p.name}</td>
        <td>${p.email}</td>
        <td>${p.role}</td>
        <td>${p.state}</td>
        <td><span class="badge ${
          status === "Present" ? "badge-success" : "badge-warning"
        }">${status}</span></td>
      </tr>`;
    });

    tableHTML += "</tbody></table>";
    participantsDiv.innerHTML = tableHTML;

    document.getElementById("reportContainer").style.display = "block";
    sessionStorage.setItem("currentTrainingId", trainingId);
  }
}

async function downloadReport() {
  const trainingId = sessionStorage.getItem("currentTrainingId");
  if (!trainingId) {
    alert("Please select a training first");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8000/api/trainings/${trainingId}/report/export`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `training_${trainingId}_report.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      alert("Error downloading report");
    }
  } catch (error) {
    console.error("Download error:", error);
    alert("Error downloading report");
  }
}

console.log("SafeStep Platform Script Loaded - Version 2.0");
