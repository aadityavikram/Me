const images = document.querySelectorAll('.gallery img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

let currentIndex = 0;
let startX = 0;
let currentX = 0;
let isDragging = false;
const swipeThreshold = 40;
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
let hintShown = false;
const counter = document.getElementById('counter');

images.forEach((img, index) => {
    img.addEventListener('click', () => {
      currentIndex = index;
      lightbox.style.display = 'flex';
      lightboxImg.src = img.src;
      updateCounter();
      document.body.classList.add('no-scroll');

      if (!hintShown) {
          const hint = document.getElementById('hint');

          hint.textContent = isMobile
            ? 'Swipe left/right to navigate'
            : 'Use ← → keyboard arrow keys to navigate';

          hint.style.display = 'block';

          setTimeout(() => {
            hint.style.display = 'none';
          }, 1500);

          hintShown = true;
        }
    });
});

function updateCounter() {
  counter.textContent = `${currentIndex + 1} / ${images.length}`;
}

lightbox.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
});

lightbox.addEventListener('touchmove', (e) => {
    if (!isDragging) return;

    currentX = e.touches[0].clientX;
    const diff = currentX - startX;

    // 👇 move image with finger (smooth feel)
    lightboxImg.style.transform = `translateX(${diff}px)`;
});

lightbox.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;

    const diff = currentX - startX;

    // 👇 reset position smoothly
    lightboxImg.style.transition = 'transform 0.2s ease';

    if (Math.abs(diff) > swipeThreshold) {
      if (diff < 0) {
        // swipe left → next
        currentIndex = (currentIndex + 1) % images.length;
      } else {
        // swipe right → prev
        currentIndex = (currentIndex - 1 + images.length) % images.length;
      }

      lightboxImg.src = images[currentIndex].src;
      updateCounter();
    }

    // snap back
    lightboxImg.style.transform = 'translateX(0)';

    // remove transition after animation
    setTimeout(() => {
      lightboxImg.style.transition = '';
    }, 200);
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
    document.body.classList.remove('no-scroll');
  }
});

// Close on close button
  const closeBtn = document.getElementById('close-btn');
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    lightbox.style.display = 'none';
    document.body.classList.remove('no-scroll');
  });

// Keyboard controls
document.addEventListener('keydown', (e) => {
if (lightbox.style.display === 'flex') {

  if (e.key === 'Escape') {
    lightbox.style.display = 'none';
    document.body.classList.remove('no-scroll');
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