import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import './App.css';

// components
import WeatherLineChart from './components/WeatherChart1';
import WeatherBarChart from './components/WeatherChart2';
import useWeatherApi from './hooks/useWeatherApi';
import WeatherStatsCards from './components/StattsCard';


function App() {
  const [language, setLanguage] = useState("en");
  const [city, setCity] = useState("Ottawa");
  const [period, setPeriod] = useState("5days");
  const [unit, setUnit] = useState("celsius");

  const dataFromApi = useWeatherApi(city);

  
  function filterByPeriod(entries) {
    if (!entries.length) return [];

    const uniqueDays = [];
    const perDay = [];
    for (let entry of entries) {
      if (!uniqueDays.includes(entry.date)) {
        uniqueDays.push(entry.date);
        perDay.push(entry);
      }
    }

    if (period === "1day") {
      const today = new Date().toISOString().slice(0, 10);
     
      return perDay.filter(e => e.date === today).length
        ? perDay.filter(e => e.date === today)
        : perDay.slice(0, 1);
    } else if (period === "3days") {
      return perDay.slice(0, 3);
    } else if (period === "5days") {
      return perDay.slice(0, 7);
    }
    return perDay;
  }

  const dataToShow = filterByPeriod(dataFromApi);

  if (dataFromApi.length === 0) {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
      <Spinner animation="border" variant="primary" />
      <span className="ms-3">Chargement des données météo...</span>
    </div>
  );
}

  return (
    <div className="container">
      <header className="top-bar">
        <div className="container-bar">
          <h1>
            {language === "en" ? "Weather Dashboard" : "Tableau de bord météo"}
          </h1>
          <ButtonGroup>
            <ToggleButton
              key="fr"
              id="lang-fr"
              type="radio"
              variant={language === "fr" ? "primary" : "outline-primary"}
              name="lang"
              value="fr"
              checked={language === "fr"}
              onChange={() => setLanguage("fr")}
              style={{ borderRadius: "24px 0 0 24px", fontWeight: 600, minWidth: 90 }}
            >
              Français
            </ToggleButton>
            <ToggleButton
              key="en"
              id="lang-en"
              type="radio"
              variant={language === "en" ? "primary" : "outline-primary"}
              name="lang"
              value="en"
              checked={language === "en"}
              onChange={() => setLanguage("en")}
              style={{ borderRadius: "0 24px 24px 0", fontWeight: 600, minWidth: 90 }}
            >
              English
            </ToggleButton>
          </ButtonGroup>
        </div>
      </header>

      <Row className="select-row mb-4">
        <Col md={2}>
          <select
            className="custom-select"
            value={city}
            onChange={e => setCity(e.target.value)}
          >
            <option value="Ottawa">Ottawa</option>
            <option value="Montréal">Montréal</option>
            <option value="Toronto">Toronto</option>
          </select>
        </Col>
        <Col md={2}>
          <select
            className="custom-select"
            value={period}
            onChange={e => setPeriod(e.target.value)}
          >
            <option value="1day">{language === "fr" ? "Aujourd'hui" : "Today"}</option>
            <option value="3days">{language === "fr" ? "3 prochains jours" : "Next 3 days"}</option>
            <option value="5days">{language === "fr" ? "5 prochains jours" : "Next 5 days"}</option>
          </select>
        </Col>
        <Col md={2}>
          <select
            className="custom-select"
            value={unit}
            onChange={e => setUnit(e.target.value)}
          >
            <option value="celsius">°C</option>
            <option value="fahrenheit">°F</option>
          </select>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={7}>
          <WeatherLineChart data={dataToShow} language={language} unit={unit} />
        </Col>
        <Col md={5}>
          <WeatherBarChart data={dataToShow} language={language} />
        </Col>
      </Row>

      <WeatherStatsCards data={dataToShow} language={language} unit={unit} />

      
    </div>
  );
}

export default App;
