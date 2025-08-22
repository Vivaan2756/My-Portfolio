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
  themeToggle.textContent = body.classList.contains('light') ? "🌙 Dark ": "☀️ Light " ;
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




// Toggle chatbot open/close

const chatbotIcon = document.getElementById("chatbot-icon");
const chatbotContainer = document.getElementById("chatbot-container");
const closeBtn = document.getElementById("close-chat");
const inputField = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

// Show chatbot when icon is clicked
chatbotIcon.addEventListener("click", () => {
  chatbotContainer.classList.remove("hidden");
});

// Hide chatbot when close button is clicked
closeBtn.addEventListener("click", () => {
  chatbotContainer.classList.add("hidden");
});

// Send message function
async function sendMessage() {
  let message = inputField.value.trim();
  if (!message) return;

  // Display user message
  chatBox.innerHTML += `<p class="user">You: ${message}</p>`;

  try {
    // Send to Flask backend
    let response = await fetch("/get", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({message: message})
    });

    if (!response.ok) throw new Error("Network response was not ok");

    let data = await response.json();
    let reply = data.reply;

    // Display bot response
    chatBox.innerHTML += `<p class="bot">Assistant: ${reply}</p>`;
    chatBox.scrollTo({top: chatBox.scrollHeight, behavior: "smooth"});

  } catch (error) {
    chatBox.innerHTML += `<p class="bot">Assistant: Sorry, something went wrong.</p>`;
    chatBox.scrollTo({top: chatBox.scrollHeight, behavior: "smooth"});
    console.error(error);
  }

  inputField.value = ""; // Clear input
}

// Submit message when Enter key is pressed
inputField.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    e.preventDefault(); // Prevent newline in input
    sendMessage();
  }
});

const form = document.getElementById("contact-form");
const formMsg = document.getElementById("form-msg");

form.addEventListener("submit", async function(e) {
  e.preventDefault();

  const from_name = form.name.value.trim();
  const from_email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!from_name || !from_email || !message) {
    formMsg.style.display = "block";
    formMsg.style.color = "red";
    formMsg.textContent = "Please fill out all fields.";
    setTimeout(() => {
      formMsg.style.display = "none";
    }, 4000); // disappears after 4 seconds
    return;
  }

  try {
    await emailjs.send("service_bsd64si", "template_fxskq2v", {
      from_name: from_name,
      from_email: from_email,
      message: message
    });

    formMsg.style.display = "block";
    formMsg.style.color = "green";
    formMsg.textContent = "Message sent successfully! ✅";
    form.reset();

    setTimeout(() => {
      formMsg.style.display = "none";
    }, 4000); // disappears after 4 seconds
  } catch (error) {
    formMsg.style.display = "block";
    formMsg.style.color = "red";
    formMsg.textContent = "Oops! Something went wrong. Try again.";
    console.error("EmailJS error:", error);

    setTimeout(() => {
      formMsg.style.display = "none";
    }, 4000); // disappears after 4 seconds
  }
});
