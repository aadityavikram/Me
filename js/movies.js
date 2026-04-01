const images = document.querySelectorAll('.gallery img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

const lightboxTitle = document.getElementById('lightbox-title');
const lightboxLength = document.getElementById('lightbox-length');
const lightboxDesc = document.getElementById('lightbox-desc');
const lightboxDirector = document.getElementById('lightbox-director');
const lightboxLanguage = document.getElementById('lightbox-language');

const genresContainer = document.getElementById("lightbox-genres");

let currentIndex = 0;
let startX = 0;
let currentX = 0;
let isDragging = false;
const moviesUrl = ''
const moviesJson = 'https://ik.imagekit.io/aadivik/Me/json/movies_XGraAJfhm.json'

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const gallery = document.getElementById('gallery');

let moviesData = [];

fetch(moviesUrl)
  .then(res => res.json())
  .then(data => {
    moviesData = data;
    renderGallery();
  })
  .catch(err => {
    console.error('Error loading movies from URL:', err);
    fetch(moviesJson)
      .then(res => res.json())
      .then(data => {
        moviesData = data;
        renderGallery();
      })
      .catch(err => console.error('Error loading movies from JSON:', err));
  });

/* ---------- OPEN ---------- */
images.forEach((img, index) => {
  img.addEventListener('click', () => {
    currentIndex = index;

    lightbox.style.display = 'flex';
    lightbox.scrollTop = 0;
    updateLightbox();

    document.body.classList.add('no-scroll');
  });
});

/* ---------- RENDER FROM URL / JSON ---------- */
function renderGallery() {
//  console.log("Movie: " + JSON.stringify(moviesData));
  gallery.innerHTML = '';

  moviesData.titles.forEach((movie, index) => {

    const card = document.createElement('section');
    card.className = 'card';

    card.innerHTML = `
      <img src="${movie.primaryImage.url}"
           alt="${movie.primaryTitle}"
           data-index="${index}">

      <p style="margin-top:8px; color:#ef4444; font-size:0.9rem;">
        ${movie.primaryTitle}
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
    const movie = moviesData.titles[currentIndex];

    lightboxImg.src = `${movie.primaryImage.url}`;

    lightboxTitle.textContent = `${movie.primaryTitle} (${movie.startYear})`;
    if (movie.runtimeSeconds !== undefined) {
      lightboxLength.textContent = secondsToHHMMSS(movie.runtimeSeconds);
    }
    setGenres(movie.genres)
    if (movie.language !== undefined) {
        lightboxLanguage.textContent = "Language: " + movie.language;
    }
    if (movie.director !== undefined) {
        lightboxDirector.textContent = "Director: " + movie.director;
    }
    lightboxDesc.textContent = movie.plot;
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