/**
 * Smoothly moves an image element side-to-side using CSS transforms.
 * @param {string} id - The HTML element's ID.
 * @param {number} distance - Max distance (in px) to move horizontally.
 * @param {number} speed - Speed of movement (smaller = slower).
 */
function moveImageById(id, distance = 150, speed = 0.4) {
  const img = document.getElementById(id);
  if (!img) return;

  let pos = 0;
  let direction = 1;

  // Use a smoother animation with less jank
  function animate() {
    pos += direction * speed;
    img.style.transform = `translateX(${pos}px)`;

    // Reverse direction when limits are reached
    if (pos >= distance || pos <= 0) {
      direction *= -1;
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

window.addEventListener('load', () => {
  const page = document.body.dataset.page; // detect page by data attribute

  const animations = {
    about: [
      { id: 'about-image1', distance: 100, speed: 0.4 },
      { id: 'about-image2', distance: 150, speed: 0.4 },
      { id: 'about-image3', distance: 200, speed: 0.4 },
    ],
    contact: [
      { id: 'contact-image1', distance: 100, speed: 0.3 },
      { id: 'contact-image2', distance: 120, speed: 0.35 },
      { id: 'contact-image3', distance: 140, speed: 0.4 },
      { id: 'contact-image4', distance: 160, speed: 0.45 },
      { id: 'contact-image5', distance: 180, speed: 0.5 },
    ],
    index: [
      { id: 'index-image1', distance: 50, speed: 0.2 },
      { id: 'index-image2', distance: 60, speed: 0.25 },
      { id: 'index-image3', distance: 70, speed: 0.3 },
      { id: 'index-image4', distance: 80, speed: 0.35 },
      { id: 'index-image5', distance: 90, speed: 0.4 },
    ],
    projects: [
      { id: 'project-image1', distance: 60, speed: 0.25 },
      { id: 'project-image2', distance: 80, speed: 0.3 },
      { id: 'project-image3', distance: 100, speed: 0.35 },
    ]
  };

  // Run animations based on which page is loaded
  if (animations[page]) {
    animations[page].forEach(({ id, distance, speed }) => {
      moveImageById(id, distance, speed);
    });
  }
});
