const images = document.querySelectorAll('.gallery img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

const lightboxTitle = document.getElementById('lightbox-title');
const lightboxLength = document.getElementById('lightbox-length');
const lightboxDesc = document.getElementById('lightbox-desc');

const genresContainer = document.getElementById("lightbox-genres");

let currentIndex = 0;
let startX = 0;
let currentX = 0;
let isDragging = false;
const videoGamesUrl = ''
const videoGamesJson = 'https://ik.imagekit.io/aadivik/Me/video_games_a-3YnJ3Mr.json'

const swipeThreshold = 40;
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
let hintShown = false;

const gallery = document.getElementById('gallery');

let videoGamesData = [];

fetch(videoGamesUrl)
  .then(res => res.json())
  .then(data => {
    videoGamesData = data;
    renderGallery();
  })
  .catch(err => {
    console.error('Error loading Video Games from URL:', err);
    fetch(videoGamesJson)
      .then(res => res.json())
      .then(data => {
        videoGamesData = data;
        renderGallery();
      })
      .catch(err => console.error('Error loading Video Games from JSON:', err));
  });

/* ---------- OPEN ---------- */
images.forEach((img, index) => {
  img.addEventListener('click', () => {
    currentIndex = index;

    lightbox.style.display = 'flex';
    updateLightbox();

    document.body.classList.add('no-scroll');

    // Hint
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

/* ---------- RENDER FROM URL / JSON ---------- */
function renderGallery() {
//  console.log("Video Games: " + JSON.stringify(videoGamesData));
  gallery.innerHTML = '';

  videoGamesData.titles.forEach((videoGames, index) => {

    const card = document.createElement('section');
    card.className = 'card';

    card.innerHTML = `
      <img src="${videoGames.primaryImage.url}"
           alt="${videoGames.primaryTitle}"
           data-index="${index}">

      <p style="margin-top:8px; color:#ef4444; font-size:0.9rem;">
        ${videoGames.primaryTitle}
      </p>
    `;

    gallery.appendChild(card);
  });

  attachClickEvents();
}

function attachClickEvents() {
  const images = document.querySelectorAll('.gallery img');

  images.forEach((img) => {
    img.addEventListener('click', () => {

      currentIndex = parseInt(img.dataset.index);

      lightbox.style.display = 'flex';
      updateLightbox();
      document.body.classList.add('no-scroll');
    });
  });
}

function updateLightbox() {
    const videoGames = videoGamesData.titles[currentIndex];

    lightboxImg.src = `${videoGames.primaryImage.url}`;

    lightboxTitle.textContent = `${videoGames.primaryTitle} (${videoGames.startYear})`;
    if (videoGames.runtimeSeconds !== undefined) {
      lightboxLength.textContent = secondsToHHMMSS(videoGames.runtimeSeconds);
    }
    setGenres(videoGames.genres)
    lightboxDesc.textContent = videoGames.plot;
}

function setGenres(genresArray) {
  genresContainer.innerHTML = ""; // clear previous

  genresArray.forEach(genre => {
    const tag = document.createElement("div");
    tag.classList.add("genre-tag");
    tag.textContent = genre;
    genresContainer.appendChild(tag);
  });
}

function secondsToHHMMSS(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Pad with leading zeros
  const pad = (num) => String(num).padStart(2, '0');

  return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
}

/* ---------- SWIPE ---------- */
lightbox.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  isDragging = true;
});

lightbox.addEventListener('touchmove', (e) => {
  if (!isDragging) return;

  currentX = e.touches[0].clientX;
  const diff = currentX - startX;

  lightboxImg.style.transform = `translateX(${diff}px)`;
});

lightbox.addEventListener('touchend', () => {
  if (!isDragging) return;
  isDragging = false;

  const diff = currentX - startX;

  lightboxImg.style.transition = 'transform 0.2s ease';

  if (Math.abs(diff) > swipeThreshold) {
    if (diff < 0) {
      currentIndex = (currentIndex + 1) % images.length;
    } else {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
    }

    updateLightbox();
  }

  lightboxImg.style.transform = 'translateX(0)';

  setTimeout(() => {
    lightboxImg.style.transition = '';
  }, 200);
});

/* ---------- CLOSE ---------- */
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

const closeBtn = document.getElementById('close-btn');
closeBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  closeLightbox();
});

function closeLightbox() {
  lightbox.style.display = 'none';
  document.body.classList.remove('no-scroll');
}

/* ---------- KEYBOARD ---------- */
document.addEventListener('keydown', (e) => {
  if (lightbox.style.display === 'flex') {

    if (e.key === 'Escape') {
      closeLightbox();
    }

    if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % images.length;
      updateLightbox();
    }

    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateLightbox();
    }
  }
});

/* ---------- BACK TO TOP ---------- */
const topBtn = document.getElementById('topBtn');

window.addEventListener('scroll', () => {
  topBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
});

topBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});