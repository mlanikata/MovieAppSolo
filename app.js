
const movies = document.querySelector(".movies__list");

movies.innerHTML = `<i class="fa-solid fa-spinner movies__list__spinner"></i>`;

let moviesData = await fetchMovies();


// const movies.innerHTML = `<i class="fa-solid fa-spinner movies__list__spinner"></i>`;
//   let movies = await fetchMovies();


async function moviesSearch(value) {
  
  const response = await 
  
      fetch (`https://www.omdbapi.com/?apikey=60623f72&s=${value}`);
      
      const data = await response.json();
      
      return data;
}



const array = await searchResults.Search.slice(0, 6);

const moviesList = document.querySelector(".movies__list");

const moviesHTML = array



.map((movies) => {
  return `<div class="movie movie__invisible">
<figure class="movie__img__wrapper">
<img src="${movie.Poster}" alt="" class="movie__img">
<h3 class="movie__info__title">${movie.Title}</h3>
<div class="movie__info__list">
<div class="movie__info">
  <i class="fa-solid fa-clock movie__info__icon"></i>
  <p class="movie__info__text">136m</p>
</div>
<div class="movie__info">
  <i class="fa-solid fa-star movie__info__icon"></i>
  <p class="movie__info__text">4.5</p>
</div>
<div class="movie__info">
  <i class="fa-solid fa-earth-americas movie__info__icon"></i>
  <p class="movie__info__text">English</p>
</div>
</div>
</figure>
<h4 class="movie__title">${movie.Title}</h4>
</div>`;
})
.join('');


moviesList.innerHTML = moviesHTML;

``