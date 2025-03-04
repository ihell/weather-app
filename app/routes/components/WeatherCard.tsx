import { useEffect, useState } from "react";
import axios from "axios";

interface WeatherData {
  temperature: number;
  windspeed: number;
  winddirection: number;
}

export default function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const CITY = "Bogor";
  const LAT = -6.595; // Koordinat Bogor
  const LON = 106.816;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true`
        );
        setWeather(response.data.current_weather);
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
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <h1 className="text-2xl font-bold">Cuaca di {CITY}</h1>
      {weather ? (
        <>
          <p className="text-lg">🌡 Suhu: {weather.temperature}°C</p>
          <p className="text-lg">💨 Kecepatan Angin: {weather.windspeed} km/h</p>
          <p className="text-lg">🧭 Arah Angin: {weather.winddirection}°</p>
        </>
      ) : (
        <p>Memuat...</p>
      )}
    </div>
  );
}
