# IMDB Scraper
A scraper for the IMDB website, to extract information of movies and tv series

## Install

To install the project you can run the following command
```Javascript
npm install imdb-scraper-js
```

## Usage

To get a unique tile by the imdb id
```Javascript
const { getMovie } = require('imdb-scraper')

getMovie('tt0096895')
    .then(response => console.log(response))
```

Output from getMovie
```Javascript
{
  title: 'Batman (1989)',
  originalTile: '',
  description: 'The Dark Knight of Gotham City begins his war on crime with his first major enemy being Jack Napier, a criminal who becomes the clownishly homicidal Joker.',
  rating: '7.5/10',
  year: '(1989)',
  poster: 'https://m.media-amazon.com/images/M/MV5BMTYwNjAyODIyMF5BMl5BanBnXkFtZTYwNDMwMDk2._V1_UX182_CR0,0,182,268_AL_.jpg',
  genres: [ 'Action', 'Adventure' ],
  imdbID: 'tt0096895'
}
```

To search all star wars movies
```Javascript
const { searchMovies } = require('imdb-scraper');

searchMovies('star wars episode')
    .then(response => console.log(response))
```
Example of output from search all star wars movies
```Javascript
{
  title: 'That movie is not Star wars. Episode VII. Last jedi (2017)',
  originalTile: '',
  description: "Darth Vader travels in Austria. He flues on plane. He goes on Vienna's tram. All movie viewer looks all that looks Vader. And this movie is not Star wars. Episode VII. Last Jedi.",
  rating: '6.4/10',
  year: '(2017)',
  poster: 'https://m.media-amazon.com/images/M/MV5BZTU4MTQ0MTMtZTk1YS00NDczLTgyMjUtNmUxNDBmNmIwMjA3XkEyXkFqcGdeQXVyNDcwNDE0Nzk@._V1_UX182_CR0,0,182,268_AL_.jpg',
  genres: [ 'Drama' ],
  imdbID: 'tt7810706'
},
{
  title: 'Star Wars, Episódio VI: O Retorno do Jedi (1983)',
  originalTile: 'Star Wars: Episode VI - Return of the Jedi',
  description: "After a daring mission to rescue Han Solo from Jabba the Hutt, the Rebels dispatch to Endor to destroy the second Death Star. Meanwhile, Luke struggles to help Darth Vader back from the dark side without falling into the Emperor's trap.",
  rating: '8.3/10',
  year: '(1983)',
  poster: 'https://m.media-amazon.com/images/M/MV5BOWZlMjFiYzgtMTUzNC00Y2IzLTk1NTMtZmNhMTczNTk0ODk1XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_UX182_CR0,0,182,268_AL_.jpg',
  genres: [ 'Action', 'Adventure', 'Fantasy', 'Sci-Fi' ],
  imdbID: 'tt0086190'
}
...
```


