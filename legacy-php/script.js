const container = document.querySelector('.container');
const registerToggleBtn = document.querySelector('.register-toggle-btn');
const loginToggleBtn = document.querySelector('.login-toggle-btn');
const toggleMenu = document.querySelector('.toggle-menu');
const navLinks = document.querySelector('.nav-links');
const openLoginModal = document.getElementById('openLoginModal');
const openRegisterModal = document.getElementById('openRegisterModal');

// Toggle between login and register forms
registerToggleBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginToggleBtn.addEventListener('click', () => {
    container.classList.remove('active');
});

// Mobile menu toggle
toggleMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Handle navbar buttons
if (openLoginModal) {
    openLoginModal.addEventListener('click', () => {
        container.classList.remove('active');
        // Additional functionality could be added here if needed
    });
}

if (openRegisterModal) {
    openRegisterModal.addEventListener('click', () => {
        container.classList.add('active');
        // Additional functionality could be added here if needed
    });
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});