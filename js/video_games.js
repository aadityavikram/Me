const images = document.querySelectorAll('.gallery img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

const lightboxTitle = document.getElementById('lightbox-title');
const lightboxLength = document.getElementById('lightbox-length');
const lightboxDesc = document.getElementById('lightbox-desc');
const lightboxDirector = document.getElementById('lightbox-director');
const lightboxLanguage = document.getElementById('lightbox-language');

const videoGamesCount = document.getElementById('video-games-count')

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
const videoGamesJson = 'https://ik.imagekit.io/aadivik/Me/json/video_games_clDw2pWf7.json'

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

let videoGamesData = [];

fetch(videoGamesJson)
  .then(res => res.json())
  .then(data => {
    videoGamesData = data;
    toggleFiltersVisibility();
    populateFilters();
    renderGallery();
  })
  .catch(err => {
    console.error('Error loading Video Games from database:', err);
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
//  console.log("Video Games: " + JSON.stringify(videoGamesData));
  gallery.innerHTML = '';

  const filteredVideoGames = getFilteredVideoGames();
  const totalVideoGames = filteredVideoGames.length;
  const totalPages = Math.ceil(totalVideoGames / itemsPerPage);

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const currentVideoGames = filteredVideoGames.slice(start, end);

  currentVideoGames.forEach((videoGames, index) => {
    const globalIndex = start + index;

    const card = document.createElement('section');
    card.className = 'card';

    card.innerHTML = `
      <img src="${videoGames.primaryImage.url}"
           alt="${videoGames.primaryTitle}"
           data-index="${globalIndex}">

      <p style="margin-top:8px; color:#ef4444; font-size:0.9rem;">
        ${videoGames.primaryTitle}
      </p>
    `;

    gallery.appendChild(card);
  });

  videoGamesCount.textContent = `Total: ${totalVideoGames}`;

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

  videoGamesData.titles.forEach(videoGames => {
    if (videoGames.startYear) hasYear = true;
    if (videoGames.genres && videoGames.genres.length > 0) hasGenre = true;
    if (videoGames.animated !== undefined) hasAnimated = true;
    if (videoGames.language) hasLanguage = true;
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

function getFilteredVideoGames() {
  return videoGamesData.titles.filter(videoGames => {

    if (filters.year && videoGames.startYear != filters.year) return false;

    if (filters.genre && !videoGames.genres.includes(filters.genre)) return false;

    if (filters.animated !== '') {
      if (String(videoGames.animated) !== filters.animated) return false;
    }

    if (filters.language && videoGames.language !== filters.language) return false;

    return true;
  });
}

function populateFilters() {
  const years = new Set();
  const genres = new Set();
  const languages = new Set();

  videoGamesData.titles.forEach(videoGames => {
    if (videoGames.startYear) years.add(videoGames.startYear);
    if (videoGames.language) languages.add(videoGames.language);
    videoGames.genres?.forEach(g => genres.add(g));
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

  videoGamesData.titles.forEach(videoGames => {
    if (videoGames.startYear) years.add(videoGames.startYear);
    if (videoGames.language) languages.add(videoGames.language);
    videoGames.genres?.forEach(g => genres.add(g));
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
    const videoGames = videoGamesData.titles[currentIndex];

    lightboxImg.src = `${videoGames.primaryImage.url}`;

    lightboxTitle.textContent = `${videoGames.primaryTitle} (${videoGames.startYear})`;
    if (videoGames.runtimeSeconds !== undefined) {
      lightboxLength.textContent = secondsToHHMM(videoGames.runtimeSeconds);
    }
    setGenres(videoGames.genres)
    if (videoGames.language !== undefined) {
        lightboxLanguage.textContent = "Language: " + videoGames.language;
    }
    if (videoGames.director !== undefined) {
        lightboxDirector.textContent = "Director: " + videoGames.director;
    }
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