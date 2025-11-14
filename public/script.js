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

// Hide the mobile menu automatically when screen becomes large
window.addEventListener("resize", () => {
  const navbar = document.getElementById("navbar");
  if (window.innerWidth > 768 && navbar) {
    navbar.classList.remove("active");
  }
});

// ===============================
// IMAGE FLOATING ANIMATION
// ===============================
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

window.addEventListener("load", () => {
  // Read which page we are on
  let page = document.body.dataset.page;

  // If dataset not set, fallback to body class
  if (!page && document.body.classList.length > 0) {
    page = document.body.classList[0];
  }

  // Animation config per page
  const animations = {
    home: [
      { id: "home-image1", distance: 50, speed: 0.2 },
      { id: "home-image2", distance: 60, speed: 0.25 },
      { id: "home-image3", distance: 40, speed: 0.15 }
    ],
    about: [
      { id: "about-image1", distance: 50, speed: 0.2 },
      { id: "about-image2", distance: 60, speed: 0.25 }
    ],
    projects: [
      { id: "project-image1", distance: 50, speed: 0.2 }
    ],
    contact: [
      { id: "contact-image1", distance: 50, speed: 0.2 }
    ]
  };

  // Run animations for current page
  if (animations[page]) {
    animations[page].forEach(({ id, distance, speed }) => {
      moveImageById(id, distance, speed);
    });
  }
});
