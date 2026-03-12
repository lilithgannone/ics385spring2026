let lat = "20.87"
let lon = "-156.45"

// Replace with your actual OpenWeather API key and latitude/longitude values
const apiKey = 'your_openweather_api_key_here';
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=20.87&lon=-156.45&appid=${apiKey}`;

// Some VS Studio autofill utlized. This is the function that retrieves data from OpenWeather and updates the dashboard with the retrieved information. 
fetch (apiUrl)
    .then(response => response.json())
    .then(data => {
        document.getElementById('description').textContent = data.weather[0].description;
        document.getElementById('temperature').textContent = data.main.temp;
        document.getElementById('humidity').textContent = data.main.humidity;
        document.getElementById('wind-speed').textContent = data.wind.speed;
        document.getElementById('cloudiness').textContent = data.clouds.all;
        document.getElementById('icon').textContent = data.weather[0].icon;
        document.getElementById('imgicon').src = `https://openweathermap.org/payload/api/media/file/${data.weather[0].icon}.png`
    })