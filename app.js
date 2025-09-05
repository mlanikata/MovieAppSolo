

function searchActive() {
  const input = document.querySelector(".nav__input");
  if (input) {
    input.focus();
  }
}

async function searchBarClick() {
  const movieInput = document.querySelector(".movie__input");
  if (!movieInput) {
    return;
  }
  
  const value = movieInput.value.trim();
  
  if (!value) {
    return; // Just return without doing anything
  }
  
  await performSearch(value);
}

async function searchBarEnter(event) {
  if (event.key !== 'Enter') return;
  
  const activeElement = document.activeElement;
  let value = '';
  
  if (activeElement && activeElement.matches('.nav__input')) {
    value = activeElement.value.trim();
  } else if (activeElement && activeElement.matches('.movie__input')) {
    value = activeElement.value.trim();
  } else {
    return;
  }
  
  if (!value) {
    return; // Just return without doing anything
  }
  
  await performSearch(value);
}

async function performSearch(searchTerm) {
  updateSearchHeader(searchTerm);
  showSpinner();
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    await fetchAndDisplayMovies(searchTerm);
  } catch (error) {
    showError(error.message);
  }
}

function updateSearchHeader(searchTerm) {
  const titleElement = document.querySelector('.movies__top__title');
  const charElement = document.querySelector('.movies__top__title__char');
  
  if (titleElement) {
    titleElement.textContent = 'Search results for:';
  }
  
  if (charElement) {
    charElement.textContent = `"${searchTerm}"`;
    charElement.style.display = 'inline-block';
  }
}

function showSpinner() {
  const movies = document.querySelector(".movies__list");
  if (!movies) {
    return;
  }
  
  movies.innerHTML = `
    <div style="text-align: center; padding: 80px 0; position: relative; width: 100%;">
      <i class="fa-solid fa-spinner" 
         style="font-size: 64px; 
                color: crimson; 
                animation: spin 1s linear infinite;
                display: inline-block;">
      </i>
    </div>
    
    <style>
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    </style>
  `;
}

async function fetchAndDisplayMovies(searchTerm) {
  const response = await fetch(
    `https://omdbapi.com/?type=movie&apikey=28c39af6&s=${encodeURIComponent(searchTerm)}`
  );
  
  if (!response.ok) {
    throw new Error(`Network error: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.Response === "False" || !data.Search) {
    showNoResults(searchTerm);
    return;
  }
  
  const allMovies = data.Search;
  const movies = allMovies.slice(0, 6);
  
  displayMovies(movies);
  
  setTimeout(() => {
    showMovies();
  }, 500);
}

function displayMovies(movies) {
  const container = document.querySelector(".movies__list");
  if (!container) return;
  
  const limitedMovies = movies.slice(0, 6);
  
  const moviesHTML = limitedMovies.map(movie => `
    <div class="movie movie__invisible">
      <figure class="movie__img__wrapper">
        <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/198x288?text=No+Poster'}" 
             alt="${movie.Title}" 
             class="movie__img"
             onerror="this.src='https://via.placeholder.com/198x288?text=No+Poster'">
        <h3 class="movie__info__title">${movie.Title}</h3>
        <div class="movie__info__list">
          <div class="movie__info info__1">
            <i class="fa-solid fa-calendar movie__info__icon"></i>
            <p class="movie__info__text">${movie.Year || 'N/A'}</p>
          </div>
          <div class="movie__info info__2">
            <i class="fa-solid fa-star movie__info__icon"></i>
            <p class="movie__info__text">${movie.imdbRating || 'N/A'}</p>
          </div>
          <div class="movie__info info__3">
            <i class="fa-solid fa-film movie__info__icon"></i>
            <p class="movie__info__text">${movie.Type || 'Movie'}</p>
          </div>
        </div>
      </figure>
      <h4 class="movie__title">${movie.Title}</h4>
    </div>
  `).join('');
  
  container.innerHTML = moviesHTML;
  
  container.style.display = 'grid';
  container.style.gridTemplateColumns = 'repeat(3, 1fr)';
  container.style.gap = '24px';
  container.style.justifyContent = 'center';
  container.style.maxWidth = '100%';
}

function showMovies() {
  const movieElements = document.querySelectorAll('.movie');
  
  movieElements.forEach((movie, index) => {
    setTimeout(() => {
      movie.classList.remove("movie__invisible");
    }, index * 100);
  });
}

function showNoResults(searchTerm) {
  const container = document.querySelector(".movies__list");
  if (container) {
    container.innerHTML = `
      <div style="color: white; text-align: center; padding: 60px; font-size: 20px;">
        <i class="fa-solid fa-search" style="font-size: 48px; color: crimson; margin-bottom: 20px;"></i>
        <p>No movies found for "${searchTerm}"</p>
        <p style="font-size: 16px; opacity: 0.7; margin-top: 10px;">Try a different search term</p>
      </div>
    `;
  }
}

function showError(message) {
  const container = document.querySelector(".movies__list");
  if (container) {
    container.innerHTML = `
      <div style="color: #ff6b6b; text-align: center; padding: 60px; font-size: 18px;">
        <i class="fa-solid fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 20px;"></i>
        <p>Search failed: ${message}</p>
        <button onclick="location.reload()" style="margin-top: 15px; padding: 10px 20px; background: crimson; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Refresh Page
        </button>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const navInput = document.querySelector('.nav__input');
  const movieInput = document.querySelector('.movie__input');
  
  if (navInput) {
    navInput.addEventListener('keydown', searchBarEnter);
  }
  
  if (movieInput) {
    movieInput.addEventListener('keydown', searchBarEnter);
  }
});