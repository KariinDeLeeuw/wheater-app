let now = new Date();
let currentDay = document.getElementById("currentDay");
let unit = "metric";
let speedUnit = "km/h";
//searchCityInput variable stores the city in a variable so it can be used again.
var searchCityInput = "";
let localCity = true;

currentDay = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let today = currentDay[now.getDay()];
document.getElementById("currentDay").innerHTML = today;

if (now.getMinutes() >= 10) {
  let time = now.getHours() + ":" + now.getMinutes();
  document.getElementById("currentTime").innerHTML = time;
} else {
  let time = now.getHours() + ":0" + now.getMinutes();
  document.getElementById("currentTime").innerHTML = time;
}

/**
 * When the page is loaded.
 */

//Get current position when loading the page.
navigator.geolocation.getCurrentPosition(showPosition);
//Store API key in variable.
let apiKey = "b8b67f25aca36174d7cefe6d6e1ff8be";

//The function showTempCity receives a response from the API call.
function showTempCity(response) {
  //Store the cityname, temp, icon and weather description in seperate variables.
  let currentCity = response.data.name;
  currentTemp = response.data.main.temp;
  let icon = response.data.weather[0].icon;
  let description = response.data.weather[0].description;
  let humidity = response.data.main.humidity;
  let wind = response.data.wind.speed;

  //Call the function showCurrentData with the stored variables.
  showCurrentData(currentCity, currentTemp, icon, description, humidity, wind);
}

//Function showCurrentData receives parameters you got from the API calls and have stored in variables. And prints them on the HTML page.
function showCurrentData(city, temp, icon, description, humidity, wind) {
  let image = document.getElementById("icon");
  document.getElementById("description").innerHTML = description;
  document.getElementById("currentCity").innerHTML = `<h1>${city}</h1>`;
  document.getElementById("currentTemp").innerHTML = Math.round(temp);
  document.getElementById("humid").innerHTML = `${humidity}%`;
  document.getElementById("wind").innerHTML = `${Math.round(
    wind
  )} ${speedUnit}`;
  image.setAttribute("src", `http://openweathermap.org/img/wn/${icon}@2x.png`);
}

/**
 * When the search button is clicked
 */

//Get search button from HTML page and on click, start the function searchCity()
let search = document.getElementById("searchButton");
search.addEventListener("submit", searchCity);

function searchCity(event) {
  event.preventDefault();
  //Store the value of the inputfield in a variable and clear the inputfield.
  let input = document.getElementById("inputCity").value;
  document.getElementById("inputCity").value = "";
  //Store the value of the city in this global variable so it can be used again. Every time a new city is searched the value of this variable changes.
  searchCityInput = input;
  //This boolean is set to false whenever a city is searched. This acts as a check which is used other functions.
  localCity = false;

  //Create an URL with the requested city and API key.
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${apiKey}&units=${unit}`;
  let apiUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${input}&units=${unit}&appid=${apiKey}`;
  //Initialize an API call with the created URL and give the result to the callback function showSearchRes
  axios.get(apiUrl).then(showSearchRes);
  axios.get(apiUrlForecast).then(showForecast);
}

//Here you get the result of the API call so you can work with it.
function showSearchRes(response) {
  //Store the city name, temperature, icon and weather description you receive from the API call in seperate variables.
  let searchResCity = response.data.name;
  currentTemp = Math.round(response.data.main.temp);
  let searchIcon = response.data.weather[0].icon;
  let description = response.data.weather[0].description;
  let humidity = response.data.main.humidity;
  let wind = response.data.wind.speed;
  //Call the function showCurrentData and pass the variables as parameter.
  showCurrentData(
    searchResCity,
    currentTemp,
    searchIcon,
    description,
    humidity,
    wind
  );
}

/**
 * When the current city button is clicked
 */

//Get the button from the HTML page and give it an eventListener. Let the button call the function showCurrentCity.
let currentLocation = document.getElementById("location");
currentLocation.addEventListener("click", showCurrentCity);

//This function receives the current location by calling the navigator API just like it does when loading the page. After that, the API call, calls the function showPosition and gives the result as parameter.
function showCurrentCity() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

//This function gets the current position as parameters so you can work with that data.
function showPosition(position) {
  //Store the lat,long of the current position in two seperate variables.
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  localCity = true;
  //Create an URL for the API call with the current lat,long and API key
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`;
  //API url for forecast
  let apiUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`;
  //Initialize an API call with the created URL and give the data you received to the function showTempCity
  axios.get(apiUrl).then(showTempCity);
  //Create another api call which gives you the forecast result
  axios.get(apiUrlForecast).then(showForecast);
}

function showForecast(response) {
  console.log(response);
  console.log(now.getHours());
  let forecastResult = response.data.list;
  let today = now.getDay();
  let forecastOutput = "";

  if (now.getHours() >= 15) {
    today++;
  }

  for (var i = 0; i < forecastResult.length; i++) {
    if (forecastResult[i].dt_txt.includes("15:00:00")) {
      let forecastDay = currentDay[today];
      let forecastIcon = forecastResult[i].weather[0].icon;
      let forecastTemp = Math.round(forecastResult[i].main.temp);

      //Increment the result as a string with HTML elements to the forecastOutput variable.
      forecastOutput += `
      <div class="row align-items-start">
      <div class="col">
        <h5>${forecastDay}</h5>
       </div>
       <div class="col">
        <img src="http://openweathermap.org/img/wn/${forecastIcon}@2x.png">
       </div>
       <div class="col">
        <h5>${forecastTemp}°</h5>
       </div>
       </div>`;

      if (today == 6) {
        today = 0;
      } else {
        today++;
        console.log(today);
      }
    }
  }
  document.getElementById("weekweather").innerHTML = forecastOutput;
}

let currentTemp = null;

let fahrenheitLink = document.querySelector("#fahrenheitLink");
fahrenheitLink.addEventListener("click", showFahrenheitTemp);

let celciusLink = document.querySelector("#celciusLink");
celciusLink.addEventListener("click", showCelciusTemp);

// This function converts celcius to fahrenheit
function showFahrenheitTemp(event) {
  event.preventDefault();
  // let temperatureElement = document.querySelector("#currentTemp");
  // Remove the active class from the celcius link
  celciusLink.classList.remove("active");
  // Add active class to fahrenheit link
  fahrenheitLink.classList.add("active");

  unit = "imperial";
  speedUnit = "mph";
  if (localCity) {
    showCurrentCity();
  } else {
    refreshUnit();
  }
}

// This function goes back to celcius
function showCelciusTemp(event) {
  event.preventDefault();
  // let temperatureElement = document.querySelector("#currentTemp");
  // Add the active class from the celcius link
  celciusLink.classList.add("active");
  // Remove active class to fahrenheit link
  fahrenheitLink.classList.remove("active");
  // temperatureElement.innerHTML = Math.round(currentTemp);

  unit = "metric";
  speedUnit = "km/h";
  if (localCity) {
    showCurrentCity();
  } else {
    refreshUnit();
  }
}

function refreshUnit() {
  //Create an URL with the requested city and API key.
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchCityInput}&appid=${apiKey}&units=${unit}`;
  let apiUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${searchCityInput}&units=${unit}&appid=${apiKey}`;
  //Initialize an API call with the created URL and give the result to the callback function showSearchRes
  axios.get(apiUrl).then(showSearchRes);
  axios.get(apiUrlForecast).then(showForecast);
}
