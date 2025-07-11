import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import './StattsCard.css';


function WeatherAdvancedStats({ data, language }) {
  if (!data.length) return null;

  // Moyenne humidité
  const avgHumidity = (
    data.reduce((sum, entry) => sum + (entry.humidity || 0), 0) / data.length
  ).toFixed(0);

  // Moyenne vent
  const avgWind = (
    data.reduce((sum, entry) => sum + (entry.wind || 0), 0) / data.length
  ).toFixed(1);

  // Indice UV 
  const uvIndex = 3 + Math.round(Math.random() * 7); 

  // Niveau UV pour le texte/couleur
  const uvLevel =
    uvIndex < 3 ? (language === "fr" ? "Faible" : "Low") :
    uvIndex < 6 ? (language === "fr" ? "Modéré" : "Moderate") :
    uvIndex < 8 ? (language === "fr" ? "Élevé" : "High") :
    uvIndex < 11 ? (language === "fr" ? "Très élevé" : "Very High") :
    (language === "fr" ? "Extrême" : "Extreme");

  return (
    <Row className="mb-4 " style={{ minHeight: 200 }}>
      <Col md={4}>
        <Card className="text-center">
        <Card className="text-center">
  <Card.Body>
    
    <Card.Title>{language === "fr" ? "Indice UV" : "UV Index"}</Card.Title>
    <OverlayTrigger
      trigger="click"
      placement="top"
      overlay={
        <Tooltip id="uv-tooltip" style={{ fontSize: "1.1rem" }}>
          {uvLevel}
        </Tooltip>
      }
      rootClose
    >
      <div
        style={{
          fontSize: 40,
          fontWeight: 700,
          color: "#fbbf24",
          cursor: "pointer",
          display: "inline-block"
        }}
        tabIndex={0}
        title={uvLevel}
      >
        <div style={{ fontSize: 28, marginBottom: 5 }}>🌞</div>
        {uvIndex}
      </div>
    </OverlayTrigger>
  </Card.Body>
</Card>

</Card>

      </Col>
      <Col md={4}>
        <Card className="text-center">
          <Card.Body>
            <Card.Title>{language === "fr" ? "Humidité moyenne" : "Average Humidity"}</Card.Title>
            <div style={{ fontSize: 28, marginBottom: 5 }}>💧</div>
            <div style={{ fontSize: 40, fontWeight: 700, color: "#60a5fa" }}>{avgHumidity}%</div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4}>
        <Card className="text-center">
          <Card.Body>
            <Card.Title>{language === "fr" ? "Vent moyen" : "Average Wind"}</Card.Title>
            <div style={{ fontSize: 28, marginBottom: 5 }}>🌬️</div>
            <div style={{ fontSize: 40, fontWeight: 700, color: "#94a3b8" }}>{avgWind} km/h</div>
          </Card.Body>
        </Card>
      </Col>
    </Row>

    
  );

  {dataToShow.length > 1 && (
  <Card className="text-center mb-4" style={{ maxWidth: 360, margin: "30px auto 0 auto", borderRadius: 18 }}>
    <Card.Body>
      <Card.Title style={{ fontSize: 20, fontWeight: 600 }}>
        {language === "fr" ? "Météo prévue demain" : "Tomorrow's Forecast"}
      </Card.Title>
      <div style={{ fontSize: 38, margin: "10px 0" }}>
        {dataToShow[1].weather === "Ensoleillé" ? "☀️"
          : dataToShow[1].weather === "Nuageux" ? "☁️"
          : dataToShow[1].weather === "Pluvieux" ? "🌧️"
          : ""}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#3866d2" }}>
        {dataToShow[1].temperature}°{unit === "celsius" ? "C" : "F"}
      </div>
      <div style={{ fontSize: 18 }}>
        {language === "fr"
          ? dataToShow[1].weather
          : (dataToShow[1].weather === "Ensoleillé"
              ? "Sunny"
              : dataToShow[1].weather === "Nuageux"
              ? "Cloudy"
              : dataToShow[1].weather === "Pluvieux"
              ? "Rainy"
              : dataToShow[1].weather)
        }
      </div>
    </Card.Body>
  </Card>
)}
}

export default WeatherAdvancedStats;
