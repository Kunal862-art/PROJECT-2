// Application Data
const appData = {
  "users": [
    {"id": 1, "name": "Dr. Rajesh Kumar", "role": "NDMA Admin", "email": "rajesh.kumar@ndma.gov.in", "state": "Delhi", "avatar": "RK"},
    {"id": 2, "name": "Priya Sharma", "role": "State Admin", "email": "priya.sharma@mp.gov.in", "state": "Madhya Pradesh", "avatar": "PS"},
    {"id": 3, "name": "Amit Verma", "role": "District/SDMA", "email": "amit.verma@up.gov.in", "state": "Uttar Pradesh", "avatar": "AV"},
    {"id": 4, "name": "Dr. Sunita Patel", "role": "Trainer", "email": "sunita.patel@nidm.gov.in", "state": "Gujarat", "avatar": "SP"},
    {"id": 5, "name": "Ravi Krishnan", "role": "Participant", "email": "ravi.k@kerala.gov.in", "state": "Kerala", "avatar": "RK"}
  ],
  "trainingEvents": [
    {
      "id": 1,
      "title": "Disaster Response Training - Mumbai",
      "description": "Comprehensive training on urban disaster response protocols",
      "startDate": "2025-10-15",
      "endDate": "2025-10-17",
      "startTime": "09:00",
      "endTime": "17:00",
      "themes": ["Disaster Response", "Emergency Planning"],
      "trainer": "Dr. Sunita Patel",
      "location": "Mumbai, Maharashtra",
      "latitude": 19.0760,
      "longitude": 72.8777,
      "capacity": 50,
      "enrolled": 42,
      "status": "Active",
      "isPublic": true,
      "materials": ["Response Manual", "Case Studies", "Equipment Guide"]
    },
    {
      "id": 2,
      "title": "Risk Assessment Workshop - Delhi",
      "description": "Advanced risk assessment techniques for government officials",
      "startDate": "2025-10-20",
      "endDate": "2025-10-22",
      "startTime": "10:00",
      "endTime": "16:00",
      "themes": ["Risk Assessment", "Vulnerability Analysis"],
      "trainer": "Dr. Rajesh Kumar",
      "location": "New Delhi",
      "latitude": 28.6139,
      "longitude": 77.2090,
      "capacity": 30,
      "enrolled": 28,
      "status": "Active",
      "isPublic": false,
      "materials": ["Assessment Tools", "Guidelines", "Templates"]
    },
    {
      "id": 3,
      "title": "Community Engagement Training - Kolkata",
      "description": "Building community resilience through effective engagement",
      "startDate": "2025-10-25",
      "endDate": "2025-10-26",
      "startTime": "09:30",
      "endTime": "17:30",
      "themes": ["Community Engagement", "Public Awareness"],
      "trainer": "Priya Sharma",
      "location": "Kolkata, West Bengal",
      "latitude": 22.5726,
      "longitude": 88.3639,
      "capacity": 40,
      "enrolled": 35,
      "status": "Scheduled",
      "isPublic": true,
      "materials": ["Engagement Toolkit", "Communication Guide"]
    },
    {
      "id": 4,
      "title": "Early Warning Systems - Chennai",
      "description": "Implementation of early warning systems for coastal areas",
      "startDate": "2025-11-05",
      "endDate": "2025-11-07",
      "startTime": "09:00",
      "endTime": "18:00",
      "themes": ["Early Warning", "Technology Integration"],
      "trainer": "Amit Verma",
      "location": "Chennai, Tamil Nadu",
      "latitude": 13.0827,
      "longitude": 80.2707,
      "capacity": 35,
      "enrolled": 22,
      "status": "Scheduled",
      "isPublic": true,
      "materials": ["Technical Manual", "Case Studies", "Implementation Guide"]
    }
  ],
  "themes": [
    "Disaster Response",
    "Emergency Planning", 
    "Risk Assessment",
    "Vulnerability Analysis",
    "Community Engagement",
    "Public Awareness",
    "Early Warning",
    "Technology Integration",
    "Recovery Planning",
    "Coordination Mechanisms"
  ],
  "states": [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ],
  "alerts": [
    {
      "id": 1,
      "type": "Low Attendance",
      "message": "Training in Chennai has low enrollment (22/35)",
      "priority": "Medium",
      "timestamp": "2025-10-06T10:30:00Z",
      "status": "Active"
    },
    {
      "id": 2,
      "type": "Coverage Gap",
      "message": "No trainings scheduled for Northeast region in November",
      "priority": "High",
      "timestamp": "2025-10-06T09:15:00Z",
      "status": "Active"
    }
  ],
  "analytics": {
    "totalTrainings": 156,
    "totalParticipants": 4200,
    "completionRate": 87,
    "satisfactionScore": 4.3,
    "geographicCoverage": 28,
    "averageAttendance": 42,
    "monthlyTrends": [
      {"month": "May", "trainings": 12, "participants": 485},
      {"month": "Jun", "trainings": 15, "participants": 620},
      {"month": "Jul", "trainings": 18, "participants": 730},
      {"month": "Aug", "trainings": 14, "participants": 560},
      {"month": "Sep", "trainings": 16, "participants": 640},
      {"month": "Oct", "trainings": 13, "participants": 520}
    ]
  }
};

