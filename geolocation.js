// const app = document.getElementById("app");
// const dataFromAPI = document.getElementById("response");
const API_KEY = "UUW5rDitvCtApbZqW9OqsXxVGCgec6H3";
const API_GEOPOSITION =
  'https://dataservice.accuweather.com/locations/v1/cities/geoposition/search';
const API_CURRENT_CONDITIONS = 'http://dataservice.accuweather.com/currentconditions/v1/';
// Change city search to text search to get the location key, it searches by city name or postal code! http://dataservice.accuweather.com/locations/v1/search
const API_CITY_SEARCH = 'http://dataservice.accuweather.com/locations/v1/cities/search';
const API_TEXT_SEARCH = 'http://dataservice.accuweather.com/locations/v1/search';
let latitude, longitude, currentPosition, locationKey, city;

const btnCoords = document.getElementById('btn_coords');
const btnGeopos = document.getElementById('btn_geopos');
const btnShowWeather = document.getElementById('btn_show_weather');
const btnGetCityWeather = document.getElementById('btn_get_city_weather');

const displayCoords = document.getElementById('display_coords');
const displayLocation = document.getElementById('display_location');
const displayWeather = document.getElementById('display_weather');
const cityInput = document.getElementById('city_input');


const getPosition = (options) => {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

const getCoords = () => {
  getPosition()
    .then((position) => {
      const { coords } = position;
      // console.log(coords);
      displayCoords.textContent = `${coords.latitude} ${coords.longitude}`;
      latitude = coords.latitude;
      longitude = coords.longitude;
      currentPosition = `${coords.latitude},${coords.longitude}`
      // console.log(latitude, longitude, currentPosition);
    })
    .catch((err) => {
      console.error(err.message);
    });
}

// If we don't press the coordinates btn, the function doesn't get called so the API request fails with a 400 status.

// getCoords();
// setTimeout(
//   () => {
//     console.log(latitude, longitude, currentPosition);
//   }, 0
// );

// btnCoords.addEventListener('click', getCoords);

getKeyByGeoposition = () => {
  axios.get(API_GEOPOSITION, {
    params: {
      apikey: API_KEY,
      q: currentPosition,
    }
  })
    .then((response) => {
      console.log(response);
      locationKey = response.data.Key;
      displayLocation.textContent = `You are in ${response.data.LocalizedName}`;
      console.log(response.data.LocalizedName, locationKey);
    })
    .catch((err) => {
      console.log(err);
    })
}

// getKeyByGeoposition();



// btnGeopos.addEventListener('click', getKeyByGeoposition);
btnShowWeather.addEventListener('click', () => {
  getPosition();
  getCoords();
  setTimeout(() => {
    getKeyByGeoposition();
  }, 0);
    setTimeout(() => {
    getCurrentConditions();
  }, 100);

});

getCity = () => {
  city = cityInput.value;
  if (city === '') {
    return;
  }
  console.log(city);

  return city;
}

getKeyByTextSerch = () => {
  axios.get(API_TEXT_SEARCH, {
    params: {
      apikey: API_KEY,
      q: city,
    }
  }).then((response) => {
    console.log(response.data[0], response.data[0].Key);
    locationKey = response.data[0].Key;
  })
}

getCurrentConditions = () => {
  axios.get(API_CURRENT_CONDITIONS + locationKey, {
    params: {
      apikey: API_KEY,
    }
  }).then((response) => {
    console.log(response, response.data[0].WeatherText);
    displayWeather.textContent = `${response.data[0].WeatherText}, ${response.data[0].Temperature.Metric.Value}`;
  })
}

btnGetCityWeather.addEventListener('click', () => {
  getCity();
  getKeyByTextSerch();
  setTimeout(() => {
    getCurrentConditions();
  }, 1000);
});
