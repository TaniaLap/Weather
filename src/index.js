function formatDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dayIndex];

  return `${day} ${hours}:${minutes}`;
}
let dateElement = document.querySelector("#nowday");
let currentTime = new Date();
dateElement.innerHTML = formatDate(currentTime);

// The weather

function showTemperature(response) {
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#current-city-name").innerHTML = response.data.name;
  document.querySelector("#temp-description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#min").innerHTML = `min ${Math.round(
    response.data.main.temp_min
  )}°C`;
  document.querySelector("#max").innerHTML = `max ${Math.round(
    response.data.main.temp_max
  )}°C`;

  celsiusTemperature = response.data.main.temp;
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-text-input").value;
  citySearch(city);
}

function citySearch(city) {
  let apiKey = "a7acd530e7eaaf23ad3af01b6ca44155";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemperature);
}

// Location

function showPosition(position) {
  var lat = position.coords.latitude;
  var long = position.coords.longitude;
  let apiKey = "a7acd530e7eaaf23ad3af01b6ca44155";
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
  axios.get(url).then(showTemperature);
}
function retrievePosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

let buttonCurrent = document.querySelector("#current-location-button");
buttonCurrent.addEventListener("click", retrievePosition);

function displayFahrenheitTemperature(event) {
  event.preventDefault();

  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheiTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheiTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}
let celsiusTemperature = null;
let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

citySearch("Dresden");

// function showTemper(event) {
//   event.preventDefault();
//   let temper = document.querySelector("#temperature");
//   temper.innerHTML = 80;
// }

// let linkTemp = document.querySelector("#fahrenheit-link");
// linkTemp.addEventListener("click", showTemper);

// function showCelsius(event) {
//   event.preventDefault();
//   let temper = document.querySelector("#temperature");
//   temper.innerHTML = 27;
// }

// let linkCels = document.querySelector("#celsius-link");
// linkCels.addEventListener("click", showCelsius);