// Global variables
let currentUser = null;
let isAuthenticated = false;
let currentSection = 'dashboard';
let dashboardMap = null;
let mainMap = null;
let charts = {};
let sidebarOverlay = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing NDMA CBT Platform...');
  initializeEventListeners();
  initializeGuestMode();
  createSidebarOverlay();
  handleResponsiveNavigation();
  populateDropdowns();
  showSection('dashboard'); // Ensure dashboard is shown on load
});

// Initialize guest mode by default
function initializeGuestMode() {
  console.log('Setting up guest mode...');
  isAuthenticated = false;
  currentUser = null;
  document.body.className = 'guest-mode';
  showGuestNavigation();
  
  // Show guest welcome
  const guestWelcome = document.getElementById('guestWelcome');
  if (guestWelcome) {
    guestWelcome.style.display = 'block';
  }
}

// Create sidebar overlay for mobile
function createSidebarOverlay() {
  sidebarOverlay = document.createElement('div');
  sidebarOverlay.className = 'sidebar-overlay';
  sidebarOverlay.addEventListener('click', closeMobileSidebar);
  document.body.appendChild(sidebarOverlay);
}

// Handle responsive navigation behavior
function handleResponsiveNavigation() {
  window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth > 1024) {
      if (sidebar) {
        sidebar.classList.remove('mobile-open');
        closeMobileSidebar();
      }
    }
  });
}

// Check if we're in mobile mode
function isMobileMode() {
  return window.innerWidth <= 1024;
}

// Event Listeners
function initializeEventListeners() {
  console.log('Setting up event listeners...');
  
  // Authentication buttons
  const signInBtn = document.getElementById('signInBtn');
  const logInBtn = document.getElementById('logInBtn');
  
  if (signInBtn) {
    signInBtn.addEventListener('click', showSignInModal);
    console.log('Sign In button listener added');
  }
  
  if (logInBtn) {
    logInBtn.addEventListener('click', showLogInModal);
    console.log('Log In button listener added');
  }
  
  // Authentication modals
  setupAuthenticationModals();
  
  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
    console.log('Logout button listener added');
  }
  
  // Sidebar toggle
  const sidebarToggle = document.getElementById('sidebarToggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleSidebar();
    });
  }
  
  // Navigation - FIXED: Proper section handling
  const navItems = document.querySelectorAll('.nav-item');
  console.log(`Found ${navItems.length} navigation items`);
  
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const section = item.getAttribute('data-section');
      console.log(`Navigation clicked: ${section}`);
      
      // Check if section requires authentication
      if (!isAuthenticated && item.classList.contains('restricted-access')) {
        console.log(`Restricted section ${section} requires authentication`);
        showNotification('Please sign in to access this feature', 'warning');
        showLogInModal();
        return;
      }
      
      showSection(section);
      
      if (isMobileMode()) {
        closeMobileSidebar();
      }
    });
  });

  // Prevent sidebar from closing when clicking inside it
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }

  // Training modal
  const addTrainingBtn = document.getElementById('addTrainingBtn');
  if (addTrainingBtn) {
    addTrainingBtn.addEventListener('click', () => {
      if (!isAuthenticated) {
        showNotification('Please sign in to create training events', 'warning');
        showLogInModal();
        return;
      }
      showTrainingModal();
    });
  }

  setupTrainingModal();

  // Map filters
  const applyMapFilters = document.getElementById('applyMapFilters');
  if (applyMapFilters) {
    applyMapFilters.addEventListener('click', applyMapFiltersHandler);
  }
}

