const apiKey = config.API_KEY;
const board = document.querySelector(".board");
const inputField = document.querySelector("input");
const locField = document.querySelector("button");
const renew = document.querySelector("header i");
const hint = document.querySelector(".hint");
const weatherIcon = document.querySelector("img");

renew.addEventListener("click", () => {
  board.classList.remove("active");
  hint.classList.remove("pending", "error");
  inputField.value = "";
});

// get weather for current position
locField.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
});

const showPosition = (position) => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const apiForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  fetchData(api, apiForecast);
};

const showError = (error) => {
  console.log(error);
  hint.innerText = error.message; //
  hint.classList.add("error");
};

// get weather for the city entered
inputField.addEventListener("keyup", (e) => {
  if (e.key == "Enter" && e.target.value != "") {
    requestApi(e.target.value);
  }
});

const requestApi = (city) => {
  // console.log(city)
  const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&units=metric`;
  const apiForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  fetchData(api, apiForecast);
};

const fetchData = (api, apiForecast) => {
  hint.innerText = "Getting weather data...";
  hint.classList.add("pending");
  fetch(api)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      weatherData(data);
    })
    .catch((err) => console.error(err));

  fetch(apiForecast)
    .then((res) => res.json())
    .then((data) => {
      forecastData(data);
    })
    .catch((err) => console.error(err));
};

const weatherData = (data) => {
  if (data.cod == "404") {
    hint.innerText = "Not a valid name";
    hint.classList.replace("pending", "error");
  } else {
    board.classList.add("active");
    document.querySelector(".forecast-container").classList.add("active");
    const city = data.name;
    const country = data.sys.country;
    const { description, main } = data.weather[0];
    const { temp, feels_like, humidity } = data.main;

    document.querySelector(".weather-text").innerText = description;
    document.querySelector(".ort").innerText = `${city}, ${country}`;
    document.querySelector(".temp .num").innerText = Math.floor(temp);
    document.querySelector(".temp-feel .num").innerText =
      Math.floor(feels_like);
    document.querySelector(".humidity .num").innerText = humidity;
    weatherIcon.src = `public/${main}.png`;
  }
};

const forecastData = (data) => {
  if (data.cod != "404") {
    console.log(data);
    for (let h = 0; h < 3; h++) {
      const { temp } = data.list[h].main;
      const { main } = data.list[h].weather[0];
      const date = new Date(data.list[h].dt_txt);
      const hour = date.getHours();

      document.querySelector(`.forecast-${h}h .num`).innerText =
        Math.floor(temp);
      document.querySelector(`.forecast-${h}h .hour`).innerText = hour;
      document.querySelector(`.forecast-${h}h img`).src = `public/${main}.png`;
    }
  }
};
