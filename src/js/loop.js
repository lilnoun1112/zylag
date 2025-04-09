const track = document.querySelector('.testimonial-track');
const cards = Array.from(track.children);

// Duplicate cards for seamless scroll
cards.forEach(card => {
  const clone = card.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  track.appendChild(clone);
});

let scrollAmount = 0;

function animate() {
  scrollAmount += 3; // Adjust speed here
  if (scrollAmount >= track.scrollWidth / 2) {
    scrollAmount = 0;
  }
  track.style.transform = `translateX(-${scrollAmount}px)`;
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);