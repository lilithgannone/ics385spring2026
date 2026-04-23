import React, { useState, useEffect } from "react";

function WeatherWidget({ city }) {
  const [weather, setWeather] = useState(null);
  const weatherKey = import.meta.env.VITE_WEATHER_KEY;

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=imperial&appid=${weatherKey}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch weather data.");
        }
        return response.json();
      })
      .then((data) => setWeather(data))
      .catch((error) => {
        console.error(error);
      });
  }, [city, weatherKey]);

  if (!weather) {
    return <p>Loading weather...</p>;
  }

  return (
    <article className="dashboard-info-card">
      <h3>Current Weather in {city}</h3>
      <p>{Math.round(weather.main.temp)}°F</p>
      <p>{weather.weather[0].description}</p>
      <p>Humidity: {weather.main.humidity}%</p>
      <p>Wind: {Math.round(weather.wind.speed)} mph</p>
    </article>
  );
}

export default WeatherWidget;
