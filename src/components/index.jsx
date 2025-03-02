import { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = "YOUR_API_KEY"; // Ganti dengan API Key dari OpenWeatherMap
const CITY = "Bogor";

export default function WeatherCard() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&appid=${API_KEY}`
        );
        setWeather(response.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <h1 className="text-2xl font-bold">Cuaca di Bogor</h1>
      {weather ? (
        <>
          <p className="text-lg">{weather.weather[0].description}</p>
          <p className="text-xl font-semibold">{weather.main.temp}°C</p>
          <p className="text-sm">Kelembapan: {weather.main.humidity}%</p>
        </>
      ) : (
        <p>Memuat...</p>
      )}
    </div>
  );
}
