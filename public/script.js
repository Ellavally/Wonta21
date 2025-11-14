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

// Auto-close mobile menu on larger screens
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
  if (!img) return; // No image → skip quietly

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
  // Read page from <body data-page="...">
  let page = document.body.dataset.page;

  // Fallback: use first class name (just in case)
  if (!page && document.body.classList.length > 0) {
    page = document.body.classList[0].replace("-page", "");
  }

  // Animation setup per page
  const animations = {
    home: [
      { id: "home-image1", distance: 60, speed: 0.25 },
      { id: "home-image2", distance: 70, speed: 0.3 }
    ],
    about: [
      { id: "about-image2", distance: 60, speed: 0.25 }
    ],
    projects: [
      // Add floating images here if needed
    ],
    contact: [
      // Add floating images here if needed
    ],
    news: [] // News page has no animations → prevents errors
  };

  // Run animations for detected page
  if (animations[page]) {
    animations[page].forEach(({ id, distance, speed }) => {
      moveImageById(id, distance, speed);
    });
  }
});
