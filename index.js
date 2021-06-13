createAutocomplete({
  root: document.querySelector('.autocomplete'),

  renderOption(movie) {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
      <img src='${imgSrc}'; />
      ${movie.Title} (${movie.Year})
    `;
  },

  onOptionSelect(movie) {
    onMovieSelect(movie);
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
});

const onMovieSelect = async (movie) => {
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

  document.querySelector('#summary').innerHTML = movieTemplate(response.data);
};

const movieTemplate = (movieDetail) => {
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

    <article class="notification is-primary">
      <p class="title">Awards</p>
      <p class="subtitle">${movieDetail.Awards}</p>      
    </article>
    <article class="notification is-primary">
      <p class="title">Box Office</p>
      <p class="subtitle">${movieDetail.BoxOffice}</p>    
    </article>
    <article class="notification is-primary">
      <p class="title">Metascore</p>
      <p class="subtitle">${movieDetail.Metascore}</p>    
    </article>
    <article class="notification is-primary">
      <p class="title">IMDB Rating</p>
      <p class="subtitle">${movieDetail.imdbRating}</p>      
    </article>
    <article class="notification is-primary">
      <p class="title">IMDB Votes</p>
      <p class="subtitle">${movieDetail.imdbVotes}</p>      
    </article>
  `;
};
