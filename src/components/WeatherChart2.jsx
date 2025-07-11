import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function WeatherBarChart({ data, language }) {

  const countTypes = data.reduce((acc, entry) => {
    acc[entry.weather] = (acc[entry.weather] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(countTypes).map(key => ({
    weather: key,
    count: countTypes[key]
  }));

  ""
  const labels = {
    "Ensoleillé": language === "fr" ? "Ensoleillé" : "Sunny",
    "Nuageux": language === "fr" ? "Nuageux" : "Cloudy",
    "Pluvieux": language === "fr" ? "Pluvieux" : "Rainy"
  };

  return (
    <div style={{ background: "#fff", borderRadius: 18, padding: 20, minHeight: 260, boxShadow: "0 2px 12px rgba(200,220,250,0.08)" }}>
      <h5 style={{ marginBottom: 16, color: "#213870", fontWeight: 600 }}>
        {language === "fr" ? "Répartition des types de météo" : "Weather Types Breakdown"}
      </h5>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="weather"
            tickFormatter={key => labels[key] || key}
          />
          <YAxis allowDecimals={false} />
          <Tooltip
            formatter={(value, name, props) => [`${value}`, language === "fr" ? "Jours" : "Days"]}
            labelFormatter={key => labels[key] || key}
          />
          <Bar dataKey="count" fill="#67b5fc" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WeatherBarChart;
