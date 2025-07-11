import { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useEffect } from "react";
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
  const [darkMode, setDarkMode] = useState(false);

  const dataFromApi = useWeatherApi(city);
  const dashboardRef = useRef();

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

  // Fonction export PDF
  async function handleExportPDF() {
    if (!dashboardRef.current) return;
    const element = dashboardRef.current;
    element.style.overflowX = "visible";
    const canvas = await html2canvas(element, { scale: 1.5 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height]
    });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save("weather-dashboard.pdf");
    element.style.overflowX = "";
  }

  useEffect(() => {
  if (darkMode) {
    document.body.classList.add('dark-mode');
    document.documentElement.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
    document.documentElement.classList.remove('dark-mode');
  }
}, [darkMode]);

  // Notification intelligente meteo
 function getSmartMessage() {
  if (!dataToShow.length) return null;
  const nextWeather = (dataToShow[0]?.weather || "").toLowerCase();

  //rainy
  if (["pluvieux", "rain", "pluie"].includes(nextWeather)) {
    return language === "fr"
      ? "💧 Il va pleuvoir, pensez à prendre un parapluie !"
      : "💧 Rain expected! Don't forget your umbrella!";
  }
  //sunny
  if (["ensoleillé", "clear", "sunny"].includes(nextWeather)) {
    return language === "fr"
      ? "☀️ Profitez du beau temps pour sortir !"
      : "☀️ Great weather ahead—enjoy the outdoors!";
  }
  // cloudy
  if (["nuageux", "clouds", "cloudy"].includes(nextWeather)) {
    return language === "fr"
      ? "☁️ Temps nuageux, pensez à prendre un gilet."
      : "☁️ Cloudy skies, maybe grab a sweater!";
  }
  return null;
}


  if (dataFromApi.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Chargement des données météo...</span>
      </div>
    );
  }

  return (
    <div className={`container${darkMode ? " dark-mode" : ""}`} ref={dashboardRef}>
      <header className="top-bar">
        <div className="container-bar">
          <h1>
            {language === "en" ? "Weather Dashboard" : "Tableau de bord météo"}
          </h1>
          <div style={{display: "flex", alignItems: "center", gap: 22}}>
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
            <div className="form-check form-switch ms-3" style={{marginLeft:24}}>
              <input
                className="form-check-input"
                type="checkbox"
                id="darkModeSwitch"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                style={{ cursor: "pointer", accentColor: "#ffd600" }}
              />
              <label className="form-check-label" htmlFor="darkModeSwitch" style={{ cursor:"pointer",fontWeight:500, marginLeft:8 }}>
                {darkMode ? "🌙" : "☀️"}
              </label>
            </div>
          </div>
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
            <option value="1day">{language === "fr" ? "Demain" : "Tomorrow"}</option>
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
        <Col md={3}></Col>
        <Col md={2}>
          <button className="btn-yellow" style={{ width: 170 }} onClick={handleExportPDF}>
            <span role="img" aria-label="export">📄</span> {language === "fr" ? "Exporter PDF" : "Export PDF"}
          </button>
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

      <Row>
        <WeatherStatsCards data={dataToShow} language={language} unit={unit} />
      </Row>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "-6px" }}>
  {getSmartMessage() && (
    <div
      className="alert alert-info text-center"
      style={{
        background: "#ffd600ee",
        color: "#213870",
        fontWeight: 600,
        fontSize: "1.18rem",
        margin: "4px auto 18px auto",
        borderRadius: 15,
        maxWidth: 400,          
        minWidth: 350,
        width: "100%",
        boxShadow: "0 4px 18px #ffd60055",
        padding: "19px 20px",
        letterSpacing: ".2px",
        lineHeight: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {getSmartMessage()}
    </div>
  )}
</div>


    </div>
  );
}

export default App;
