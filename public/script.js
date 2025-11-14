// ===============================
// MOBILE MENU TOGGLE (FIXED)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navbar = document.getElementById("navbar");

  if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
      navbar.classList.toggle("menu-open"); // CHANGED from "active"
    });
  }
});

// Auto-close mobile menu when switching to desktop view
window.addEventListener("resize", () => {
  const navbar = document.getElementById("navbar");
  if (window.innerWidth > 768 && navbar) {
    navbar.classList.remove("menu-open"); // CHANGED from "active"
  }
});


// ===============================
// FLOATING IMAGE ANIMATION
// ===============================
function moveImageById(id, distance = 150, speed = 0.4) {
  const img = document.getElementById(id);
  if (!img) return;

  let pos = 0;
  let direction = 1;

  function animate() {
    pos += direction * speed;
    img.style.transform = `translateX(${pos}px)`;

    if (pos >= distance || pos <= 0) {
      direction *= -1;
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}


// ===============================
// DETECT ACTIVE PAGE & START ANIMATIONS
// ===============================
window.addEventListener("load", () => {

  // Read page name from <body data-page="...">
  let page = document.body.dataset.page;

  // Fallback: read from class if dataset missing
  if (!page && document.body.classList.length > 0) {
    page = document.body.classList[0].replace("-page", "");
  }

  const animations = {
    home: [
      { id: "home-image1", distance: 60, speed: 0.25 },
      { id: "home-image2", distance: 70, speed: 0.3 }
    ],
    about: [
      { id: "about-image2", distance: 60, speed: 0.25 }
    ],
    projects: [],
    contact: [],
    news: [] // no animation → prevents JS errors
  };

  // Run animations if defined
  if (animations[page]) {
    animations[page].forEach(({ id, distance, speed }) => {
      moveImageById(id, distance, speed);
    });
  }
});
