// Get the current weather image element
const currImg = document.getElementById('current-img');
// Get the current heat element
const currHeat = document.getElementById('current-heat');
// Get the current city element
const currCity = document.getElementById('currentCity');


// This objects represents the weather images src locations
const weatherIcons = {
  sun: './assets/Sun.svg',
  rain: './assets/Raining.svg',
  snow: './assets/snow.svg',
  thunder: './assets/Thunder.svg',
  cloud: './assets/cloudy.svg'
}

function getLocation() {
  // Get latitude longitude with builtin geolocation
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log(latitude, longitude);
      //convert lat lon values to address and display the location on DOM
      convertLocation(latitude, longitude);
    },
    function (error) {
        window.alert("Error occurred: " + error);
    }
  );
  } else {
    window.alert("Geolocation is not supported by this browser.");
  }
}

function convertLocation(lat, lon) {
  const key = config.MY_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${key}`
  fetch(url)
    .then((response) => response.json())
    .then((location) => {
      const locationName = location.results[9].formatted_address;
      // chage current city element's inner text to loaded location
      currCity.innerText = locationName;
    })
    .catch((err) => console.log(err));
}

getLocation();

