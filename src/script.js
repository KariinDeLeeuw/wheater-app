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
  //Store the cityname and temp in two seperate variables.
  currentCity = response.data.name;
  currentTemp = response.data.main.temp;
  //Call the function showCurrentData with the stored variables.
  showCurrentData(currentCity, currentTemp);
}

//Function showCurrentData receives two parameters you got from the API calls and have stored in variables. And prints them on the HTML page.
function showCurrentData(city, temp) {
  document.getElementById("currentCity").innerHTML = `<h1>${city}</h1>`;
  document.getElementById("currentTemp").innerHTML = Math.round(temp) + "°C";
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
  //Initialize an API call with the created URL and give the result to the callback function showSearchRes
  axios.get(apiUrl).then(showSearchRes);
}

//Here you get the result of the API call so you can work with it.
function showSearchRes(response) {
  //Store the city name and temperature you receive from the API call in two seperate variables.
  let searchResCity = response.data.name;
  let searchResTemp = Math.round(response.data.main.temp);
  //Call the function showCurrentData and pass the two variables as parameter.
  showCurrentData(searchResCity, searchResTemp);
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
  //Initialize an API call with the created URL and give the data you received to the function showTempCity
  axios.get(apiUrl).then(showTempCity);
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
