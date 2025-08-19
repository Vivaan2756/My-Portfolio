const body = document.body;
const themeToggle = document.getElementById('theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// Load saved theme

const savedTheme = localStorage.getItem('theme');
if (savedTheme){
  body.classList.add(savedTheme);
}
// Particle color based on theme
let particleColor = body.classList.contains('light') ? '#000000' : '#00e5ff';

// Initialize particles
function initParticles(color) {
  particlesJS('particles-js', {
    particles: {
      number: { value: 80 },
      color: { value: color },
      shape: { type: 'circle' },
      opacity: { value: 0.5 },
      size: { value: 3 },
      line_linked: { enable: true, distance: 150, color: color, opacity: 0.4, width: 1 },
      move: { enable: true, speed: 2 }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: false, mode: 'grab' }, onclick: { enable: false, mode: 'push' } },
      modes: { grab: { distance: 200, line_linked: { opacity: 0.5 } }, push: { particles_nb: 4 } }
    },
    retina_detect: true
  });
}
initParticles(particleColor);

// Theme toggle
function updateToggleButton() {
  themeToggle.textContent = body.classList.contains('light') ? "Toggle Theme ": "Toggle Theme" ;
}
updateToggleButton();

themeToggle.addEventListener('click', () => {
  body.classList.toggle('light');
  localStorage.setItem('theme', body.classList.contains('light') ? 'light' : 'dark');
  particleColor = body.classList.contains('light') ? '#000000' : '#00e5ff';
  document.getElementById('particles-js').innerHTML = '';
  initParticles(particleColor);
  updateToggleButton();
});

// Hamburger menu toggle
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('show');
  });
});