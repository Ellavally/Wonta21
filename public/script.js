// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const navbar = document.getElementById('navbar');

menuToggle.addEventListener('click', () => {
  navbar.classList.toggle('active');
});

// Optional: slowly move images
function moveImageById(id, distance = 150, speed = 0.4) {
  const img = document.getElementById(id);
  if (!img) return;

  let pos = 0;
  let direction = 1;

  function animate() {
    pos += direction * speed;
    img.style.transform = `translateX(${pos}px)`;
    if (pos >= distance || pos <= 0) direction *= -1;
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

// Animate images based on page
window.addEventListener('load', () => {
  const page = document.body.dataset.page || document.body.classList[0]; // Adjusting to work on all pages

  const animations = {
    home: [
      { id: 'home-image1', distance: 50, speed: 0.2 },
      { id: 'home-image2', distance: 60, speed: 0.25 },
      { id: 'home-image3', distance: 40, speed: 0.15 }
    ],
    about: [
      { id: 'about-image1', distance: 50, speed: 0.2 },
      { id: 'about-image2', distance: 60, speed: 0.25 }
    ],
    projects: [
      { id: 'project-image1', distance: 50, speed: 0.2 }
    ],
    contact: [
      { id: 'contact-image1', distance: 50, speed: 0.2 }
    ]
  };

  if (animations[page]) {
    animations[page].forEach(({ id, distance, speed }) => moveImageById(id, distance, speed));
  }
});
