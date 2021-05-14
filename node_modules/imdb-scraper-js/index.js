const { searchMovies, searchSeries, searchTitles } = require('./lib/searchTitle');
const getMovie = require('./lib/getMovie')

module.exports = {
    searchMovies,
    searchSeries,
    searchTitles,
    getMovie
}