// Authentication Modal Setup
function setupAuthenticationModals() {
  // Sign In Modal
  const signInModal = document.getElementById('signInModal');
  const closeSignInModal = document.getElementById('closeSignInModal');
  const cancelSignIn = document.getElementById('cancelSignIn');
  const signInForm = document.getElementById('signInForm');
  const switchToLogIn = document.getElementById('switchToLogIn');

  if (closeSignInModal) {
    closeSignInModal.addEventListener('click', hideSignInModal);
  }
  
  if (cancelSignIn) {
    cancelSignIn.addEventListener('click', hideSignInModal);
  }
  
  if (signInForm) {
    signInForm.addEventListener('submit', handleSignIn);
  }
  
  if (switchToLogIn) {
    switchToLogIn.addEventListener('click', (e) => {
      e.preventDefault();
      hideSignInModal();
      showLogInModal();
    });
  }

  // Log In Modal
  const logInModal = document.getElementById('logInModal');
  const closeLogInModal = document.getElementById('closeLogInModal');
  const cancelLogIn = document.getElementById('cancelLogIn');
  const logInForm = document.getElementById('logInForm');
  const switchToSignIn = document.getElementById('switchToSignIn');

  if (closeLogInModal) {
    closeLogInModal.addEventListener('click', hideLogInModal);
  }
  
  if (cancelLogIn) {
    cancelLogIn.addEventListener('click', hideLogInModal);
  }
  
  if (logInForm) {
    logInForm.addEventListener('submit', handleLogIn);
  }
  
  if (switchToSignIn) {
    switchToSignIn.addEventListener('click', (e) => {
      e.preventDefault();
      hideLogInModal();
      showSignInModal();
    });
  }

  // Close modals when clicking outside
  [signInModal, logInModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
        }
      });
    }
  });
}

// Training Modal Setup
function setupTrainingModal() {
  const trainingModal = document.getElementById('trainingModal');
  const closeTrainingModal = document.getElementById('closeTrainingModal');
  const cancelTraining = document.getElementById('cancelTraining');
  const trainingForm = document.getElementById('trainingForm');

  if (closeTrainingModal) {
    closeTrainingModal.addEventListener('click', hideTrainingModal);
  }
  
  if (cancelTraining) {
    cancelTraining.addEventListener('click', hideTrainingModal);
  }
  
  if (trainingForm) {
    trainingForm.addEventListener('submit', handleTrainingSubmit);
  }

  if (trainingModal) {
    trainingModal.addEventListener('click', (e) => {
      if (e.target === trainingModal) {
        hideTrainingModal();
      }
    });
  }
}

// Authentication Functions
function showSignInModal() {
  console.log('Showing Sign In modal');
  const modal = document.getElementById('signInModal');
  if (modal) {
    modal.classList.remove('hidden');
    document.getElementById('signInForm').reset();
  }
}

