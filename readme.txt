Vibrant Glass Weather Forecast App

A modern, responsive, and dynamic weather forecasting application built using JavaScript, HTML, Tailwind CSS, and OpenWeatherMap API.

 Overview

This project is a single-page weather forecasting application designed with a Vibrant Glass UI and smooth animated gradient backgrounds. It provides current weather data, 5-day extended forecasts, location-based weather, and interactive search features.

The application dynamically fetches weather data using the OpenWeatherMap API, changes its background based on weather conditions, and includes clean UI components enhanced by Tailwind CSS and Iconify icons.

 Features
 1. City Search (with Validation)

Search weather by entering any valid city name.

Input validation to prevent empty or incorrect queries.

Displays custom error messages instead of alert boxes.

 2. Current Location Weather

Fetches weather automatically using geolocation.

Provides live temperature, humidity, wind speed, etc.

 3. Recent Searches Dropdown

Stores recent cities using localStorage.

Dropdown list updates automatically.

Clicking a city refetches its weather instantly.

 4. Current Weather Display

Shows:

Temperature

Humidity

Wind speed

Weather description

Dynamic colorful icons (Iconify)

Extreme weather alerts (e.g., heat > 40°C)

 5. Temperature Unit Toggle (°C ↔ °F)

Users can switch between Celsius and Fahrenheit for the current temperature.

 6. Weather-Based Dynamic Backgrounds

The background gradient changes based on:

Sunny

Rainy

Cloudy

Snow

Thunderstorm

Fog/Mist

 7. 5-Day Extended Forecast

Each day card displays:

Date

Temperature

Humidity

Wind speed

Weather icon

 8. Graceful Error Handling

API errors handled smoothly

Invalid cities display readable messages

Autocomplete handles no results properly

9. Clean Code Structure

Organized JavaScript

Fully commented

Easy to maintain and extend
Technologies Used

HTML5

Tailwind CSS (CDN)

JavaScript (Vanilla JS)

OpenWeatherMap API

Navigator Geolocation API

LocalStorage

Iconify Icons