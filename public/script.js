// ===============================
// MOBILE MENU TOGGLE (FINAL VERSION)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navbar = document.getElementById("navbar");
  const header = document.querySelector("header");

  if (!menuToggle || !navbar || !header) return;

  // Toggle mobile menu
  menuToggle.addEventListener("click", () => {
    navbar.classList.toggle("menu-open");

    // Lock/unlock scroll
    document.body.style.overflow = navbar.classList.contains("menu-open") ? "hidden" : "auto";
  });

  // Close menu when clicking a link
  navbar.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navbar.classList.remove("menu-open");
      document.body.style.overflow = "auto";
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!header.contains(e.target) && navbar.classList.contains("menu-open")) {
      navbar.classList.remove("menu-open");
      document.body.style.overflow = "auto";
    }
  });
});

// Auto-close menu on desktop
window.addEventListener("resize", () => {
  const navbar = document.getElementById("navbar");
  if (window.innerWidth > 768 && navbar) {
    navbar.classList.remove("menu-open");
    document.body.style.overflow = "auto";
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

    if (pos >= distance || pos <= 0) direction *= -1;

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}


// ===============================
// PAGE ANIMATION HANDLER
// ===============================
window.addEventListener("load", () => {
  let page = document.body.dataset.page;

  // Fallback if dataset missing
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
    news: []
  };

  if (animations[page]) {
    animations[page].forEach(({ id, distance, speed }) =>
      moveImageById(id, distance, speed)
    );
  }
});
