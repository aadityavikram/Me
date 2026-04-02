const images = document.querySelectorAll('.gallery img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

const lightboxTitle = document.getElementById('lightbox-title');
const lightboxLength = document.getElementById('lightbox-length');
const lightboxDesc = document.getElementById('lightbox-desc');
const lightboxDirector = document.getElementById('lightbox-director');
const lightboxLanguage = document.getElementById('lightbox-language');

const tvSeriesCount = document.getElementById('tv-series-count')

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
const tvSeriesJson = 'https://ik.imagekit.io/aadivik/Me/json/tv_series_BhJH5kXDb.json'

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

let tvSeriesData = [];

fetch(tvSeriesJson)
  .then(res => res.json())
  .then(data => {
    tvSeriesData = data;
    populateFilters();
    renderGallery();
  })
  .catch(err => {
    console.error('Error loading TV Series from database:', err);
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
//  console.log("TV Series: " + JSON.stringify(tvSeriesData));
  gallery.innerHTML = '';

  const filteredTvSeries = getFilteredTvSeries();
  const totalTvSeries = filteredTvSeries.length;
  const totalPages = Math.ceil(totalTvSeries / itemsPerPage);

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const currentTvSeries = filteredTvSeries.slice(start, end);

  currentTvSeries.forEach((tvSeries, index) => {
    const globalIndex = start + index;

    const card = document.createElement('section');
    card.className = 'card';

    card.innerHTML = `
      <img src="${tvSeries.primaryImage.url}"
           alt="${tvSeries.primaryTitle}"
           data-index="${globalIndex}">

      <p style="margin-top:8px; color:#ef4444; font-size:0.9rem;">
        ${tvSeries.primaryTitle}
      </p>
    `;

    gallery.appendChild(card);
  });

  tvSeriesCount.textContent = `Total: ${totalTvSeries}`;

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

function getFilteredTvSeries() {
  return tvSeriesData.titles.filter(tvSeries => {

    if (filters.year && tvSeries.startYear != filters.year) return false;

    if (filters.genre && !tvSeries.genres.includes(filters.genre)) return false;

    if (filters.animated !== '') {
      if (String(tvSeries.animated) !== filters.animated) return false;
    }

    if (filters.language && tvSeries.language !== filters.language) return false;

    return true;
  });
}

function populateFilters() {
  const years = new Set();
  const genres = new Set();
  const languages = new Set();

  tvSeriesData.titles.forEach(tvSeries => {
    if (tvSeries.startYear) years.add(tvSeries.startYear);
    if (tvSeries.language) languages.add(tvSeries.language);
    tvSeries.genres?.forEach(g => genres.add(g));
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

  tvSeriesData.titles.forEach(tvSeries => {
    if (tvSeries.startYear) years.add(tvSeries.startYear);
    if (tvSeries.language) languages.add(tvSeries.language);
    tvSeries.genres?.forEach(g => genres.add(g));
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
    const tvSeries = tvSeriesData.titles[currentIndex];

    lightboxImg.src = `${tvSeries.primaryImage.url}`;

    lightboxTitle.textContent = `${tvSeries.primaryTitle} (${tvSeries.startYear})`;
    if (tvSeries.runtimeSeconds !== undefined) {
      lightboxLength.textContent = secondsToHHMM(tvSeries.runtimeSeconds);
    }
    setGenres(tvSeries.genres)
    if (tvSeries.language !== undefined) {
        lightboxLanguage.textContent = "Language: " + tvSeries.language;
    }
    if (tvSeries.director !== undefined) {
        lightboxDirector.textContent = "Creator: " + tvSeries.director;
    }
    lightboxDesc.textContent = tvSeries.plot;
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