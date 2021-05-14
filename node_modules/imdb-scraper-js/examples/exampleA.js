const { getMovie } = require('imdb-scraper')

getMovie('tt0096895')
    .then(response => console.log(response))
