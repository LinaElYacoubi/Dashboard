import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


function WeatherLineChart({ data, language, unit }) {

    
const convertTemp = (temp) =>
    unit === "celsius" ? temp : Math.round((temp * 9) / 5 + 32);

const chartData = data.map(entry => ({
    ...entry,
    temperature: convertTemp(entry.temperature)
  }));


  return (
    <div style={{ background: "#fff", borderRadius: 18, padding: 20, minHeight: 260, boxShadow: "0 2px 12px rgba(200,220,250,0.08)" }}>
      <h5 style={{ marginBottom: 16, color: "#213870", fontWeight: 600 }}>
        {language === "fr" ? "Température au fil du temps" : "Temperature Over Time"}
      </h5>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
  dataKey="date"
  tickFormatter={(value) => {
    
    if (typeof value === "string" && value.length >= 10) {
      const [year, month, day] = value.split("-");
      return language === "fr" ? `${day}/${month}` : `${month}/${day}`;
    }
    return value;
  }}
/>

          <YAxis unit={unit === "celsius" ? "°C" : "°F"} />
          <Tooltip
            formatter={(value) => [
              `${value}${unit === "celsius" ? "°C" : "°F"}`,
              language === "fr" ? "Température" : "Temperature"
            ]}
            labelFormatter={(label) => label}
          />
          <Line type="monotone" dataKey="temperature" stroke="#4899ff" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WeatherLineChart;