function hideSignInModal() {
  const modal = document.getElementById('signInModal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function showLogInModal() {
  console.log('Showing Log In modal');
  const modal = document.getElementById('logInModal');
  if (modal) {
    modal.classList.remove('hidden');
    document.getElementById('logInForm').reset();
  }
}

function hideLogInModal() {
  const modal = document.getElementById('logInModal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function handleSignIn(e) {
  e.preventDefault();
  console.log('Handling sign in (registration)...');
  
  const name = document.getElementById('signInName').value;
  const email = document.getElementById('signInEmail').value;
  const password = document.getElementById('signInPassword').value;
  const role = document.getElementById('signInRole').value;
  const state = document.getElementById('signInState').value;
  
  if (!name || !email || !password || !role || !state) {
    showNotification('Please fill in all fields', 'error');
    return;
  }
  
  // Create new user
  const newUser = {
    id: appData.users.length + 1,
    name: name,
    role: role,
    email: email,
    state: state,
    avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
  };
  
  console.log('Created new user:', newUser);
  
  // Simulate account creation
  currentUser = newUser;
  authenticateUser();
  hideSignInModal();
  
  showNotification('Account created successfully! Welcome to NDMA CBT Platform.', 'success');
}

function handleLogIn(e) {
  e.preventDefault();
  console.log('Handling log in...');
  
  const email = document.getElementById('logInEmail').value;
  const password = document.getElementById('logInPassword').value;
  
  if (!email || !password) {
    showNotification('Please fill in all fields', 'error');
    return;
  }
  
  // Find user by email or use demo user
  let user = appData.users.find(u => u.email === email);
  if (!user) {
    // Create demo user based on email domain
    const role = email.includes('ndma') ? 'NDMA Admin' : 
                 email.includes('nidm') ? 'Trainer' :
                 email.includes('.gov.in') ? 'State Admin' : 'Participant';
    
    user = {
      id: 999,
      name: "Demo User",
      role: role,
      email: email,
      state: "Delhi",
      avatar: "DU"
    };
  }
  
  console.log('Logging in user:', user);
  
  currentUser = user;
  authenticateUser();
  hideLogInModal();
  
  showNotification('Login successful! Welcome back.', 'success');
}

function authenticateUser() {
  console.log('Authenticating user and updating UI...');
  
  isAuthenticated = true;
  document.body.classList.remove('guest-mode');
  document.body.classList.add(`role-${currentUser.role.toLowerCase().replace(/[^a-z]/g, '-')}`);
  
  showUserNavigation();
  updateUserProfile();
  
  // Hide guest welcome and show full functionality
  const guestWelcome = document.getElementById('guestWelcome');
  if (guestWelcome) {
    guestWelcome.style.display = 'none';
  }
  
  // Refresh current section to show authenticated content
  showSection(currentSection);
}

function handleLogout() {
  console.log('Handling logout...');
  
  // CRITICAL FIX: Properly reset authentication state
  currentUser = null;
  isAuthenticated = false;
  
  // Reset to guest mode
  document.body.className = 'guest-mode';
  showGuestNavigation();
  
  // Show guest welcome
  const guestWelcome = document.getElementById('guestWelcome');
  if (guestWelcome) {
    guestWelcome.style.display = 'block';
  }
  
  // Return to dashboard and refresh content
  showSection('dashboard');
  closeMobileSidebar();
  
  // Force refresh of dashboard content to show guest version
  setTimeout(() => {
    initializeDashboard();
  }, 100);
  
  showNotification('Logged out successfully', 'info');
}

// Navigation State Management - FIXED
function showGuestNavigation() {
  console.log('Showing guest navigation');
  const guestNav = document.getElementById('guestNavigation');
  const userNav = document.getElementById('userNavigation');
  
  if (guestNav) {
    guestNav.classList.remove('hidden');
    console.log('Guest navigation shown');
  }
  if (userNav) {
    userNav.classList.add('hidden');
    console.log('User navigation hidden');
  }
}

function showUserNavigation() {
  console.log('Showing user navigation');
  const guestNav = document.getElementById('guestNavigation');
  const userNav = document.getElementById('userNavigation');
  
  if (guestNav) {
    guestNav.classList.add('hidden');
    console.log('Guest navigation hidden');
  }
  if (userNav) {
    userNav.classList.remove('hidden');
    console.log('User navigation shown');
  }
}

function updateUserProfile() {
  const userName = document.getElementById('userName');
  const userRole = document.getElementById('userRole');
  const userAvatar = document.getElementById('userAvatar');
  
  if (userName) userName.textContent = currentUser.name;
  if (userRole) userRole.textContent = currentUser.role;
  if (userAvatar) userAvatar.textContent = currentUser.avatar;
  
  console.log('User profile updated:', currentUser.name, currentUser.role);
}

// Navigation Functions - FIXED: Proper section handling
function showSection(sectionName) {
  console.log(`Showing section: ${sectionName}, Authenticated: ${isAuthenticated}`);
  
  // Update navigation
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-section') === sectionName) {
      item.classList.add('active');
    }
  });
  
  // Update content sections
  const contentSections = document.querySelectorAll('.content-section');
  contentSections.forEach(section => {
    section.classList.remove('active');
    if (section.id === sectionName) {
      section.classList.add('active');
    }
  });
  
  currentSection = sectionName;
  
  // Initialize section-specific content
  switch (sectionName) {
    case 'dashboard':
      initializeDashboard();
      break;
    case 'trainings':
      initializeTrainings();
      break;
    case 'map':
      initializeMap();
      break;
    case 'attendance':
      initializeAttendance();
      break;
    case 'analytics':
      initializeAnalytics();
      break;
    case 'alerts':
      initializeAlerts();
      break;
    case 'reports':
      initializeReports();
      break;
  }
}

// Sidebar Toggle Functions
function toggleSidebar() {
  if (isMobileMode()) {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      const isOpen = sidebar.classList.contains('mobile-open');
      if (isOpen) {
        closeMobileSidebar();
      } else {
        openMobileSidebar();
      }
    }
  }
}

function openMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar && sidebarOverlay) {
    sidebar.classList.add('mobile-open');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar && sidebarOverlay) {
    sidebar.classList.remove('mobile-open');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Data initialization
function populateDropdowns() {
  // Populate trainer dropdowns
  const trainerSelects = document.querySelectorAll('#trainer, .trainer-select');
  trainerSelects.forEach(select => {
    const trainers = appData.users.filter(user => user.role === 'Trainer');
    select.innerHTML = '<option value="">Select Trainer</option>';
    trainers.forEach(trainer => {
      const option = document.createElement('option');
      option.value = trainer.name;
      option.textContent = trainer.name;
      select.appendChild(option);
    });
  });

  // Populate themes dropdown
  const themesSelect = document.getElementById('themes');
  if (themesSelect) {
    appData.themes.forEach(theme => {
      const option = document.createElement('option');
      option.value = theme;
      option.textContent = theme;
      themesSelect.appendChild(option);
    });
  }

  // Populate state selects
  const stateSelects = document.querySelectorAll('#mapStateFilter, #signInState, .state-select');
  stateSelects.forEach(select => {
    if (!select.innerHTML.includes('Select')) {
      select.innerHTML = '<option value="">Select state</option>';
    }
    appData.states.forEach(state => {
      const option = document.createElement('option');
      option.value = state;
      option.textContent = state;
      select.appendChild(option);
    });
  });

  // Populate theme filters
  const themeSelects = document.querySelectorAll('#mapThemeFilter, .theme-select');
  themeSelects.forEach(select => {
    appData.themes.forEach(theme => {
      const option = document.createElement('option');
      option.value = theme;
      option.textContent = theme;
      select.appendChild(option);
    });
  });
}

// Dashboard Functions
function initializeDashboard() {
  console.log('Initializing dashboard...');
  initializeDashboardMap();
}

function initializeDashboardMap() {
  const mapContainer = document.getElementById('dashboardMap');
  if (mapContainer && !dashboardMap) {
    dashboardMap = L.map('dashboardMap').setView([20.5937, 78.9629], 5);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(dashboardMap);

    // Add training locations - only show public events for guests
    const eventsToShow = isAuthenticated ? appData.trainingEvents : appData.trainingEvents.filter(e => e.isPublic);
    
    eventsToShow.forEach(event => {
      const marker = L.marker([event.latitude, event.longitude]).addTo(dashboardMap);
      marker.bindPopup(`
        <div class="map-popup">
          <h4>${event.title}</h4>
          <p><strong>Date:</strong> ${formatDate(event.startDate)}</p>
          <p><strong>Enrolled:</strong> ${event.enrolled}/${event.capacity}</p>
          <p><strong>Status:</strong> ${event.status}</p>
        </div>
      `);
    });
  }
}

// Training Events Functions
function initializeTrainings() {
  console.log('Initializing trainings...');
  renderTrainingEvents();
}

function renderTrainingEvents() {
  const container = document.getElementById('trainingsGrid');
  if (!container) return;

  container.innerHTML = '';
  
  // Filter events based on authentication status
  const eventsToShow = isAuthenticated ? appData.trainingEvents : appData.trainingEvents.filter(e => e.isPublic);
  
  eventsToShow.forEach(event => {
    const card = createTrainingCard(event);
    container.appendChild(card);
  });
  
  if (!isAuthenticated && eventsToShow.length < appData.trainingEvents.length) {
    const restrictedMessage = document.createElement('div');
    restrictedMessage.className = 'training-card access-restricted';
    restrictedMessage.innerHTML = `
      <div class="restriction-message">
        <i class="fas fa-lock"></i>
        <h3>More Events Available</h3>
        <p>Sign in to view all training events including restricted and internal sessions.</p>
        <div class="restriction-actions">
          <button class="btn btn--primary" onclick="document.getElementById('logInBtn').click()">
            <i class="fas fa-sign-in-alt"></i>
            Log In
          </button>
        </div>
      </div>
    `;
    container.appendChild(restrictedMessage);
  }
}

function createTrainingCard(event) {
  const card = document.createElement('div');
  card.className = 'training-card';
  
  const enrollmentPercentage = (event.enrolled / event.capacity) * 100;
  
  card.innerHTML = `
    <div class="training-header">
      <h3 class="training-title">${event.title}</h3>
      <span class="training-status status-${event.status.toLowerCase()}">${event.status}</span>
    </div>
    
    <div class="training-meta">
      <div class="meta-item">
        <i class="fas fa-calendar"></i>
        <span>${formatDate(event.startDate)} - ${formatDate(event.endDate)}</span>
      </div>
      <div class="meta-item">
        <i class="fas fa-clock"></i>
        <span>${event.startTime} - ${event.endTime}</span>
      </div>
      <div class="meta-item">
        <i class="fas fa-map-marker-alt"></i>
        <span>${event.location}</span>
      </div>
      <div class="meta-item">
        <i class="fas fa-user"></i>
        <span>${event.trainer}</span>
      </div>
    </div>
    
    <div class="training-themes">
      ${event.themes.map(theme => `<span class="theme-tag">${theme}</span>`).join('')}
    </div>
    
    <div class="training-progress">
      <div class="progress-info">
        <span>Enrollment</span>
        <span>${event.enrolled}/${event.capacity}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${enrollmentPercentage}%"></div>
      </div>
    </div>
    
    <div class="training-actions">
      <button class="btn btn--sm btn--secondary" onclick="viewTraining(${event.id})">
        <i class="fas fa-eye"></i> View
      </button>
      ${isAuthenticated ? `
        <button class="btn btn--sm btn--outline" onclick="editTraining(${event.id})">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn btn--sm btn--primary" onclick="generateQRForEvent(${event.id})">
          <i class="fas fa-qrcode"></i> QR Code
        </button>
      ` : `
        <button class="btn btn--sm btn--outline" onclick="document.getElementById('logInBtn').click()">
          <i class="fas fa-sign-in-alt"></i> Sign In to Manage
        </button>
      `}
    </div>
  `;
  
  return card;
}

// Training Modal Functions
function showTrainingModal(eventId = null) {
  const modal = document.getElementById('trainingModal');
  const title = document.getElementById('trainingModalTitle');
  
  if (eventId) {
    title.textContent = 'Edit Training Event';
    populateTrainingForm(eventId);
  } else {
    title.textContent = 'Add Training Event';
    document.getElementById('trainingForm').reset();
  }
  
  modal.classList.remove('hidden');
}

function hideTrainingModal() {
  const modal = document.getElementById('trainingModal');
  modal.classList.add('hidden');
}

function populateTrainingForm(eventId) {
  const event = appData.trainingEvents.find(e => e.id === eventId);
  if (!event) return;

  document.getElementById('eventTitle').value = event.title;
  document.getElementById('eventDescription').value = event.description;
  document.getElementById('startDate').value = event.startDate;
  document.getElementById('endDate').value = event.endDate;
  document.getElementById('startTime').value = event.startTime;
  document.getElementById('endTime').value = event.endTime;
  document.getElementById('trainer').value = event.trainer;
  document.getElementById('capacity').value = event.capacity;
  document.getElementById('location').value = event.location;
}

function handleTrainingSubmit(e) {
  e.preventDefault();
  
  const trainingData = {
    id: appData.trainingEvents.length + 1,
    title: document.getElementById('eventTitle').value,
    description: document.getElementById('eventDescription').value,
    startDate: document.getElementById('startDate').value,
    endDate: document.getElementById('endDate').value,
    startTime: document.getElementById('startTime').value,
    endTime: document.getElementById('endTime').value,
    trainer: document.getElementById('trainer').value,
    capacity: parseInt(document.getElementById('capacity').value),
    location: document.getElementById('location').value,
    themes: Array.from(document.getElementById('themes').selectedOptions).map(option => option.value),
    enrolled: 0,
    status: 'Scheduled',
    latitude: 28.6139 + (Math.random() - 0.5) * 10,
    longitude: 77.2090 + (Math.random() - 0.5) * 20,
    isPublic: true,
    materials: []
  };
  
  appData.trainingEvents.push(trainingData);
  hideTrainingModal();
  renderTrainingEvents();
  
  showNotification('Training event created successfully!', 'success');
}

// Map Functions
function initializeMap() {
  console.log('Initializing map...');
  const mapContainer = document.getElementById('mainMap');
  if (mapContainer && !mainMap) {
    mainMap = L.map('mainMap').setView([20.5937, 78.9629], 5);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mainMap);

    renderMapMarkers();
  }
}

