const getAll = () => (
  fetch('https://data.nasa.gov/resource/gh4g-9sfh.geojson?')
     .then(function(response) {
       return response.json();
     })
     .then(function(myJson) {
       return myJson;
  }));

export default {
  getAll
}
