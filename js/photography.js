const images = document.querySelectorAll('.gallery img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

let currentIndex = 0;
let startX = 0;
let endX = 0;
const counter = document.getElementById('counter');

images.forEach((img, index) => {
    img.addEventListener('click', () => {
      currentIndex = index;
      lightbox.style.display = 'flex';
      lightboxImg.src = img.src;
      updateCounter();
    });
});

function updateCounter() {
  counter.textContent = `${currentIndex + 1} / ${images.length}`;
}

lightbox.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

lightbox.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
});

function handleSwipe() {
    const diff = startX - endX;

    // Minimum swipe distance (avoid accidental touches)
    if (Math.abs(diff) < 50) return;

    if (diff > 0) {
      currentIndex = (currentIndex + 1) % images.length;
    } else {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
    }

    lightboxImg.src = images[currentIndex].src;
    updateCounter();
}

images.forEach(img => {
  img.addEventListener('click', () => {
    lightbox.style.display = 'flex';
    lightboxImg.src = img.src;
  });
});

// Close on clicking outside image
lightbox.addEventListener('click', (e) => {
  if (e.target !== lightboxImg) {
    lightbox.style.display = 'none';
  }
});

// Close on close button
  const closeBtn = document.getElementById('close-btn');
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    lightbox.style.display = 'none';
  });

// Keyboard controls
document.addEventListener('keydown', (e) => {
if (lightbox.style.display === 'flex') {

  if (e.key === 'Escape') {
    lightbox.style.display = 'none';
  }

  if (e.key === 'ArrowRight') {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImg.src = images[currentIndex].src;
    updateCounter();
  }

  if (e.key === 'ArrowLeft') {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentIndex].src;
    updateCounter();
  }
}
});

const topBtn = document.getElementById('topBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
      topBtn.style.display = 'block';
    } else {
      topBtn.style.display = 'none';
    }
  });

  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });