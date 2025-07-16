import { useState, useEffect } from "react";

export default function useWeatherApi(city) {
  const [weatherData, setWeatherData] = useState([]);
  const apiKey = "608ef7fcd1820bf0038edc41df6d705b";

  useEffect(() => {
    async function fetchWeather() {
      // Supprime accents pour l'API
      const cityNormalized = city.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      console.log("Appel météo pour :", cityNormalized);

      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityNormalized}&units=metric&appid=${apiKey}&lang=fr`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data.list) {
        setWeatherData([]);
        return;
      }

      const dailyData = data.list
        .filter(item => item.dt_txt.includes("12:00:00"))
        .slice(0, 7)
        .map(item => ({
          date: item.dt_txt.split(" ")[0],
          temperature: Math.round(item.main.temp),
          humidity: item.main.humidity,
          wind: Math.round(item.wind.speed * 3.6),
          weather: item.weather[0].main === "Clear" ? "Ensoleillé"
            : item.weather[0].main === "Clouds" ? "Nuageux"
            : item.weather[0].main === "Rain" ? "Pluvieux"
            : item.weather[0].main
        }));
      setWeatherData(dailyData);
    }

    fetchWeather();
  }, [city]);

  return weatherData;
}
