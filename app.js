// SafeStep Platform - JavaScript

// Application Data
const appData = {
    users: [
        { id: 1, name: "Dr. Rajesh Kumar", role: "NDMA Admin", email: "rajesh.kumar@ndma.gov.in", password: "admin123", state: "Delhi" },
        { id: 2, name: "Priya Sharma", role: "State Admin", email: "priya.sharma@mp.gov.in", password: "state123", state: "Madhya Pradesh" },
        { id: 3, name: "Amit Verma", role: "District/SDMA", email: "amit.verma@up.gov.in", password: "district123", state: "Uttar Pradesh" },
        { id: 4, name: "Dr. Sunita Patel", role: "Trainer", email: "sunita.patel@nidm.gov.in", password: "trainer123", state: "Gujarat" },
        { id: 5, name: "Ravi Krishnan", role: "Participant", email: "ravi.k@kerala.gov.in", password: "participant123", state: "Kerala" }
    ],
    trainingEvents: [
        {
            id: 1,
            title: "Disaster Response Training - Mumbai",
            startDate: "2025-10-15",
            endDate: "2025-10-17",
            trainer: "Dr. Sunita Patel",
            location: "Mumbai, Maharashtra",
            latitude: 19.0760,
            longitude: 72.8777,
            capacity: 50,
            enrolled: 42,
            status: "Active"
        },
        {
            id: 2,
            title: "Risk Assessment Workshop - Delhi",
            startDate: "2025-10-20",
            endDate: "2025-10-22",
            trainer: "Dr. Rajesh Kumar",
            location: "New Delhi",
            latitude: 28.6139,
            longitude: 77.2090,
            capacity: 30,
            enrolled: 28,
            status: "Active"
        }
    ]
};

// Current user state
let currentUser = null;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('SafeStep Platform Initialized');

    initializeEventListeners();
    initializeNavigation();
    initializeChart();
    initializeMap();
});

// Initialize Event Listeners
function initializeEventListeners() {
    // Sign In button
    const signInBtn = document.getElementById('signInBtn');
    if (signInBtn) {
        signInBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal('signInModal');
        });
    }

    // Log In button
    const logInBtn = document.getElementById('logInBtn');
    if (logInBtn) {
        logInBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal('logInModal');
        });
    }

    // Close buttons
    const closeSignIn = document.getElementById('closeSignIn');
    if (closeSignIn) {
        closeSignIn.addEventListener('click', function() {
            closeModal('signInModal');
        });
    }

    const closeLogIn = document.getElementById('closeLogIn');
    if (closeLogIn) {
        closeLogIn.addEventListener('click', function() {
            closeModal('logInModal');
        });
    }

    // Switch between modals
    const switchToLogIn = document.getElementById('switchToLogIn');
    if (switchToLogIn) {
        switchToLogIn.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal('signInModal');
            openModal('logInModal');
        });
    }

    const switchToSignIn = document.getElementById('switchToSignIn');
    if (switchToSignIn) {
        switchToSignIn.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal('logInModal');
            openModal('signInModal');
        });
    }

    // Close modal on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                if (modal.classList.contains('active')) {
                    closeModal(modal.id);
                }
            });
        }
    });

    // Form submissions
    const signInForm = document.getElementById('signInForm');
    if (signInForm) {
        signInForm.addEventListener('submit', handleSignIn);
    }

    const logInForm = document.getElementById('logInForm');
    if (logInForm) {
        logInForm.addEventListener('submit', handleLogIn);
    }
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Handle Sign In (Registration)
function handleSignIn(e) {
    e.preventDefault();

    const name = document.getElementById('signInName').value;
    const email = document.getElementById('signInEmail').value;
    const role = document.getElementById('signInRole').value;
    const state = document.getElementById('signInState').value;
    const password = document.getElementById('signInPassword').value;
    const confirmPassword = document.getElementById('signInConfirmPassword').value;

    // Validation
    if (!name || !email || !role || !state || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }

    // Check if email already exists
    const existingUser = appData.users.find(u => u.email === email);
    if (existingUser) {
        alert('An account with this email already exists');
        return;
    }

    // Create new user
    const newUser = {
        id: appData.users.length + 1,
        name: name,
        email: email,
        role: role,
        state: state,
        password: password
    };

    appData.users.push(newUser);
    currentUser = newUser;

    alert('Account created successfully! You are now logged in.');

    closeModal('signInModal');
    updateUIForLoggedInUser();
}

// Handle Log In
function handleLogIn(e) {
    e.preventDefault();

    const email = document.getElementById('logInEmail').value;
    const password = document.getElementById('logInPassword').value;

    // Validation
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }

    // Find user
    const user = appData.users.find(u => u.email === email && u.password === password);

    if (!user) {
        alert('Invalid email or password');
        return;
    }

    currentUser = user;

    alert('Welcome back, ' + user.name + '!');

    closeModal('logInModal');
    updateUIForLoggedInUser();
}

// Update UI for Logged In User
function updateUIForLoggedInUser() {
    console.log('Logged in user:', currentUser);
}

// Logout Function
function logout() {
    currentUser = null;
    alert('You have been logged out');
    location.reload();
}

// Initialize Navigation
function initializeNavigation() {
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);
            showSection(target);

            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Sidebar links
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);
            showSection(target);

            // Update active state
            sidebarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Show Section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Initialize Chart
function initializeChart() {
    const ctx = document.getElementById('trendsChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                datasets: [{
                    label: 'Trainings',
                    data: [12, 15, 18, 14, 16, 13],
                    backgroundColor: 'rgba(40, 167, 69, 0.8)',
                    borderColor: 'rgba(40, 167, 69, 1)',
                    borderWidth: 2
                }, {
                    label: 'Participants (x100)',
                    data: [4.85, 6.20, 7.30, 5.60, 6.40, 5.20],
                    backgroundColor: 'rgba(0, 180, 216, 0.8)',
                    borderColor: 'rgba(0, 180, 216, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    }
}

// Initialize Map
function initializeMap() {
    const mapContainer = document.getElementById('mapContainer');
    if (mapContainer && typeof L !== 'undefined') {
        // Initialize Leaflet map
        const map = L.map('mapContainer').setView([20.5937, 78.9629], 5);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(map);

        // Add markers for training locations
        appData.trainingEvents.forEach(event => {
            const marker = L.marker([event.latitude, event.longitude]).addTo(map);
            marker.bindPopup(`
                <strong>${event.title}</strong><br>
                ${event.location}<br>
                ${event.startDate} to ${event.endDate}<br>
                Trainer: ${event.trainer}<br>
                Enrolled: ${event.enrolled}/${event.capacity}
            `);
        });
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

function formatNumber(num) {
    return num.toLocaleString('en-IN');
}

// Export functions for global access
window.logout = logout;
window.openModal = openModal;
window.closeModal = closeModal;