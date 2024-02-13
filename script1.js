// Javascript file for the first page (Homepage) of the web application

// my personal API key from OpenWeather to be used for fetching data
const API_KEY = '2ebf32c80bc7e3b72f11decfb5d7be7d';
let api1;

// use Luxon library, a modern wrapper for date and time in JavaScript
// recommended as better alternative by the classic Moment.js
const DateTime = luxon.DateTime;
const date_time = DateTime.now();


// get elements from the HTML file by id
const time = document.getElementById('time');
const date = document.getElementById('date');
const weekForecast = document.getElementById('week-forecast');
const sug = document.getElementById("suggestions");
const display_sugg = document.getElementsByClassName("suggestions")[0];
const display_more_data = document.getElementsByClassName("more_data")[0];

display_sugg.style.display = "none";

// check if service workers are supported by the web browser
  if (typeof navigator.serviceWorker !== 'undefined') {
    navigator.serviceWorker.register('sw.js');
  }

// day and months arrays to be used when identifying the current date
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// updated to Luxon, so I don't need the months array anymore
//const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// the instructions repeat every second so the time and date are dispalyed precisely
setInterval(() => {
    // example of transformation to object
    //let timee = DateTime.now().toObject(); //{"year":2022,"month":11,"day":5,"hour":23,"minute":38,"second":15,"millisecond":170}

    // get current time
    let hour = DateTime.now().hour;
    let minute = DateTime.now().minute;

    // if hour is a single digit, add '0' in front, so the format is standard
    if (DateTime.now().hour < 10) {
        hour = "0" + DateTime.now().hour;
    }
    // if minutes is a single digit, add '0' in front, so the format is standard
    if (DateTime.now().minute < 10) {
        minute = "0" + DateTime.now().minute;
    }

    // update time in HTML by id
    time.innerHTML = hour + ':' + minute;
    // date.innerHTML = days[day] + ', ' + day_nr + ' ' + months[month];
    // update day name + number of day and month
    date.innerHTML = days[DateTime.now().weekday - 1] + ', ' + DateTime.now().toFormat('dd MMMM');
}, 1000);

// documentation: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API
// the function returns a Geolocation object that allows web browsers to access current location

const options = {
    enableHighAccuracy: true,
    maximumAge: 0
  };

function getLocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(success, error, options);
    }
}

