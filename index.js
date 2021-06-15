const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
      <img src='${imgSrc}'; />
      ${movie.Title} (${movie.Year})
    `;
  },

  inputValue(movie) {
    return `${movie.Title} (${movie.Year})`;
  },

  async fetchData(searchTerm) {
    const params = {
      apikey: 'ee24b215',
      s: searchTerm,
    };

    const response = await axios.get('http://www.omdbapi.com/', {
      params,
    });

    if (response.data.Error) {
      return [];
    }

    return response.data.Search;
  },
};

createAutocomplete({
  root: document.querySelector('#left-autocomplete'),
  ...autoCompleteConfig,
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
  },
});

createAutocomplete({
  root: document.querySelector('#right-autocomplete'),
  ...autoCompleteConfig,
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
  },
});

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
  const params = {
    apikey: 'ee24b215',
    i: movie.imdbID,
  };

  const response = await axios.get('http://www.omdbapi.com/', {
    params,
  });

  if (response.data.Error) {
    return [];
  }

  summaryElement.innerHTML = movieTemplate(response.data);

  if (side === 'left') {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  const leftSideStats = document.querySelectorAll('#left-summary .notification'); 
  const rightSideStats = document.querySelectorAll('#right-summary .notification');

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    const leftSideValue = parseInt(leftStat.dataset.value);
    const rightSideValue = parseInt(rightStat.dataset.value);

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warning');
    } else {
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning');
    }
  });
};

const movieTemplate = (movieDetail) => {
  const awards = movieDetail.Awards.split(' ').reduce((acc, currValue) => {
    const value = parseInt(currValue);

    if (isNaN(value)) {
      return acc;
    }
    
    return acc + currValue;
  }, 0);
  const boxOffice = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>

      <div class="media-content"
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>

    <article data-value=${awards} class="notification is-primary">
      <p class="subtitle">Awards</p>
      <p class="title">${movieDetail.Awards}</p>      
    </article>
    <article data-value=${boxOffice} class="notification is-primary">
      <p class="subtitle">Box Office</p>
      <p class="title">${movieDetail.BoxOffice}</p>    
    </article>
    <article data-value=${metascore} class="notification is-primary">
      <p class="subtitle">Metascore</p>
      <p class="title">${movieDetail.Metascore}</p>    
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
      <p class="subtitle">IMDB Rating</p>
      <p class="title">${movieDetail.imdbRating}</p>      
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="subtitle">IMDB Votes</p>
      <p class="title">${movieDetail.imdbVotes}</p>      
    </article>
  `;
};
