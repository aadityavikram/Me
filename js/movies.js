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

const gallery = document.getElementById('gallery');

let filters = {
  year: '',
  genre: '',
  animated: '',
  language: ''
};

let currentIndex = 0;
let startX = 0;
let currentX = 0;
const itemsPerPage = 20;
let currentPage = 1;
let isDragging = false;
const moviesJson = 'https://ik.imagekit.io/aadivik/Me/json/movies_OrMZyHxs4.json'

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

let moviesData = [];
let filteredMovies = [];

fetch(moviesJson)
  .then(res => res.json())
  .then(data => {
    moviesData = data;
    toggleFiltersVisibility();
    populateFilters();
    renderGallery();
  })
  .catch(err => {
    console.error('Error loading movies from database:', err);
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

  filteredMovies = getFilteredMovies();
  const totalMovies = filteredMovies.length;
  const totalPages = Math.ceil(totalMovies / itemsPerPage);

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const currentMovies = filteredMovies.slice(start, end);

  currentMovies.forEach((movie, index) => {
    const globalIndex = start + index;

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

function detectAvailableFilters() {
  let hasYear = false;
  let hasGenre = false;
  let hasAnimated = false;
  let hasLanguage = false;

  moviesData.titles.forEach(movie => {
    if (movie.startYear) hasYear = true;
    if (movie.genres && movie.genres.length > 0) hasGenre = true;
    if (movie.animated !== undefined) hasAnimated = true;
    if (movie.language) hasLanguage = true;
  });

  return { hasYear, hasGenre, hasAnimated, hasLanguage };
}

function toggleFiltersVisibility() {
  const { hasYear, hasGenre, hasAnimated, hasLanguage } = detectAvailableFilters();

  document.getElementById('yearFilter').parentElement.style.display =
    hasYear ? 'block' : 'none';

  document.getElementById('genreFilter').parentElement.style.display =
    hasGenre ? 'block' : 'none';

  document.getElementById('animatedFilter').parentElement.style.display =
    hasAnimated ? 'block' : 'none';

  document.getElementById('languageFilter').parentElement.style.display =
    hasLanguage ? 'block' : 'none';
}

function getFilteredMovies() {
  return moviesData.titles.filter(movie => {

    if (filters.year && movie.startYear != filters.year) return false;

    if (filters.genre && !movie.genres.includes(filters.genre)) return false;

    if (filters.animated !== '') {
      if (String(movie.animated) !== filters.animated) return false;
    }

    if (filters.language && movie.language !== filters.language) return false;

    return true;
  });
}

function populateFilters() {
  const years = new Set();
  const genres = new Set();
  const languages = new Set();

  moviesData.titles.forEach(movie => {
    if (movie.startYear) years.add(movie.startYear);
    if (movie.language) languages.add(movie.language);
    movie.genres?.forEach(g => genres.add(g));
  });

  const yearFilter = document.getElementById('yearFilter');
  const genreFilter = document.getElementById('genreFilter');
  const languageFilter = document.getElementById('languageFilter');

  yearFilter.innerHTML = '<option value="">Year</option>';
  genreFilter.innerHTML = '<option value="">Genre</option>';
  languageFilter.innerHTML = '<option value="">Language</option>';

  [...years].sort().forEach(y => {
    yearFilter.innerHTML += `<option value="${y}">${y}</option>`;
  });

  [...genres].sort().forEach(g => {
    genreFilter.innerHTML += `<option value="${g}">${g}</option>`;
  });

  [...languages].sort().forEach(l => {
    languageFilter.innerHTML += `<option value="${l}">${l}</option>`;
  });
}

function populateFilters() {
  const years = new Set();
  const genres = new Set();
  const languages = new Set();

  moviesData.titles.forEach(movie => {
    if (movie.startYear) years.add(movie.startYear);
    if (movie.language) languages.add(movie.language);
    movie.genres?.forEach(g => genres.add(g));
  });

  const yearFilter = document.getElementById('yearFilter');
  const genreFilter = document.getElementById('genreFilter');
  const languageFilter = document.getElementById('languageFilter');

  yearFilter.innerHTML = '<option value="">Year</option>';
  genreFilter.innerHTML = '<option value="">Genre</option>';
  languageFilter.innerHTML = '<option value="">Language</option>';

  [...years].sort().forEach(y => {
    yearFilter.innerHTML += `<option value="${y}">${y}</option>`;
  });

  [...genres].sort().forEach(g => {
    genreFilter.innerHTML += `<option value="${g}">${g}</option>`;
  });

  [...languages].sort().forEach(l => {
    languageFilter.innerHTML += `<option value="${l}">${l}</option>`;
  });
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
    const movie = filteredMovies[currentIndex];

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
      currentIndex = (currentIndex + 1) % filteredMovies.length;
      updateLightbox();
    }

    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + filteredMovies.length) % filteredMovies.length;
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

document.getElementById('yearFilter')?.addEventListener('change', (e) => {
  filters.year = e.target.value;
  currentPage = 1;
  renderGallery();
});

document.getElementById('genreFilter')?.addEventListener('change', (e) => {
  filters.genre = e.target.value;
  currentPage = 1;
  renderGallery();
});

document.getElementById('animatedFilter')?.addEventListener('change', (e) => {
  filters.animated = e.target.value;
  currentPage = 1;
  renderGallery();
});

document.getElementById('languageFilter')?.addEventListener('change', (e) => {
  filters.language = e.target.value;
  currentPage = 1;
  renderGallery();
});