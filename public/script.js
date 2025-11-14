// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const navbar = document.getElementById('navbar');

// Toggle the navbar visibility when the menu button is clicked
menuToggle.addEventListener('click', () => {
  navbar.classList.toggle('active');
});

// Optional: Slowly move images horizontally with animation
function moveImageById(id, distance = 150, speed = 0.4) {
  const img = document.getElementById(id);
  if (!img) return; // If no image with the provided id, exit early

  let pos = 0;
  let direction = 1;

  function animate() {
    pos += direction * speed;
    img.style.transform = `translateX(${pos}px)`; // Apply horizontal movement
    if (pos >= distance || pos <= 0) direction *= -1; // Reverse direction when distance is reached
    requestAnimationFrame(animate); // Keep the animation running
  }

  requestAnimationFrame(animate); // Start animation
}

// Animate images based on the current page
window.addEventListener('load', () => {
<<<<<<< HEAD
  const page = document.body.dataset.page || document.body.classList[0]; // Adjusting to work on all pages
=======
<<<<<<< HEAD
  const page = document.body.dataset.page || document.body.classList[0]; // Adjusting to work on all pages
=======
  const page = document.body.dataset.page; // Get current page from body data attribute
>>>>>>> f968b5d64b83615bfe1012cef2301d99d5b59b3d
>>>>>>> 76f5ae778dcf0e7a49ce46b17d6cd70e247783f3

  // Create an object that stores the animation details for each page
  const animations = {
    home: [
      { id: 'home-image1', distance: 50, speed: 0.2 },
      { id: 'home-image2', distance: 60, speed: 0.25 },
      { id: 'home-image3', distance: 40, speed: 0.15 }
    ],
    about: [
      { id: 'about-image1', distance: 50, speed: 0.2 },
<<<<<<< HEAD
      { id: 'about-image2', distance: 60, speed: 0.25 }
=======
<<<<<<< HEAD
      { id: 'about-image2', distance: 60, speed: 0.25 }
=======
      { id: 'about-image2', distance: 50, speed: 0.25 },
      { id: 'about-image3', distance: 40, speed: 0.18 }
>>>>>>> f968b5d64b83615bfe1012cef2301d99d5b59b3d
>>>>>>> 76f5ae778dcf0e7a49ce46b17d6cd70e247783f3
    ],
    projects: [
      { id: 'project-image1', distance: 50, speed: 0.2 }
    ],
    contact: [
      { id: 'contact-image1', distance: 50, speed: 0.2 }
    ]
  };

  // Check if the animations for the current page are defined and animate images accordingly
  if (animations[page]) {
    animations[page].forEach(({ id, distance, speed }) => moveImageById(id, distance, speed));
  }
});

// Add event listener for window resize to adjust the mobile menu display on larger screens
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    navbar.classList.remove('active'); // Hide mobile menu on larger screens
  }
});
