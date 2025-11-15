// YOUR API KEY
const API_KEY = "90d2d94aa1578143db08726ca96d223d";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const recentBtn = document.getElementById("recentBtn");
const recentDropdown = document.getElementById("recentDropdown");
const recentList = document.getElementById("recentList");

const errorBox = document.getElementById("errorBox");
const currentWeather = document.getElementById("currentWeather");

const locationName = document.getElementById("locationName");
const weatherDesc = document.getElementById("weatherDesc");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const weatherIcon = document.getElementById("weatherIcon");
const alertBox = document.getElementById("alertBox");
const forecast = document.getElementById("forecast");
const forecastTitle = document.getElementById("forecastTitle");
const toggleUnit = document.getElementById("toggleUnit");

let isCelsius = true;

// -------------------------------
// WEATHER FETCH FUNCTION
// -------------------------------
async function fetchWeather(city) {
  try {
    errorBox.classList.add("hidden");

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) throw new Error("City not found");

    const data = await response.json();

    updateUI(data);
    saveRecentCity(city);
    fetchForecast(city);

  } catch (err) {
    errorBox.classList.remove("hidden");
    errorBox.textContent = err.message;
  }
}

// -------------------------------
// UPDATE CURRENT WEATHER UI
// -------------------------------
function updateUI(data) {
  currentWeather.classList.remove("hidden");

  locationName.textContent = data.name;
  weatherDesc.textContent = data.weather[0].description;

  temperature.textContent = `${data.main.temp.toFixed(1)}°C`;
  humidity.textContent = data.main.humidity;
  wind.textContent = data.wind.speed;

  // ICONIFY ICONS
  const iconMap = {
    Clear: "mdi:weather-sunny",
    Clouds: "mdi:weather-cloudy",
    Rain: "mdi:weather-pouring",
    Drizzle: "mdi:weather-partly-rainy",
    Thunderstorm: "mdi:weather-lightning",
    Snow: "mdi:weather-snowy",
    Mist: "mdi:weather-fog"
  };

  weatherIcon.dataset.icon = iconMap[data.weather[0].main] || "mdi:weather-cloudy";

  // EXTREME TEMP ALERT
  if (data.main.temp >= 40) {
    alertBox.classList.remove("hidden");
    alertBox.textContent = "🔥 Extreme Heat Alert!";
  } else {
    alertBox.classList.add("hidden");
  }

  // CHANGE GRADIENT BASED ON WEATHER
  changeBackground(data.weather[0].main);
}

// -------------------------------
// BACKGROUND GRADIENT CHANGE
// -------------------------------
function changeBackground(condition) {
  const body = document.body;

  const gradients = {
    Clear: "linear-gradient(135deg, #facc15, #fb923c, #f97316)",
    Clouds: "linear-gradient(135deg, #6b7280, #94a3b8, #cbd5e1)",
    Rain: "linear-gradient(135deg, #0ea5e9, #0284c7, #0369a1)",
    Snow: "linear-gradient(135deg, #e0f2fe, #bae6fd, #7dd3fc)",
    Thunderstorm: "linear-gradient(135deg, #1e3a8a, #334155, #0f172a)"
  };

  body.style.background = gradients[condition] || gradients["Clouds"];
  body.style.backgroundSize = "600% 600%";
}

// -------------------------------
// FORECAST (5 DAY)
// -------------------------------
async function fetchForecast(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
  );

  const data = await response.json();

  forecast.innerHTML = "";
  forecastTitle.classList.remove("hidden");
  forecast.classList.remove("hidden");

  // Get midday forecast from 5 days
  const middayData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  middayData.forEach(day => {
    const card = `
      <div class="glass p-4 rounded-2xl text-white text-center">
        <p class="font-semibold">${day.dt_txt.split(" ")[0]}</p>
        <span class="iconify text-4xl" data-icon="mdi:weather-${day.weather[0].main.toLowerCase()}"></span>
        <p class="mt-2">${day.main.temp.toFixed(1)}°C</p>
        <p class="text-sm opacity-80">Humidity: ${day.main.humidity}%</p>
        <p class="text-sm opacity-80">Wind: ${day.wind.speed} km/h</p>
      </div>
    `;
    forecast.innerHTML += card;
  });
}

// -------------------------------
// RECENT CITIES STORAGE
// -------------------------------
function saveRecentCity(city) {
  let recent = JSON.parse(localStorage.getItem("recentCities")) || [];

  if (!recent.includes(city)) {
    recent.push(city);
  }

  localStorage.setItem("recentCities", JSON.stringify(recent));
  updateRecentDropdown();
}

function updateRecentDropdown() {
  let recent = JSON.parse(localStorage.getItem("recentCities")) || [];
  recentList.innerHTML = "";

  recent.forEach(city => {
    let li = document.createElement("li");
    li.textContent = city;
    li.classList = "cursor-pointer hover:text-blue-300";
    li.onclick = () => fetchWeather(city);
    recentList.appendChild(li);
  });
}

// -------------------------------
// UNIT TOGGLE °C ↔ °F
// -------------------------------
toggleUnit.addEventListener("click", () => {
  let value = parseFloat(temperature.textContent);

  if (isCelsius) {
    temperature.textContent = `${(value * 9 / 5 + 32).toFixed(1)}°F`;
    toggleUnit.textContent = "°C";
  } else {
    temperature.textContent = `${((value - 32) * 5 / 9).toFixed(1)}°C`;
    toggleUnit.textContent = "°F";
  }

  isCelsius = !isCelsius;
});

// -------------------------------
// EVENT LISTENERS
// -------------------------------
searchBtn.onclick = () => {
  if (cityInput.value.trim() === "") {
    errorBox.classList.remove("hidden");
    errorBox.textContent = "Please enter a city name.";
    return;
  }
  fetchWeather(cityInput.value.trim());
};

locationBtn.onclick = () => {
  navigator.geolocation.getCurrentPosition(success => {
    const { latitude, longitude } = success.coords;
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    )
      .then(r => r.json())
      .then(data => updateUI(data));
  });
};

// DROPDOWN SHOW/HIDE
recentBtn.onclick = () => {
  recentDropdown.classList.toggle("hidden");
};

// Load recent cities on startup
updateRecentDropdown();

// ------------------------------------------
// AUTOCOMPLETE CITY SEARCH
// ------------------------------------------

const suggestions = document.getElementById("suggestions");
const suggestionsList = document.getElementById("suggestionsList");

// Show suggestions when typing
cityInput.addEventListener("input", () => {
  const input = cityInput.value.toLowerCase();

  if (input.length === 0) {
    suggestions.classList.add("hidden");
    return;
  }

  // Filter matches
  const matches = cityList.filter(city =>
    city.toLowerCase().startsWith(input)
  ).slice(0, 10); // limit to 10 suggestions

  // If no results → hide
  if (matches.length === 0) {
    suggestions.classList.add("hidden");
    return;
  }

  // Build dropdown list
  suggestionsList.innerHTML = "";
  matches.forEach(city => {
    let li = document.createElement("li");
    li.textContent = city;
    li.onclick = () => {
      cityInput.value = city;
      suggestions.classList.add("hidden");
      fetchWeather(city);
    };
    suggestionsList.appendChild(li);
  });

  suggestions.classList.remove("hidden");
});

// Hide dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest("#cityInput")) {
    suggestions.classList.add("hidden");
  }
});
