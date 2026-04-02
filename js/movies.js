const images = document.querySelectorAll('.gallery img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

const lightboxTitle = document.getElementById('lightbox-title');
const lightboxLength = document.getElementById('lightbox-length');
const lightboxDesc = document.getElementById('lightbox-desc');
const lightboxDirector = document.getElementById('lightbox-director');
const lightboxLanguage = document.getElementById('lightbox-language');

const movieCount = document.getElementById('movie-count')

const genresContainer = document.getElementById("lightbox-genres");

const pagination = document.getElementById('pagination');

let currentIndex = 0;
let startX = 0;
let currentX = 0;
const itemsPerPage = 20;
let currentPage = 1;
let isDragging = false;
const moviesUrl = ''
const moviesJson = 'https://ik.imagekit.io/aadivik/Me/json/movies_OrMZyHxs4.json'

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

  const totalMovies = moviesData.titles.length;
  const totalPages = Math.ceil(totalMovies / itemsPerPage);

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const currentMovies = moviesData.titles.slice(start, end);

  currentMovies.forEach((movie, index) => {
    const globalIndex = start + index;

    const card = document.createElement('section');
    card.className = 'card';

    card.innerHTML = `
      <img src="${movie.primaryImage.url}"
           alt="${movie.primaryTitle}"
           data-index="${globalIndex}">
      <p style="margin-top:8px; color:#ef4444; font-size:0.9rem;">
        ${movie.primaryTitle}
      </p>
    `;

    gallery.appendChild(card);
  });

  movieCount.textContent = `Total: ${totalMovies}`;

  updatePagination(totalPages);

  attachClickEvents();
}

function updatePagination(totalPages) {
  pagination.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;

    if (i === currentPage) {
      btn.classList.add('active');
    }

    btn.addEventListener('click', () => {
      currentPage = i;
      renderGallery();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    pagination.appendChild(btn);
  }
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
      lightboxLength.textContent = secondsToHHMM(movie.runtimeSeconds);
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

function secondsToHHMM(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  // Pad with leading zeros
  const pad = (num) => String(num).padStart(2, '0');

  return `${pad(hours)}h ${pad(minutes)}m`;
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