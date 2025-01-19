const apiKey = 'e1932d118ed791d8204c6968f92e1389'; // Replace with your OpenWeather API key
const searchBtn = document.getElementById('searchbtn');
const locationBtn = document.getElementById('locationbtn');
const locationInput = document.getElementById('locationInput');

window.addEventListener('load', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherDataByCoords(latitude, longitude);
            fetchWeatherForecastByCoords(latitude, longitude);
            fetchAirQuality(latitude, longitude); 
            fetchHourlyForecast(latitude, longitude); 
        });
    }
});


searchBtn.addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (location) {
        fetchWeatherData(location);
        fetchWeatherForecast(location);
        
        
        fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    let lat = data[0].lat;
                    let lon = data[0].lon;
                    fetchAirQuality(lat, lon);
                    fetchHourlyForecast(lat, lon);
                }
            })
            .catch(error => console.error('Error fetching location:', error));
    }
});


locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherDataByCoords(latitude, longitude);
            fetchWeatherForecastByCoords(latitude, longitude);
            fetchAirQuality(latitude, longitude); 
            fetchHourlyForecast(latitude, longitude); 
    }
});


function fetchWeatherData(location) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => updateWeatherUI(data))
        .catch(error => console.error('Error fetching weather data:', error));
}

function fetchWeatherDataByCoords(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => updateWeatherUI(data))
        .catch(error => console.error('Error fetching weather data:', error));
}
function fetchWeatherForecast(location) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`)
      .then(response => response.json())
      .then(data => updateForecastUI(data))
      .catch(error => console.error('Error fetching forecast data:', error));
}


function fetchWeatherForecastByCoords(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
      .then(response => response.json())
      .then(data => updateForecastUI(data))
      .catch(error => console.error('Error fetching forecast data:', error));
}

function fetchAirQuality(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => updateAirQualityUI(data))
        .catch(error => console.error('Error fetching air quality data:', error));
}

function fetchHourlyForecast(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => updateHourlyForecastUI(data))
        .catch(error => console.error('Error fetching hourly forecast:', error));
}

function updateWeatherUI(data) {
  if (data.cod !== 200) {
      alert('Location not found');
      return;
  }

  const tempElement = document.querySelector('.current-weather h2');
  const descElement = document.querySelector('.current-weather p:nth-child(3)');
  const iconElement = document.querySelector('.weather-icon img');
  const dateElement = document.querySelector('.card-footer p:nth-child(1)').innerHTML=` ${new Date().toDateString()}`;
  const locationElement = document.querySelector('.card-footer p:nth-child(2)').innerHTML=`<i class="fa fa-map-marker"></i> ${data.name}`;
  const humidityElement = document.getElementById('humidityVal');
  const pressureElement = document.getElementById('pressureVal');
  const windspeedElement = document.getElementById('windspeedVal');
  const visibilityElement = document.getElementById('visibilityVal');

  if (tempElement) tempElement.textContent = `${data.main.temp}°C`;
  if (descElement) descElement.textContent = data.weather[0].description;
  if (iconElement) iconElement.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  if (dateElement) dateElement.textContent = new Date().toDateString();
  if (locationElement) locationElement.textContent = data.name;
  if (humidityElement) humidityElement.textContent = `${data.main.humidity}%`;
  if (pressureElement) pressureElement.textContent = `${data.main.pressure} hPa`;
  if (windspeedElement) windspeedElement.textContent = `${data.wind.speed} m/s`;
  if (visibilityElement) visibilityElement.textContent = `${data.visibility / 1000} km`;
  document.getElementById('weatherDescription').textContent = `${data.weather[0].main}`;
}
function updateForecastUI(data) {
    let uniqueForecastDays = [];
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    let fivedaysForecastElement = document.querySelector('.day-forecast');

 fivedaysForecast = data.list.filter(forecast => {
    let forecastDate = new Date(forecast.dt_txt).getDate();
    if(!uniqueForecastDays.includes(forecastDate)){
        return uniqueForecastDays.push(forecastDate);
    }
 });
  fivedaysForecastElement.innerHTML = ''; 
 for(let i = 1; i< fivedaysForecast.length; i++){
  let date= new Date(fivedaysForecast[i].dt_txt);
fivedaysForecastElement.innerHTML+=`
      <div class = "forecast-item">
        <div class = "icon-wrapper">
          
          <img src="http://openweathermap.org/img/wn/${fivedaysForecast[i].weather[0].icon}.png" alt="">
            <span>${fivedaysForecast[i].main.temp.toFixed(2)}&deg;C</span>

                  </div>
                <p>${date.getDate()} ${months[date.getMonth()]}</p>
                <p>${days[date.getDay()]}</p>
              </div>
      `;


}
}

function updateAirQualityUI(data) {
    const aqiCard = document.querySelector('.highlights .card');
    if (!aqiCard) {
        console.error("Error: AQI card element not found!");
        return;
    }

    let aqiList = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
    let {co, no, no2, o3, so2, pm2_5, pm10, nh3} = data.list[0].components;

    let aqi = data.list[0].main.aqi;
    let aqiText = (aqi >= 1 && aqi <= 5) ? aqiList[aqi - 1] : "Unknown";

    aqiCard.innerHTML = `
        <div class="card-head">
            <p>AIR QUALITY INDEX</p>
            <p class="air-index aqi-${aqi}">${aqiText}</p>
        </div>
        <div class="air-indices">
            <i class="fas fa-wind fa-3x"></i>
            <div class="item"><p>PM2.5</p><h2>${pm2_5}</h2></div>
            <div class="item"><p>PM10</p><h2>${pm10}</h2></div>
            <div class="item"><p>SO2</p><h2>${so2}</h2></div>
            <div class="item"><p>CO</p><h2>${co}</h2></div>
            <div class="item"><p>NO</p><h2>${no}</h2></div>
            <div class="item"><p>NO2</p><h2>${no2}</h2></div>
            <div class="item"><p>NH3</p><h2>${nh3}</h2></div>
            <div class="item"><p>O3</p><h2>${o3}</h2></div>
        </div>
    `;

}

function updateHourlyForecastUI(data) {
    const hourlyContainer = document.querySelector('.hourly-forecast');
    if (!hourlyContainer) {
        console.error("Error: Hourly forecast container not found!");
        return;
    }

    hourlyContainer.innerHTML = ''; 

    let hoursToShow = 8; 
    let forecastList = data.list.slice(0, hoursToShow);

    forecastList.forEach(forecast => {
        let time = new Date(forecast.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let temp = `${forecast.main.temp}°C`;
        let icon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

        hourlyContainer.innerHTML += `
            <div class="card">
                <p>${time}</p>
                <img src="${icon}" alt="Weather Icon">
                <p>${temp}</p>
            </div>
        `;
    });
}

