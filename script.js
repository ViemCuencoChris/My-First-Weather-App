const body = document.querySelector("body");

//Locate city
const cityInput = document.getElementById("search-field");
const citySearchBtn = document.getElementById("location-btn");

//Main City Weather Update
const weatherIcon = document.getElementById("weather-icon");
const weatherDeg = document.getElementById("degrees");
const weatherStats = document.getElementById("status");
const weatherCity = document.getElementById("city");
const weatherHumidity = document.getElementById("humidity");
const weatherWind = document.getElementById("wind");

//Forecast Weather of the City
const forecastItems = document.querySelector(".forecast-cards");

const apiKey = "93c5c8b9a777a8c90a81c273437ec191";

async function getWeatherByCity(display){    
    const response = await fetch(`https://api.openweathermap.org/data/2.5/${display}?q=${cityInput.value}&appid=${apiKey}&units=metric`);
    return response.json();
}

async function getWeatherByCoordinates(display){
    const ipResponse = await fetch("https://ipapi.co/json/");
    const ip = await ipResponse.json();
    const response = await fetch(`https://api.openweathermap.org/data/2.5/${display}?lat=${ip.latitude}&lon=${ip.longitude}&appid=${apiKey}&units=metric`);
    return response.json();
}

async function WeatherData(){
    if(cityInput.value.trim() == ''){
        const weatherData = await getWeatherByCoordinates("weather");
        const forecastData = await getWeatherByCoordinates("forecast");
        UpdateWeather(weatherData, forecastData);
    } else {
        const weatherData = await getWeatherByCity("weather");
        const forecastData = await getWeatherByCity("forecast");
        UpdateWeather(weatherData, forecastData);
    }    
}

function getWeatherIcon(weather){
    switch(weather){
        case "Clouds":
            return "assets/clouds.png";
        case "Clear":
            return "assets/clear.png";
        case "Rain":
            return "assets/rain.png";
        case "Drizzle":
            return "assets/drizzle.png";
        case "Mist":
            return "assets/mist.png";
        case "Snow":
            return "assets/snow.png";
        default:
            return "assets/clouds.png";
    }
}

function UpdateWeather(weatherdata, forecastdata){
    if(weatherdata.cod != 200 || forecastdata.cod != 200){
        cityInput.value = "City not found";
        cityInput.style.color = "rgb(255, 116, 108)";
        setTimeout(() => {
            cityInput.value = "";
            cityInput.style.color = "rgb(253, 240, 213)";
        }, 1000);

        return;
    }

    mainWeather(weatherdata);
    forecastWeather(forecastdata);
}

function mainWeather(weatherdata){
    const weather = weatherdata.weather[0].main;
    const temp = weatherdata.main.temp; 
    const city = weatherdata.name;
    const humidity = weatherdata.main.humidity;
    const wind = weatherdata.wind.speed;

    const locationIcon = '<i class="fa-solid fa-location-dot"></i>';
    const windIcon = '<i class="fa-solid fa-wind"></i>';
    const humidityIcon = '<i class="fa-solid fa-droplet"></i>';

    weatherDeg.textContent = `${Math.round(temp)}° C`;
    weatherCity.innerHTML = `${locationIcon} ${city}`;
    weatherHumidity.innerHTML = `${humidityIcon}: ${humidity}`
    weatherWind.innerHTML = `${windIcon}: ${wind}`
    weatherIcon.src = getWeatherIcon(weather);

    switch(weather){
        case "Clouds":
            weatherStats.textContent = "Cloudy";
            body.style.backgroundImage = "url('assets/cloudy-bg.jpg')";
            break;
        case "Clear":
            weatherStats.textContent = "Sunny";
            body.style.backgroundImage = "url('assets/sunny-bg.jpg')";
            break;
        case "Rain":
            weatherStats.textContent = "Rainy";
            body.style.backgroundImage = "url('assets/rainy-bg.jpg')";
            break;
        case "Drizzle":
            weatherStats.textContent = "Drizzly";
            body.style.backgroundImage = "url('assets/drizzle-bg.jpg')";
            break;
        case "Mist":
            weatherStats.textContent = "Misty";
            body.style.backgroundImage = "url('assets/mist-bg.jpg')";
            break;
        case "Snow":
            weatherStats.textContent = "Snowy";
            body.style.backgroundImage = "url('assets/snow-bg.jpg')";
            break;
        default:
            weatherStats.textContent = "Cloudy";
            body.style.backgroundImage = "url('assets/cloudy-bg.jpg')";
            break;
    }
}

function forecastWeather(forecastdata){
    forecastdata.list.forEach((data) => {
        const cards = document.createElement('div');
        cards.classList.add("card");
        forecastItems.appendChild(cards);

        const time = document.createElement('h5');
        const image = document.createElement('img');
        const degrees = document.createElement('p');
        cards.append(time, image, degrees);

        const date = data.dt_txt.split(" ")[1];
        const milHour = Number(date.split(":")[0]);
        const stanHour = (milHour % 12 != 0) ? milHour % 12 : 12;

        time.textContent = `${stanHour} ${(milHour >= 12) ? "PM" : "AM"}`
        image.src = getWeatherIcon(data.weather[0].main);
        degrees.textContent = `${Math.round(data.main.temp)}° C`;
    });
}

citySearchBtn.addEventListener('click', () => {
    WeatherData();
});

cityInput.addEventListener('keydown', (event) => {
    if(event.key == "Enter"){
        WeatherData();
    }
});

WeatherData();