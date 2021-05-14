const axios = require('axios');
const cheerio = require('cheerio');
const ora = require('ora');
const { removeDuplicates } = require('./helper');

const baseUrl = 'https://www.imdb.com';
const spinner = ora('Loading data ...').start();

function _getTitle($) {
    return $('.title_wrapper h1').text().trim();
}

function _getOriginalTitle($) {
    return $('.originalTitle').text().replace('(original title)', '').trim();
}

function _getDescription($) {
    return $('.summary_text').text().trim();
}

function _getRating($) {
    return $('.ratingValue span').text().trim();
}

function _getYear($) {
    return $('#titleYear').text();
}

function _getPoster($) {
    return $('.poster img').attr('src');
}

function _getGenres($) {
    const genres =
        Array.from($('a[href*=genres]'))
            .map(a => a.firstChild.data.trim());
    return removeDuplicates(genres);
}

function _extractData(data) {
    const $ = cheerio.load(data);
    return ({
        title: _getTitle($),
        originalTile: _getOriginalTitle($),
        description: _getDescription($),
        rating: _getRating($),
        year: _getYear($),
        poster: _getPoster($),
        genres: _getGenres($)
    })
}

async function getMovie(movieId) {
    const url = `${baseUrl}/title/${movieId}`;
    try {
        const response = await axios.get(url)
        const movie = _extractData(response.data)
        movie.imdbID = movieId
        spinner.stop()
        return movie
    } catch(error) {
        console.log(error)
    }
}

module.exports = getMovie
