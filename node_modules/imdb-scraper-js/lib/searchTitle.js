const axios = require('axios');
const cheerio = require('cheerio');
const baseUrl = 'https://www.imdb.com';

const getMovie = require('./getMovie');
const { removeDuplicates } = require('./helper');

function _getMovieIds(data) {
    const $ = cheerio.load(data);
    const movieIDs =
        Array.from($('table tbody tr a'))
            .map(a => a.attribs.href)
            .map(a => a.split('/')[2])
    return removeDuplicates(movieIDs);
}

// Os seguintes filtros basta incluir o parametro informado:
// All Titles - &ttype=tt
// TV Series  - &ttype=tv
// Movies     - &ttype=ft
async function searchTitles(name, filter = '') {
    const url = `${baseUrl}/find?q=${name}&s=tt${filter}`
    try {
        const response = await axios.get(url)
        const movieIds = _getMovieIds(response.data)
        return (
            Promise.all(
                movieIds.map(movieId => getMovie(movieId))
            )
        )
    } catch(error) {
        console.log(error)
    }
}

async function searchMovies(name) {
    return searchTitles(name, '&ttype=ft');
}

async function searchSeries(name) {
    return searchTitles(name, '&ttype=tv');
}

module.exports = { searchMovies, searchSeries, searchTitles }
