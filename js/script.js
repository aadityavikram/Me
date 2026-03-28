const heroImg = document.getElementById('hero-img');
const heroLightbox = document.getElementById('hero-lightbox');
const heroLightboxImg = document.getElementById('hero-lightbox-img');
const heroCloseBtn = document.getElementById('hero-close-btn');

// Open
heroImg.addEventListener('click', () => {
    heroLightbox.style.display = 'flex';
    heroLightboxImg.src = heroImg.src;
    document.body.classList.add('no-scroll');
});

// Close on click outside
heroLightbox.addEventListener('click', (e) => {
    if (e.target !== heroLightboxImg) {
      heroLightbox.style.display = 'none';
      document.body.classList.remove('no-scroll');
    }
});

// ESC close
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      heroLightbox.style.display = 'none';
      document.body.classList.remove('no-scroll');
    }
});

heroCloseBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  heroLightbox.style.display = 'none';
  document.body.classList.remove('no-scroll');
});