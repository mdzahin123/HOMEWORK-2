// =============================================================================
// MapQuest Geocoding API key required.
//
// Get a free key at:
//   https://developer.mapquest.com/
//
// 1. Create a free account
// 2. Create a new application in the dashboard
// 3. Copy the "Consumer Key"
// 4. Paste it below, replacing YOUR_MAPQUEST_KEY_HERE
//
// Note: weather.gov does NOT require a key.
// =============================================================================
const MAPQUEST_API_KEY = 'YOUR_MAPQUEST_KEY_HERE';

async function getLatLong(zipcode) {
  const url = `https://www.mapquestapi.com/geocoding/v1/address?key=${MAPQUEST_API_KEY}&location=${zipcode}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const location = data.results[0].locations[0].latLng;
    const city = data.results[0].locations[0].adminArea5;
    const state = data.results[0].locations[0].adminArea3;
    return { lat: location.lat, lng: location.lng, city, state };
  } catch (error) {
    console.error('Error fetching latitude and longitude:', error);
    return null;
  }
}

async function getWeatherData(lat, long) {
  const pointsUrl = `https://api.weather.gov/points/${lat},${long}`;
  try {
    const pointsResponse = await fetch(pointsUrl);
    const pointsData = await pointsResponse.json();
    const forecastUrl = pointsData.properties.forecast;
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();
    return forecastData.properties.periods;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

function displayWeather(forecast, location) {
  const container = document.getElementById('weather-container');
  container.innerHTML = '';

  if (!forecast || forecast.length === 0) {
    container.innerHTML = '<p>No forecast data available.</p>';
    return;
  }

  const locationInfo = document.createElement('div');
  locationInfo.className = 'location-info';
  locationInfo.innerHTML = `<h2>Weather for ${location.city}, ${location.state}</h2>`;
  container.appendChild(locationInfo);

  const currentWeather = forecast[0];
  const currentWeatherDiv = document.createElement('div');
  currentWeatherDiv.className = 'current-weather';
  currentWeatherDiv.innerHTML = `
    <h3>${currentWeather.name}</h3>
    <p><strong>Temperature:</strong> ${currentWeather.temperature}°${currentWeather.temperatureUnit}</p>
    <p><strong>Forecast:</strong> ${currentWeather.shortForecast}</p>
    <p><strong>Wind:</strong> ${currentWeather.windSpeed} ${currentWeather.windDirection}</p>
    <p><strong>Details:</strong> ${currentWeather.detailedForecast}</p>
  `;
  container.appendChild(currentWeatherDiv);

  const forecastContainer = document.createElement('div');
  forecastContainer.className = 'forecast-container';
  forecast.forEach((period, index) => {
    if (index > 0) {
      const item = document.createElement('div');
      item.className = 'forecast-item';
      item.innerHTML = `
        <h3>${period.name}</h3>
        <p><strong>Temperature:</strong> ${period.temperature}°${period.temperatureUnit}</p>
        <p><strong>Forecast:</strong> ${period.shortForecast}</p>
        <p><strong>Wind:</strong> ${period.windSpeed} ${period.windDirection}</p>
        <p><strong>Details:</strong> ${period.detailedForecast}</p>
      `;
      forecastContainer.appendChild(item);
    }
  });
  container.appendChild(forecastContainer);
}

async function getWeather() {
  const zipcode = document.getElementById('zipcode').value;
  if (!zipcode) {
    alert('Please enter a valid zip code.');
    return;
  }

  const location = await getLatLong(zipcode);
  if (!location) {
    alert('Unable to find location for the provided zip code.');
    return;
  }

  const forecast = await getWeatherData(location.lat, location.lng);
  if (!forecast) {
    alert('Unable to fetch weather data.');
    return;
  }

  displayWeather(forecast, location);
}
