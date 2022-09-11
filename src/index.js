// This function formats the date and the hour

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

// This function formats the day in the forecast columns

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return days[day];
}

// This function change the weather image from the medias folder

function displayImage(icon) {
  let iconPath = "";
  if (icon === `01d`) {
    iconPath = "./images/sun.png";
  } else if (icon === `02d`) {
    iconPath = "./images/warm.png";
  } else if (
    icon === `03d` ||
    icon === `04d` ||
    icon === `03n` ||
    icon === `04n`
  ) {
    iconPath = "./images/clouds.png";
  } else if (
    icon === `09d` ||
    icon === `09n` ||
    icon === `10d` ||
    icon === `10n`
  ) {
    iconPath = "./images/rain.png";
  } else if (icon === `11d` || icon === `11n`) {
    iconPath = "./images/storm.png";
  } else if (icon === `13d` || icon === `13n`) {
    iconPath = "./images/snow.png";
  } else if (icon === `50d` || icon === `50n`) {
    iconPath = "./images/mist.png";
  } else if (icon === `01n`) {
    iconPath = "./images/moon.png";
  } else if (icon === `02n`) {
    iconPath = "./images/moonclouds.png";
  }

  return iconPath;
}

// This function display the forecast COLUMNS

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row row-cols-2 row-cols-lg-6 p-4 pt-0 m-0 g-1 g-sm-3">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
<div class="col-2">
    <div class="card text-center h-100">
          <img src="${displayImage(forecastDay.weather[0].icon)}"
            alt=""
             class="mx-auto d-block mt-4"
             id="icon"/>
      <div class="card-body pt-1 p-1 p-sm-2">
        <h5 class="card-title m-0">
          <span class="weather-forecast-temperature-max">${Math.round(
            forecastDay.temp.max
          )}°</span>
          <span class="weather-forecast-temperature-min">${Math.round(
            forecastDay.temp.min
          )}°</span>
         </h5>
         <p class="card-text">${formatDay(forecastDay.dt)}</p>
</div>
    </div>
      </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

// This fonction get the coordinates

function getForecast(coordinates) {
  let apiKey = "c95d60a1e3adbeb286133f1ebebc2579";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

// This fonction get the API reponse and dispatches it on HTML

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

  let image = document.querySelector("#icon");
  let icon = response.data.weather["0"].icon;

  celsiusTemperature = response.data.main.temp;
  getForecast(response.data.coord);
  image.setAttribute("src", displayImage(icon));
}

// City

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

// -------current-location-button-----------

function retrievePosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

let buttonCurrent = document.querySelector("#current-location-button");
buttonCurrent.addEventListener("click", retrievePosition);

// -----Fahrenheit-------------

function displayFahrenheitTemperature(event) {
  event.preventDefault();

  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheiTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheiTemperature);
}

// -------Celsius-----------

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
