// Javascript file for the second page (Search) of the web application

// my personal API key from OpenWeather to be used for fetching data
const API_KEY = '2ebf32c80bc7e3b72f11decfb5d7be7d';
//let api2;

let display_data = document.getElementsByClassName("display_data")[0];

//api2 = "https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid="+ API_KEY;

// check if service workers are supported by the web browser
if (typeof navigator.serviceWorker !== 'undefined') {
    navigator.serviceWorker.register('sw.js');
  }

// function that fetches data about weather using the OpenWeather API, by city name
// data is a JSON format, as an object
function fetchWeather2(city) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + 
    "&units=metric&appid=" + API_KEY).then(response => response.json()).then(data => {
        console.log(showWeather(data))})
        .catch((error) => {
            alert(error('There has been a problem with your fetch operation:', error));
    })
}

//fetchWeather2();

// function that extracts the information we need from the API data, injects into the HTML and displays it on the webpage
function showWeather(data) {
    const { name } = data;
    const { country } = data.sys;
    const { temp, pressure, humidity } = data.main;
    const { icon, description } = data.weather[0];
    const { speed } = data.wind;
    // for testing purpose, the selected data is displayed in the console
    console.log(name, temp, icon, description, pressure, humidity, speed);
    // vulnerability: if two cities have the same name, only one will be displayed
    city_name.innerHTML = name + ", " + country;
    current_icon.src = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
    item_temp.innerHTML = Math.round(temp) + "°C";
    item_current_description.innerHTML = description;
    current_wind.innerHTML = speed + " km/h";
    current_humidity.innerHTML = humidity + "%";
    current_pressure.innerHTML = pressure;
}

// function that fetched info from the weather API based on user's input in the search bar
function search() {
    fetchWeather2(document.querySelector(".search-bar").value);
}

// when clicking the search button
document.querySelector(".search button").addEventListener("click", function () {
    search();
    //display_data.classList.add("display");
    display_data.style.display = "block";

});

// when pressing Enter key
document.querySelector(".search-bar").addEventListener("keyup", function (enter) {
    if (enter.key == "Enter") {
        search();
        display_data.style.display = "block";
    }
});