// if the user allows access to location, the latitude and longitude are retrieved and used in the weather API
function success(position) {
    const { latitude, longitude } = position.coords;
    console.log(latitude, longitude);
    // OR const latitude  = position.coords.latitude;
    // const longitude = position.coords.longitude;
    api1 = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`;
    fetchWeather();
}

// if the user declines access to location, an error message is displayed, weather data cannot be obtained
function error(error) {
    alert(error.message + "! You can click on the Search page to search weather info by city name!");
}

// the weather data is fetched using the updated link (from success) which includes the latitude and longitude of user's location
// data is the result of taking JSON as input and parsing it to produce a JavaScript object
// call showWeather() function, not display in console
function fetchWeather() {
    fetch(api1).then(response => response.json()).then(data => {
        console.log(showWeather(data))
    })
    .catch((error) => {
        alert(error('There has been a problem with your fetch operation:', error));
    })
}

getLocation();



// function that extracts the information we need from the API data, updates the HTML file and displays it on the webpage
// data is in the form of an object, JSON format because it is clearly displayed
function showWeather(data) {

    display_sugg.style.display = "block";
    display_more_data.style.display = "block";

    // for testing purpose, log data for tomorrow
    console.log(data.daily[1]);
    // extract the desired data for weather forcast of the current day
    const { temp, pressure, humidity, uvi, wind_speed } = data.current;
    const { icon, description } = data.current.weather[0];
    const { timezone } = data;
    // show in console for testing purpose
    console.log(temp, icon, description, pressure, humidity, uvi, wind_speed);
    // inject the weather data in the HTML, by making use of IDs (innerHTML)
    time_zone.innerHTML = timezone;
    //document.querySelector(".current-icon").src = "http://openweathermap.org/img/wn/"+icon+"@2x.png";
    current_icon.src = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
    current_temp.innerHTML = Math.round(temp) + '°C';
    item_current_description.innerHTML = description;
    current_wind.innerHTML = wind_speed + " km/h";
    current_humidity.innerHTML = humidity + "%";
    current_uvi.innerHTML = uvi;
    current_pressure.innerHTML = pressure;

    // data for weather forcast of upcoming days
    let week = ''
    data.daily.forEach((day, i) => {
        // not update the data for the current day; it is already displayed
        if (i == 0) {

        } else {
            // update forcast data for the upcoming 4 days
            // reference - https://github.com/asishgeorge/weather-website/blob/master/script.js
            if (i > 0 && i < 5) {
                week += `
            <div class="weather-forecast-day">
                <!-- use MomentJS library to display days names -->
                <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="weather-icon">
                <div class="temp">Day: ${Math.round(day.temp.day)}&#176;C</div>
                <div class="temp">Night: ${Math.round(day.temp.night)}&#176;C</div>
            </div>
            `
            }
        }
    })
    // update data in HTML
    weekForecast.innerHTML = week;


    // display recommendations for current day based on temperature
    if (Math.round(temp) <= 0) {
        today.innerHTML = "☼ Today is freezing! Stay inside near a fireplace and enjoy some hot chocolate!";
    }
    else if (Math.round(temp) > 0 && Math.round(temp) <= 10) {
        today.innerHTML = "☼ Today is cold! Dress up warmly! Coats and sweaters are a must!";
    }
    else if (Math.round(temp) > 10 && Math.round(temp) <= 20) {
        today.innerHTML = "☼ Today is cool! Be careful not to catch a cold!";
    }
    else if (Math.round(temp) > 20 && Math.round(temp) <= 25) {
        today.innerHTML = "☼ Today is the perfect summer day! Enjoy time outside and maybe catch some sun!";
    }
    else if (Math.round(temp) > 26) {
        today.innerHTML = "☼ Today is hot! Drink lots of wather and the AC might be your best friend!";
    }

    // use an array with the 4 days displayed in the forecast, as there should be max one suggestion displayed per each day
    // the days in suggestions should not repeat
    let days_ok = [data.daily[1], data.daily[2], data.daily[3], data.daily[4]];
    days_ok[0] = 0;
    days_ok[1] = 0;
    days_ok[2] = 0;
    days_ok[3] = 0;

    // the first day that satisfies the conditions for a recommendation is displayed
    // use "let" because the values need to be updated
    let ok1 = 0;
    let ok2 = 0;
    let ok3 = 0;
    let ok4 = 0;
    let ok5 = 0;
    let ok6 = 0;
    let ok7 = 0;
    let ok8 = 0;

    // for all 4 days, check which conditions they satisfy and update the HTML to display the specific recommendation
    // each type of recommendation appears just once (ok gets updated)
    // the days appear in recommendations max one time (the appearance array days_ok gets updated when the recommendation for the specific day is displayed)
    for (k = 1; k <= 4; k++) {
        if (Math.round(data.daily[k].temp.night) < 0 && ok1 == 0 && days_ok[k - 1] == 0) {
            var other_day1 = document.createElement('div');
            other_day1.innerHTML = "☼ Wake up early on " + days[DateTime.now().plus({ days: k }).weekday - 1] + " to defrost your windshield! Or you are lucky if you don't have a car! :)";
            days_ok[k - 1] = 1;
            other_day1.className = "suggestions_items";
            ok1 = 1;
            sug.appendChild(other_day1);
        }
        if (data.daily[k].uvi >= 3 && ok2 == 0 && days_ok[k - 1] == 0) {
            var other_day2 = document.createElement('div');
            other_day2.innerHTML = "☼ Make sure to put sun protection on! The UV levels are high!";
            other_day2.className = "suggestions_items";
            days_ok[k - 1] = 1;
            ok2 = 1;
            sug.appendChild(other_day2);
        }
        // the first digit of ID tells what kind of weather to expect
        if (String(data.daily[k].weather[0].id)[0] == '8' && String(data.daily[k].weather[0].id)[2] != '0' && ok3 == 0 && days_ok[k - 1] == 0) {
            var other_day3 = document.createElement('div');
            other_day3.innerHTML = "☼ It is cloudy on " + days[DateTime.now().plus({ days: k }).weekday - 1] + "! Your mood and energy might be low!";
            other_day3.className = "suggestions_items";
            ok3 = 1;
            days_ok[k - 1] = 1;
            sug.appendChild(other_day3);
        }
        if (String(data.daily[k].weather[0].id)[0] == '6' && ok4 == 0 && days_ok[k - 1] == 0) {
            var other_day4 = document.createElement('div');
            other_day4.innerHTML = "☼ Snow day on " + days[DateTime.now().plus({ days: k }).weekday - 1] +
                "! How does building a snowman and drinking hot chocolate sound like?";
            other_day4.className = "suggestions_items";
            ok4 = 1;
            days_ok[k - 1] = 1;
            sug.appendChild(other_day4);
        }
        if (String(data.daily[k].weather[0].id)[0] == '5' && ok5 == 0 && days_ok[k - 1] == 0) {
            var other_day5 = document.createElement('div');
            other_day5.innerHTML = "☼ Rain on " + days[DateTime.now().plus({ days: k }).weekday - 1] + "! Don't forget to take your umbrella with you! Also, you might feel sleepy, so get lots of rest!";
            other_day5.className = "suggestions_items";
            ok5 = 1;
            days_ok[k - 1] = 1;
            sug.appendChild(other_day5);
        }
        if (String(data.daily[k].weather[0].id)[0] == '3' && ok6 == 0 && days_ok[k - 1] == 0) {
            var other_day6 = document.createElement('div');
            other_day6.innerHTML = "☼ Crazy hair day on " + days[DateTime.now().plus({ days: k }).weekday - 1] + "! It will be drizzling. Maybe an umbrella would be a good idea!";
            other_day6.className = "suggestions_items";
            ok6 = 1;
            days_ok[k - 1] = 1;
            sug.appendChild(other_day6);
        }
        if (String(data.daily[k].weather[0].id)[0] == '2' && ok7 == 0 && days_ok[k - 1] == 0) {
            var other_day7 = document.createElement('div');
            other_day7.innerHTML = `☼ Stay inside on ${days[DateTime.now().plus({ days: k }).weekday - 1]}! Thunderstorm incoming! Close all windows before leaving home!`;
            other_day7.className = "suggestions_items";
            ok7 = 1;
            days_ok[k - 1] = 1;
            sug.appendChild(other_day7);
        }
        if (String(data.daily[k].weather[0].id)[0] == '5' && ok8 == 0 && days_ok[k - 1] == 0) {
            var other_day8 = document.createElement('div');
            other_day8.innerHTML = "☼ Enjoy a  good book and the sound of rain on " + days[DateTime.now().plus({ days: k }).weekday - 1] + "!";
            other_day8.className = "suggestions_items";
            ok8 = 1;
            days_ok[k - 1] = 1;
            sug.appendChild(other_day8);
        }
    }
}