// ===============================
// MOBILE MENU TOGGLE
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navbar = document.getElementById("navbar");

  if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
      navbar.classList.toggle("active");
    });
  }
});

// Auto-close menu when screen becomes large
window.addEventListener("resize", () => {
  const navbar = document.getElementById("navbar");
  if (window.innerWidth > 768 && navbar) {
    navbar.classList.remove("active");
  }
});

// ===============================
// FLOATING IMAGE ANIMATION
// ===============================
function moveImageById(id, distance = 150, speed = 0.4) {
  const img = document.getElementById(id);
  if (!img) return; // IF image does not exist, skip

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

// ===============================
// DETECT CURRENT PAGE & RUN ANIMATIONS
// ===============================
window.addEventListener("load", () => {
  // Check for dataset first
  let page = document.body.dataset.page;

  // If not found, fallback to first class name
  if (!page && document.body.classList.length > 0) {
    page = document.body.classList[0].replace("-page", "");
  }

  // Animation config for pages
  const animations = {
    home: [
      { id: "home-image1", distance: 60, speed: 0.25 },
      { id: "home-image2", distance: 70, speed: 0.3 }
    ],
    about: [
      { id: "about-image2", distance: 60, speed: 0.25 } // only remaining image
    ],
    projects: [
      // Only add if you have floating images on projects page
    ],
    contact: [
      // Add if contact page uses floating images
    ]
  };

  // Run animations only for the current page
  if (animations[page]) {
    animations[page].forEach(({ id, distance, speed }) => {
      moveImageById(id, distance, speed);
    });
  }
});

