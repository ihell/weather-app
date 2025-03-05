import { useEffect, useState } from "react";
import axios from "axios";

interface WeatherData {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
}

interface ForecastData {
  time: string;
  temperature: number;
  weathercode: number;
}

export default function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const CITY = "Bogor";
  const LAT = -6.595; // Koordinat Bogor
  const LON = 106.816;

  const getWeatherDescription = (code: number) => {
    switch (code) {
      case 0:
        return "Cerah";
      case 1:
      case 2:
      case 3:
        return "Berawan";
      case 45:
      case 48:
        return "Berkabut";
      case 51:
      case 53:
      case 55:
        return "Gerimis";
      case 61:
      case 63:
      case 65:
        return "Hujan";
      case 71:
      case 73:
      case 75:
        return "Salju";
      case 95:
        return "Badai Petir";
      default:
        return "Tidak diketahui";
    }
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true&hourly=temperature_2m,weathercode`
        );
        setWeather(response.data.current_weather);
        const forecastData = response.data.hourly.time.map((time: string, index: number) => ({
          time,
          temperature: response.data.hourly.temperature_2m[index],
          weathercode: response.data.hourly.weathercode[index],
        }));
        setForecast(forecastData.slice(0, 5)); // Ambil 5 jam ke depan
      } catch (error) {
        console.error("Gagal mengambil data cuaca:", error);
      }
    };

    // Ambil data pertama kali
    fetchWeather();

    // Ambil data setiap 10 detik
    const interval = setInterval(fetchWeather, 10000);

    // Bersihkan interval saat komponen di-unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-blue-300 p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-2xl lg:max-w-4xl">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">Cuaca di {CITY}</h1>
        {weather ? (
          <>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="text-lg">🌡 Suhu: {weather.temperature}°C</p>
              <p className="text-lg">💨 Kecepatan Angin: {weather.windspeed} km/h</p>
              <p className="text-lg">🧭 Arah Angin: {weather.winddirection}°</p>
              <p className="text-lg">🌤 Kondisi: {getWeatherDescription(weather.weathercode)}</p>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Prediksi Cuaca</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {forecast.map((f, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg shadow">
                  <p className="text-lg">{new Date(f.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="text-lg">🌡 {f.temperature}°C</p>
                  <p className="text-lg">{getWeatherDescription(f.weathercode)}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-white">Memuat...</p>
        )}
      </div>
    </div>
  );
}