function renderMapMarkers() {
  if (!mainMap) return;

  mainMap.eachLayer(layer => {
    if (layer instanceof L.Marker) {
      mainMap.removeLayer(layer);
    }
  });

  // Filter events based on authentication status
  const eventsToShow = isAuthenticated ? appData.trainingEvents : appData.trainingEvents.filter(e => e.isPublic);

  eventsToShow.forEach(event => {
    const marker = L.marker([event.latitude, event.longitude]).addTo(mainMap);
    marker.bindPopup(`
      <div class="map-popup">
        <h4>${event.title}</h4>
        <p><strong>Date:</strong> ${formatDate(event.startDate)} - ${formatDate(event.endDate)}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <p><strong>Trainer:</strong> ${event.trainer}</p>
        <p><strong>Enrollment:</strong> ${event.enrolled}/${event.capacity}</p>
        <p><strong>Status:</strong> <span class="status-${event.status.toLowerCase()}">${event.status}</span></p>
        <p><strong>Themes:</strong> ${event.themes.join(', ')}</p>
      </div>
    `);
  });
}

function applyMapFiltersHandler() {
  showNotification('Map filters applied successfully', 'info');
  renderMapMarkers();
}

// Attendance Functions - FIXED
function initializeAttendance() {
  console.log('Initializing attendance section...');
  const attendanceContent = document.getElementById('attendanceContent');
  if (!attendanceContent) return;

  if (isAuthenticated) {
    // Show full attendance management interface
    attendanceContent.innerHTML = `
      <div class="attendance-grid">
        <div class="card">
          <div class="card__body">
            <h3>QR Code Scanner</h3>
            <div class="qr-scanner">
              <div class="qr-preview">
                <i class="fas fa-qrcode"></i>
                <p>Position QR code within the frame</p>
              </div>
              <button class="btn btn--primary" onclick="simulateQRScan()">
                <i class="fas fa-camera"></i>
                Start Scanning
              </button>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card__body">
            <h3>Generate QR Code</h3>
            <select id="eventSelect" class="form-control">
              <option value="">Select Training Event</option>
            </select>
            <div id="qrCode" class="qr-code-display"></div>
            <button class="btn btn--secondary" onclick="generateQRCode()">Generate QR Code</button>
          </div>
        </div>

        <div class="card">
          <div class="card__body">
            <h3>Manual Attendance</h3>
            <form id="manualAttendanceForm">
              <div class="form-group">
                <label class="form-label">Training Event</label>
                <select class="form-control" required>
                  <option value="">Select Event</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Participant Email/ID</label>
                <input type="text" class="form-control" placeholder="Enter email or ID" required>
              </div>
              <button type="submit" class="btn btn--primary">Mark Attendance</button>
            </form>
          </div>
        </div>
      </div>
    `;
    
    // Populate event dropdown
    const eventSelect = document.getElementById('eventSelect');
    if (eventSelect) {
      appData.trainingEvents.forEach(event => {
        const option = document.createElement('option');
        option.value = event.id;
        option.textContent = event.title;
        eventSelect.appendChild(option);
      });
    }
  } else {
    // Show restricted access message
    attendanceContent.innerHTML = `
      <div class="access-restricted">
        <div class="restriction-message">
          <i class="fas fa-lock"></i>
          <h3>Authentication Required</h3>
          <p>Please sign in to access attendance management features.</p>
          <div class="restriction-actions">
            <button class="btn btn--primary" onclick="document.getElementById('logInBtn').click()">
              <i class="fas fa-sign-in-alt"></i>
              Log In
            </button>
            <button class="btn btn--outline" onclick="document.getElementById('signInBtn').click()">
              <i class="fas fa-user-plus"></i>
              Sign In
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

// Alerts Functions - FIXED
function initializeAlerts() {
  console.log('Initializing alerts section...');
  const alertsContent = document.getElementById('alertsContent');
  if (!alertsContent) return;

  if (isAuthenticated) {
    // Show alerts list
    alertsContent.innerHTML = '';
    
    appData.alerts.forEach(alert => {
      const alertItem = createAlertItem(alert);
      alertsContent.appendChild(alertItem);
    });
  } else {
    // Show restricted access message
    alertsContent.innerHTML = `
      <div class="access-restricted">
        <div class="restriction-message">
          <i class="fas fa-lock"></i>
          <h3>Authentication Required</h3>
          <p>Please sign in to access alerts and notifications.</p>
          <div class="restriction-actions">
            <button class="btn btn--primary" onclick="document.getElementById('logInBtn').click()">
              <i class="fas fa-sign-in-alt"></i>
              Log In
            </button>
            <button class="btn btn--outline" onclick="document.getElementById('signInBtn').click()">
              <i class="fas fa-user-plus"></i>
              Sign In
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

function createAlertItem(alert) {
  const item = document.createElement('div');
  item.className = `alert-item priority-${alert.priority.toLowerCase()} ${alert.status === 'Resolved' ? 'resolved' : ''}`;
  
  item.innerHTML = `
    <div class="alert-content">
      <div class="alert-type">${alert.type}</div>
      <div class="alert-message">${alert.message}</div>
      <div class="alert-timestamp">${formatDateTime(alert.timestamp)}</div>
    </div>
    <div class="alert-actions">
      ${alert.status === 'Active' ? `
        <button class="btn btn--sm btn--secondary" onclick="resolveAlert(${alert.id})">
          <i class="fas fa-check"></i> Resolve
        </button>
      ` : `
        <span class="status status--success">Resolved</span>
      `}
      <button class="btn btn--sm btn--outline" onclick="viewAlertDetails(${alert.id})">
        <i class="fas fa-eye"></i> Details
      </button>
    </div>
  `;
  
  return item;
}

// Analytics Functions
function initializeAnalytics() {
  console.log('Initializing analytics...');
  initializeCharts();
}

function initializeCharts() {
  // Training Effectiveness Chart
  const effectivenessCtx = document.getElementById('effectivenessChart');
  if (effectivenessCtx && !charts.effectiveness) {
    charts.effectiveness = new Chart(effectivenessCtx, {
      type: 'doughnut',
      data: {
        labels: ['Excellent', 'Good', 'Average', 'Poor'],
        datasets: [{
          data: [45, 30, 20, 5],
          backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  // Geographic Coverage Chart
  const coverageCtx = document.getElementById('coverageChart');
  if (coverageCtx && !charts.coverage) {
    charts.coverage = new Chart(coverageCtx, {
      type: 'bar',
      data: {
        labels: ['North', 'South', 'East', 'West', 'Central', 'Northeast'],
        datasets: [{
          label: 'Trainings Conducted',
          data: [25, 32, 18, 28, 22, 8],
          backgroundColor: '#1FB8CD',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Satisfaction Trends Chart
  const satisfactionCtx = document.getElementById('satisfactionChart');
  if (satisfactionCtx && !charts.satisfaction) {
    charts.satisfaction = new Chart(satisfactionCtx, {
      type: 'line',
      data: {
        labels: appData.analytics.monthlyTrends.map(trend => trend.month),
        datasets: [{
          label: 'Satisfaction Score',
          data: [4.1, 4.2, 4.3, 4.0, 4.4, 4.3],
          borderColor: '#1FB8CD',
          backgroundColor: 'rgba(31, 184, 205, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            min: 3.5,
            max: 5
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
}

// Reports Functions
function initializeReports() {
  console.log('Initializing reports...');
  // Reports are initialized with static content
}

// QR Code Functions
function generateQRCode() {
  const eventSelect = document.getElementById('eventSelect');
  const eventId = eventSelect.value;
  
  if (!eventId) {
    showNotification('Please select a training event', 'warning');
    return;
  }
  
  const qrDisplay = document.getElementById('qrCode');
  qrDisplay.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: white; color: #333;">
      <div style="font-size: 48px; margin-bottom: 10px;">📱</div>
      <div style="font-size: 12px; text-align: center;">
        <strong>QR Code Generated</strong><br>
        Event ID: ${eventId}<br>
        Scan to mark attendance
      </div>
    </div>
  `;
  
  showNotification('QR Code generated successfully!', 'success');
}

function simulateQRScan() {
  const preview = document.querySelector('.qr-preview');
  if (preview) {
    preview.innerHTML = `
      <div style="color: #059669;">
        <i class="fas fa-check-circle" style="font-size: 48px; margin-bottom: 8px;"></i>
        <p><strong>Attendance Marked!</strong></p>
        <p>Participant: John Doe</p>
        <p>Event: Risk Assessment Workshop</p>
      </div>
    `;
    
    showNotification('Attendance marked successfully!', 'success');
    
    setTimeout(() => {
      preview.innerHTML = `
        <i class="fas fa-qrcode"></i>
        <p>Position QR code within the frame</p>
      `;
    }, 3000);
  }
}

// Utility Functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 20px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-left: 4px solid ${type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : type === 'warning' ? '#f59e0b' : '#1e40af'};
    border-radius: 8px;
    box-shadow: var(--shadow-lg);
    z-index: 2000;
    max-width: 300px;
    animation: slideIn 0.3s ease;
  `;
  
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}" 
         style="color: ${type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : type === 'warning' ? '#f59e0b' : '#1e40af'};"></i>
      <span style="color: var(--color-text); font-size: 14px;">${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" 
              style="background: none; border: none; color: var(--color-text-secondary); cursor: pointer; margin-left: auto;">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

// Event Handler Functions (called from HTML)
function viewTraining(id) {
  const event = appData.trainingEvents.find(e => e.id === id);
  if (event) {
    showNotification(`Viewing training: ${event.title}`, 'info');
  }
}

function editTraining(id) {
  if (!isAuthenticated) {
    showNotification('Please sign in to edit training events', 'warning');
    showLogInModal();
    return;
  }
  showTrainingModal(id);
}

function generateQRForEvent(id) {
  if (!isAuthenticated) {
    showNotification('Please sign in to generate QR codes', 'warning');
    showLogInModal();
    return;
  }
  
  showSection('attendance');
  setTimeout(() => {
    const eventSelect = document.getElementById('eventSelect');
    if (eventSelect) {
      eventSelect.value = id;
      generateQRCode();
    }
  }, 100);
}

function resolveAlert(id) {
  const alert = appData.alerts.find(a => a.id === id);
  if (alert) {
    alert.status = 'Resolved';
    initializeAlerts();
    showNotification('Alert resolved successfully', 'success');
  }
}

function viewAlertDetails(id) {
  const alert = appData.alerts.find(a => a.id === id);
  if (alert) {
    showNotification(`Alert: ${alert.type} - ${alert.message}`, 'info');
  }
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .qr-code-display {
    width: 200px;
    height: 200px;
    margin: var(--space-16) auto;
    background: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-base);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-secondary);
  }
  
  .alert-item {
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    padding: var(--space-20);
    border: 1px solid var(--color-card-border);
    border-left: 4px solid;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-16);
  }

  .alert-item.priority-high {
    border-left-color: #dc2626;
  }

  .alert-item.priority-medium {
    border-left-color: #f59e0b;
  }

  .alert-item.priority-low {
    border-left-color: #059669;
  }

  .alert-content {
    flex: 1;
  }

  .alert-type {
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
    font-size: var(--font-size-sm);
    margin-bottom: var(--space-4);
  }

  .alert-message {
    color: var(--color-text-secondary);
    margin-bottom: var(--space-4);
  }

  .alert-timestamp {
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
  }

  .alert-actions {
    display: flex;
    gap: var(--space-8);
  }
`;
document.head.appendChild(style);