// createAutocomplete({
//     root: document.querySelector('.autocomplete'),
//     renderOption: ,
//     onOptionSelect: ,
//     inputValue: ,
//     fetchData:
// })

const fetchData = async (searchTerm) => {
  const params = {
    apikey: "ee24b215",
    s: searchTerm,
  };

  const response = await axios.get("http://www.omdbapi.com/", {
    params,
  });

  if (response.data.Error) {
    return [];
  }

  return response.data.Search;
};

const input = document.querySelector("input");

const onInput = async (event) => {
  const movies = await fetchData(event.target.value);

  for (let movie of movies) {
    const div = document.createElement("div");
    // img === 'N/A' ? '' : movie.Poster;

    div.innerHTML = `
      <img src="${movie.Poster}"; />
      <h1>${movie.Title} ${movie.Year}</h1>
    `;

    document.querySelector('#target').appendChild(div);
  }
};

input.addEventListener("input", debounce(onInput, 500));
