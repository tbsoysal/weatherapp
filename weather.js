// Get the current weather image element
const currImg = document.getElementById('current-img');
// Get the current heat element
const currHeat = document.getElementById('current-heat');
// Get the current city element
const currCity = document.getElementById('currentCity');
const currMax = document.getElementById('currentMax');
const currMin = document.getElementById('currentMin');
// Get date elements
const todayEl = document.getElementById('todaysDay');
const dateEl = document.getElementById('todaysDate');
const otherDays = document.querySelectorAll('.otherDays');
const otherDaysHeats = document.querySelectorAll('.bigger');


// This objects represents the weather images src locations
const weatherIcons = {
  sun: './assets/Sun.svg',
  rain: './assets/Raining.svg',
  snow: './assets/snow.svg',
  thunder: './assets/Thunder.svg',
  cloud: './assets/cloudy.svg'
}

function ShowLocation() {
  // Get latitude longitude with builtin geolocation
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      //convert lat lon values to address and display the location on DOM
      convertLocation(latitude, longitude);
      // get the weather details and display with latitude, longitude
      getWeather(latitude, longitude);
      getForecast(latitude, longitude);
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
  const google_api_key = config.MY_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${google_api_key}`
  fetch(url)
    .then((response) => response.json())
    .then((location) => {
      const locationName = location.results[9].formatted_address;
      // chage current city element's inner text to loaded location
      currCity.innerText = locationName;
    })
    .catch((err) => console.log(err));
}

function ShowDates() {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const now = new Date();

  const dayIndex = now.getDay();
  const monthIndex = now.getMonth(); // Returns 0-11
  const monthName = monthNames[monthIndex]; // Get the corresponding month name
  const dayName = dayNames[dayIndex];
  const dayOfMonth = now.getDate();
  const dateText = `${monthName}, ${dayOfMonth}`;
  
  //change dom
  todaysDay.innerText = dayName;
  todaysDate.innerText = dateText;
  
  otherDays.forEach((day,index) => {
    let newDayIndex = dayIndex + (index+1);
    if(newDayIndex >= 7)
      newDayIndex = 7 - newDayIndex;
    day.innerText = dayNames[newDayIndex];
  });

}

function getWeather(lat, lon) {
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,is_day&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`)
    .then(response => response.json())
    .then(data => {
      const currentHeat = Math.round(data.current.temperature_2m);
      const currentMax = Math.round(data.daily.temperature_2m_max[0]);
      const currentMin = Math.round(data.daily.temperature_2m_min[0]);
      const otherMax = [];
      data.daily.temperature_2m_max.map((temp, index)=> {
        if(index !== 0 && index < 5)
          otherMax.push(Math.round(temp));
      })

     //Display the data in dom
      currHeat.innerText = currentHeat + "°";
      currMax.innerText = `Max: ${currentMax}°`;
      currMin.innerText = `Min: ${currentMin}°`;

      otherDaysHeats.forEach((el,index) => {
        el.innerText = otherMax[index] + "°";
      })
    })
    .catch(err => console.log(err));
}

function getForecast(lat, lon) {
  const weather_api_key = config.weather_key;
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weather_api_key}`)
    .then(res => res.json())
    .then(data => setImg(data.weather[0].main))
    .catch(err => console.log(err))
}

function setImg(weatherDescription){
  switch(weatherDescription){
    case 'Clear':
      currImg.src = weatherIcons.cloud;
      break;
    case 'Sunny':
      currImg.src = weatherIcons.sun;
      break;
    case 'Rain':
      currImg.src = weatherIcons.rain;
      break;
    case 'Snow':
      currImg.src = weatherIcons.snow;
      break;
    case 'Thunder':
      currImg.src = weatherIcons.thunder;
      break;
  };
}

ShowLocation();
ShowDates();
