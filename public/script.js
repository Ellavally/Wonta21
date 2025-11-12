// ------------------- Mobile Menu Toggle -------------------
const menuToggle = document.getElementById('menu-toggle');
const navbar = document.getElementById('navbar');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navbar.classList.toggle('active');
  });
}

// ------------------- Image Side-to-Side Animation -------------------
function moveImageById(id, distance = 50, speed = 0.2) {
  const img = document.getElementById(id);
  if (!img) return;

  let pos = 0;
  let direction = 1;

  function animate() {
    pos += direction * speed;
    img.style.transform = `translateX(${pos}px)`;
    if (pos >= distance || pos <= -distance) direction *= -1;
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

// ------------------- Animate All Images on Page -------------------
window.addEventListener('load', () => {
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    moveImageById(img.id || `img-${index}`, 50 + index * 20, 0.2 + index * 0.05);
  });
});
