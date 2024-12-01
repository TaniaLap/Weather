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
  let forecastHTML = `<div class="row row-cols-2 row-cols-lg-6 p-4 pt-0 m-0 g-1 g-md-3">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML += `
        <div class="col-2">
          <div class="card text-center h-100">
            <img src="${forecastDay.condition.icon_url}"
              alt=""
              class="mx-auto d-block mt-4"
              id="icon"/>
            <div class="card-body pt-1 p-1 p-sm-2">
              <h5 class="card-title card-temp m-0">
                <span class="weather-forecast-temperature-max">${Math.round(
                  forecastDay.temperature.maximum
                )}°</span>
                <span class="weather-forecast-temperature-min">${Math.round(
                  forecastDay.temperature.minimum
                )}°</span>
              </h5>
              <p class="card-text">${formatDay(forecastDay.time)}</p>
            </div>
          </div>
        </div>`;
    }
  });
  forecastHTML += `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
// This function get the coordinates
function getForecast(city) {
  let apiKey = "t4bao4f3de252349f939cbf3d30d0c04";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}
// This function get the API reponse and dispatches it on HTML
function showTemperature(response) {
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.temperature.current
  );
  document.querySelector("#current-city-name").innerHTML = response.data.city;
  document.querySelector("#temp-description").innerHTML =
    response.data.condition.description;
  document.querySelector("#humidity").innerHTML =
    response.data.temperature.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  // SheCodes API doesn't provide the min and max temperature for the current endpoint.
  // document.querySelector("#min").innerHTML = `${Math.round(
  //   response.data.main.temp_min
  // )}°C`;
  // document.querySelector("#max").innerHTML = `${Math.round(
  //   response.data.main.temp_max
  // )}°C`;
  let image = document.querySelector("#icon");
  let icon = response.data.condition.icon_url;
  celsiusTemperature = response.data.temperature.current;
  getForecast(response.data.city);
  image.setAttribute("src", icon);
}
// City
function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-text-input").value;
  citySearch(city);
}
function citySearch(city) {
  let apiKey = "t4bao4f3de252349f939cbf3d30d0c04";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}
// Location
function showPosition(position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  let apiKey = "t4bao4f3de252349f939cbf3d30d0c04";
  let url = `https://api.shecodes.io/weather/v1/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(url).then(showTemperature);
}
// -------current-location-button-----------
function retrievePosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}
let buttonCurrent = document.querySelector("#current-location-button");
buttonCurrent.addEventListener("click", retrievePosition);
let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);
citySearch("Dresden");