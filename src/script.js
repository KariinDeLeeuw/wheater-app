let now = new Date();
let currentDay = document.getElementById("currentDay");

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
  let currentTemp = response.data.main.temp;
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
  document.getElementById("currentTemp").innerHTML = Math.round(temp) + "°C";
  document.getElementById("humid").innerHTML = `${humidity}%`;
  document.getElementById("wind").innerHTML = `${Math.round(wind)} km/h`;
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

  //Create an URL with the requested city and API key.
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${apiKey}&units=metric`;
  let apiUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${input}&units=metric&appid=${apiKey}`;
  //Initialize an API call with the created URL and give the result to the callback function showSearchRes
  axios.get(apiUrl).then(showSearchRes);
  axios.get(apiUrlForecast).then(showForecast);
}

//Here you get the result of the API call so you can work with it.
function showSearchRes(response) {
  //Store the city name, temperature, icon and weather description you receive from the API call in seperate variables.
  let searchResCity = response.data.name;
  let searchResTemp = Math.round(response.data.main.temp);
  let searchIcon = response.data.weather[0].icon;
  let description = response.data.weather[0].description;
  let humidity = response.data.main.humidity;
  let wind = response.data.wind.speed;
  //Call the function showCurrentData and pass the variables as parameter.
  showCurrentData(
    searchResCity,
    searchResTemp,
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
  //Create an URL for the API call with the current lat,long and API key
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  //API url for forecast
  let apiUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
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
  for (var i = 0; i < forecastResult.length; i++) {
    if (forecastResult[i].dt_txt.includes("15:00:00")) {
      if (now.getHours() > 15 && today < 6) {
        today++;
      } else if (now.getHours() > 15 && today > 6) {
        today = 0;
      }
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
      }
    }
  }
  document.getElementById("weekweather").innerHTML = forecastOutput;
}

// let isCelsius = true;
// let farenheitLink = document.getElementById("fahrenheit-link");
// farenheitLink.addEventListener("click", changeToFarenheit);

// function changeToFarenheit(event) {
//   event.preventDefault();
//   if (isCelsius == true) {
//     document.getElementById("currentTemp").innerHTML = 77;
//     isCelsius = false;
//   }
// }

// function changeToCelsius(event) {
//   event.preventDefault();
//   if (isCelsius == false) {
//     document.getElementById("currentTemp").innerHTML = 25;
//     isCelsius = true;
//   }
// }
