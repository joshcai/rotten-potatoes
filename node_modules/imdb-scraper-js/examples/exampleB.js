const { searchMovies } = require('imdb-scraper');

searchMovies('Back to the Future')
    .then(response => console.log(response))
