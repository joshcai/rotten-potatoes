var app = new Vue({
  el: '#app',
  data: {
    // Format:
    // {
    //   "name": 
    //   "austin_rating":
    //   "patrick_rating":
    //   "guest_name":
    //   "guest_rating":
    //   "imdb_link":
    // }
    reviewed: [],
  },
  async mounted() {
    const customFields = await axios.get('https://api.trello.com/1/boards/608f0a6477d83c36e3dda987/customFields');
    // map from field name to JS property name:
    const nameMap = new Map([
      ['Patrick\'s Rating', 'patrick_rating'],
      ['Austin\'s Rating', 'austin_rating'],
      ['Guest Name', 'guest_name'],
      ['Guest Rating', 'guest_rating'],
      ['IMDB Link', 'imdb_link'],
      ['YouTube Link', 'youtube_link'],
      ['Date', 'date'],
    ])
    // map from custom field ID -> JS property name
    const idMap = new Map();
    for (const field of customFields.data) {
      idMap.set(field.id, nameMap.get(field.name));
    }

    const reviewed = await axios.get('https://trello.com/1/lists/608f0a6bf8b3932f2f0c9a5c/cards?customFieldItems=true&fields=name');
    for (const movie of reviewed.data.reverse()) {
      const reviewed = {
        name: movie.name,
      }
      for (const field of movie.customFieldItems) {
        reviewed[idMap.get(field.idCustomField)] = field.value.text;
      }
      this.reviewed.push(reviewed);
    }
  },
});

