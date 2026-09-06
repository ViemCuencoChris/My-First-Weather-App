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
const forecastItems = document.querySelectorAll("card");

const apiKey = "93c5c8b9a777a8c90a81c273437ec191";

async function fetchWeatherData(display){    
    const response = await fetch(`https://api.openweathermap.org/data/2.5/${display}?q=${cityInput.value}&appid=${apiKey}&units=metric`);
    return response.json();
}

async function fetchCurrentWeatherData(display){
    const ipResponse = await fetch("https://ipapi.co/json/");
    const ip = await ipResponse.json();
    const response = await fetch(`https://api.openweathermap.org/data/2.5/${display}?lat=${ip.latitude}&lon=${ip.longitude}&appid=${apiKey}&units=metric`);
    return response.json();
}

async function WeatherData(){
    if(cityInput.value.trim() == ''){
        const weatherData = await fetchCurrentWeatherData("weather");
        const forecastData = await fetchCurrentWeatherData("forecast");
        UpdateWeather(weatherData);
        ForecastWeather(forecastData);
    } else {
        const weatherData = await fetchWeatherData("weather");
        const forecastData = await fetchWeatherData("forecast");
        UpdateWeather(weatherData);
        ForecastWeather(forecastData);
    }    
}

function UpdateWeather(weatherdata){
    if(weatherdata.cod != 200){
        cityInput.value = "City not found";
        cityInput.style.color = "rgb(255, 116, 108)";
        setTimeout(() => {
            cityInput.value = "";
            cityInput.style.color = "rgb(253, 240, 213)";
        }, 1000);

        return;
    }

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

    switch(weather){
        case "Clouds":
            weatherIcon.src = "assets/clouds.png"
            weatherStats.textContent = "Cloudy";
            body.style.backgroundImage = "url('assets/cloudy-bg.jpg')";
            break;
        case "Clear":
            weatherIcon.src = "assets/clear.png"
            weatherStats.textContent = "Sunny";
            body.style.backgroundImage = "url('assets/sunny-bg.jpg')";
            break;
        case "Rain":
            weatherIcon.src = "assets/rain.png"
            weatherStats.textContent = "Rainy";
            body.style.backgroundImage = "url('assets/rainy-bg.jpg')";
            break;
        case "Drizzle":
            weatherIcon.src = "assets/drizzle.png"
            weatherStats.textContent = "Drizzly";
            body.style.backgroundImage = "url('assets/drizzle-bg.jpg')";
            break;
        case "Mist":
            weatherIcon.src = "assets/mist.png"
            weatherStats.textContent = "Misty";
            body.style.backgroundImage = "url('assets/mist-bg.jpg')";
            break;
        case "Snow":
            weatherIcon.src = "assets/snow.png"
            weatherStats.textContent = "Snowy";
            body.style.backgroundImage = "url('assets/snow-bg.jpg')";
            break;
        default:
            weatherIcon.src = "assets/clouds.png"
            weatherStats.textContent = "Cloudy";
            body.style.backgroundImage = "url('assets/cloudy-bg.jpg')";
            break;
    }

    cityInput.value = "";
}

citySearchBtn.addEventListener('click', () => {
    WeatherData();
});

cityInput.addEventListener('keydown', (event) => {
    if(event.key == "Enter"){
        WeatherData();
    }
});

function ForecastWeather(weatherdata){
    
}

WeatherData();