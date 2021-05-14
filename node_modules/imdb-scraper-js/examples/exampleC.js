const { searchSeries } = require('imdb-scraper')

searchSeries('Game of Thrones')
    .then(response => console.log(response))
