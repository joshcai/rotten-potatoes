function parseImdb(link) {
  // 1) Remove trailing slash if there is one
  // 2) Split on all slashes
  // 3) Get last segment
  const temp = link.endsWith('/') ? link.slice(0, -1) : link;
  return temp.split('/').slice(-1)[0];
}

const TMDB_API_KEY = '7113330b308756380625e8540f36df53';

var app = new Vue({
  el: '#app',
  data: {
    // Format:
    // {
    //   "imdb_id":
    //   "name": 
    //   "austin_rating":
    //   "patrick_rating":
    //   "guest_name":
    //   "guest_rating":
    //   "imdb_link":
    // }
    reviewed: [],
    to_review: [],
    reviewed_sorted: [],
    // IMDB ID -> poster URL
    posters: {},
    sort_dir: 'desc',
    sort_key: 'date',
    stats: {
      austin_avg: 0,
      patrick_avg: 0,
      total_avg: 0,
      worst_film: [10, ''],
      best_film: [0, ''],
      controversial_film: [0, ''],
    },
  },
  computed: {
    next_up: function () {
      if (this.to_review.length === 0) {
        return undefined;
      }
      return this.to_review[0];
    }
  },
  async created() {
    const customFields = await axios.get('https://api.trello.com/1/boards/608f0a6477d83c36e3dda987/customFields');
    // map from field name to JS property name:
    const nameMap = new Map([
      ['Patrick\'s Rating', 'patrick_rating'],
      ['Austin\'s Rating', 'austin_rating'],
      ['Guest Name', 'guest_name'],
      ['Guest Rating', 'guest_rating'],
      ['IMDB Link', 'imdb_link'],
      ['YouTube Link', 'youtube_link'],
      ['Image Link', 'image_link'],
      ['Date', 'date'],
    ])

    // map from custom field ID -> JS property name
    const idMap = new Map();
    for (const field of customFields.data) {
      idMap.set(field.id, nameMap.get(field.name));
    }

    // Fetch to_review first since the images are at the top of the page
    // and should be rendered first.
    const to_review = await axios.get('https://trello.com/1/lists/608f0a6ddd2bcd02ea6947a2/cards?customFieldItems=true&fields=name');
    for (const movie of to_review.data) {
      const data = {
        name: movie.name,
      }
      for (const field of movie.customFieldItems) {
        data[idMap.get(field.idCustomField)] = field.value.text;
      }
      const imdb_id = parseImdb(data.imdb_link);
      data.imdb_id = imdb_id;
      this.to_review.push(data);
      this.fetchPoster(imdb_id);
    }

    const reviewed = await axios.get('https://trello.com/1/lists/608f0a6bf8b3932f2f0c9a5c/cards?customFieldItems=true&fields=name');
    for (const movie of reviewed.data) {
      const data = {
        name: movie.name,
      }
      for (const field of movie.customFieldItems) {
        data[idMap.get(field.idCustomField)] = field.value.text;
      }
      const imdb_id = parseImdb(data.imdb_link);
      data.imdb_id = imdb_id;
      this.reviewed.push(data);
      this.fetchPoster(imdb_id);
    }

    this.reviewed_sorted = this.reviewed;

    // Stats
    let i = 0;
    for (const movie of this.reviewed) {
      i++;
      this.stats.austin_avg += Number(movie.austin_rating);
      this.stats.patrick_avg += Number(movie.patrick_rating);
      const avg = (Number(movie.austin_rating) + Number(movie.patrick_rating)) / 2;
      if (avg > this.stats.best_film[0]) {
        this.stats.best_film = [avg, movie.name];
      } else if (avg < this.stats.worst_film[0]) {
        this.stats.worst_film = [avg, movie.name];
      }
      const diff = Math.abs(Number(movie.austin_rating) - Number(movie.patrick_rating));
      if (diff > this.stats.controversial_film[0]) {
        this.stats.controversial_film = [diff, movie.name];
      }
    }
    this.stats.austin_avg = this.stats.austin_avg / i;
    this.stats.patrick_avg = this.stats.patrick_avg / i;
    this.stats.total_avg = (this.stats.austin_avg + this.stats.patrick_avg) / 2;
    console.log("Stats for Nerds");
    console.log(`Austin average rating: ${this.stats.austin_avg.toFixed(2)}`);
    console.log(`Patrick average rating: ${this.stats.patrick_avg.toFixed(2)}`);
    console.log(`Total average rating: ${this.stats.total_avg.toFixed(2)}`);
    console.log(`Best film: ${this.stats.best_film[1]} (${this.stats.best_film[0]})`);
    console.log(`Worst film: ${this.stats.worst_film[1]} (${this.stats.worst_film[0]})`);
    console.log(`Most controversial film: ${this.stats.controversial_film[1]} (△${this.stats.controversial_film[0]})`);
  },
  methods: {
    fetchPoster: function(imdb_id) {
      const tmdbUrl = 'https://api.themoviedb.org/3/find/' + imdb_id + '?api_key='+TMDB_API_KEY+'&language=en-US&external_source=imdb_id';

      const response = axios.get(tmdbUrl)
        .then((response) => {
          let poster_path = '';
          if (response.data.movie_results.length > 0) {
            poster_path = response.data.movie_results[0].poster_path;
          } else if (response.data.tv_results.length > 0) {
            poster_path = response.data.tv_results[0].poster_path;
          } else if (response.data.tv_episode_results.length > 0) {
            poster_path = response.data.tv_episode_results[0].poster_path;
          } else if (response.data.tv_season_results.length > 0) {
            poster_path = response.data.tv_season_results[0].poster_path;
          }
          // Couldn't find a poster path.
          if (poster_path === '') {
            return;
          }
          const image_url = 'https://image.tmdb.org/t/p/w342' + poster_path;
          // Need to use this.$set to make sure Vue re-renders since this is done
          // in a callback.
          this.$set(this.posters, imdb_id, image_url);
        });
        
    },
    sort: (sort_key) => {
      // sort_key, sort_dir state-setting
      if (sort_key == this.app._data.sort_key) {
        if (this.app._data.sort_dir == 'asc') {
          this.app._data.sort_dir = 'desc';
        } else {
          this.app._data.sort_dir = 'asc';
        }
      } else {
        if (sort_key == 'name') {
          this.app._data.sort_dir = 'asc';
        } else {
          this.app._data.sort_dir = 'desc';
        }
      }
      this.app._data.sort_key = sort_key;

      // Derived state
      let new_arr = [];
      let order_constant = 1;
      if (this.app._data.sort_dir == 'desc') {
        order_constant = -1
      }

      this.app._data.reviewed_sorted.sort((a, b) => {
        let value_a = a[sort_key];
        let value_b = b[sort_key];

        if (this.app._data.sort_key == 'name') {
          return order_constant * value_a.localeCompare(value_b);
        } else if (this.app._data.sort_key == 'date') {
          return order_constant * (Date.parse(value_a) - Date.parse(value_b));
        } else {
          return order_constant * (Number(value_a) - Number(value_b));
        }
      });
    }
  }
});