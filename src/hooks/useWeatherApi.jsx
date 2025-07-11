import { useState, useEffect } from "react";

export default function useWeatherApi(city) {
  const [weatherData, setWeatherData] = useState([]);
  const apiKey = "608ef7fcd1820bf0038edc41df6d705b";

  useEffect(() => {
    async function fetchWeather() {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}&lang=fr`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data.list) {
        setWeatherData([]);
        return;
      }

      // On prend 7 jours (à midi), ajoute humidité et vent
      const dailyData = data.list
        .filter(item => item.dt_txt.includes("12:00:00"))
        .slice(0, 7)
        .map(item => ({
          date: item.dt_txt.split(" ")[0],
          temperature: Math.round(item.main.temp),
          humidity: item.main.humidity,                       // <--- HUMIDITÉ
          wind: Math.round(item.wind.speed * 3.6),            // <--- VENT (converti m/s → km/h)
          weather: item.weather[0].main === "Clear" ? "Ensoleillé"
            : item.weather[0].main === "Clouds" ? "Nuageux"
            : item.weather[0].main === "Rain" ? "Pluvieux"
            : item.weather[0].main // Autres cas
        }));
      setWeatherData(dailyData);
    }

    fetchWeather();
  }, [city]);

  return weatherData;
}
