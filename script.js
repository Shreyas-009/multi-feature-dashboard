let backBtn = document.getElementById("back-btn");
let featureSeaction = document.getElementById("feature-section");
let allSections = document.querySelectorAll(".sections");

backBtn.addEventListener("click", () => {
  featureSeaction.style.display = "flex";
  allSections.forEach((p) => (p.style.display = "none"));
});

function openPage(sectionId) {
  featureSeaction.style.display = "none";
  document.getElementById(sectionId).style.display = "flex";
}

// todo list
let todoContainer = document.getElementById("todo-list");
let todoInp = document.getElementById("todo-input");
let todoList = JSON.parse(localStorage.getItem("todoList")) || [];

function addTodo() {
  if (!todoInp.value.trim()) return;
  todoList.push({
    content: todoInp.value,
    important: false,
    complete: false,
  });
  todoInp.value = "";
  updateTodo();
}

function deleteTodo(id) {
  todoList.splice(id, 1);
  updateTodo();
}
function markTodo(id) {
  todoList[id].important = !todoList[id].important;
  updateTodo();
}
function completeTodo(id) {
  todoList[id].complete = !todoList[id].complete;
  updateTodo();
}

function updateTodo() {
  localStorage.setItem("todoList", JSON.stringify(todoList));
  let ui = todoList.length ? "" : "<p>please add task!</p>";
  todoList.forEach((todo, index) => {
    // console.log(todo);

    ui += `
        <div class="todo-card ${todo.important ? "important" : ""}">
            <div class="todo-card-r">
                <p class="todo-content ${todo.complete ? "completed" : ""}">${todo.content}
                </p>
            </div>
            <div class="todo-card-l">
                <button class="btn-delete" data-action="delete" data-index="${index}">D</button>
                <button class="btn-mark ${todo.important ? "active" : ""}" data-action="mark" data-index="${index}">M</button>
                <button class="btn-complete ${todo.complete ? "active" : ""}" data-action="complete" data-index="${index}">C</button>
            </div>
        </div>
        `;
  });

  // console.log(todoList);

  todoContainer.innerHTML = ui;
}

todoContainer.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const action = btn.dataset.action;
  const index = parseInt(btn.dataset.index);
  if (action === "delete") deleteTodo(index);
  if (action === "mark") markTodo(index);
  if (action === "complete") completeTodo(index);
});

updateTodo();

// Theme Toggler
const themeToggle = document.getElementById("theme-toggle");
const themeImg = themeToggle.querySelector("img");
const toggleTheme = (isDark) => {
  document.body.classList.toggle("dark", isDark);
  themeImg.src = isDark ? "sun.svg" : "moon.svg";
  localStorage.setItem("theme", isDark ? "dark" : "light");
  if (typeof updateBackground === "function") updateBackground();
};
toggleTheme(localStorage.getItem("theme") !== "light");
themeToggle.onclick = () =>
  toggleTheme(!document.body.classList.contains("dark"));



//  planner 
const planerList = document.getElementById("planer-list");
const planrData = JSON.parse(localStorage.getItem("planrData")) || {};
const slots = [
  { hour: 9, label: "09:00 AM" },
  { hour: 10, label: "10:00 AM" },
  { hour: 11, label: "11:00 AM" },
  { hour: 12, label: "12:00 PM" },
  { hour: 13, label: "01:00 PM" },
  { hour: 14, label: "02:00 PM" },
  { hour: 15, label: "03:00 PM" },
  { hour: 16, label: "04:00 PM" },
  { hour: 17, label: "05:00 PM" },
  { hour: 18, label: "06:00 PM" },
];

function renderplanerData() {
  let ui = "";
  slots.map((slot) => {
    const value = planrData[slot.hour] || "";
    ui += `
    <div class="time-card">
        <span class="time-hrs">${slot.label}</span>
        <input
          type="text"
          name=""
          value="${value}"
          data-hour="${slot.hour}"
          class="time-inp"
          placeholder="Add note"
        />
        <button onclick="clearSlot(${slot.hour})" data-hour="${slot.hour}" class="time-btn">Clear</button>
      </div>
    `;
  });
  planerList.innerHTML = ui;
}

planerList.addEventListener("input", (e) => {
  if (e.target.tagName === "INPUT") {
    const hour = e.target.dataset.hour;
    planrData[hour] = e.target.value;
    localStorage.setItem("planrData", JSON.stringify(planrData));
  }
});

function clearSlot(hour) {
  planrData[hour] = "";
  localStorage.setItem("planrData", JSON.stringify(planrData));
  renderplanerData();
}

renderplanerData();


// Motivation Quote

const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const newQuoteBtn = document.getElementById("new-quote-btn");

async function fetchQuote() {
  newQuoteBtn.disabled = true;
  quoteText.innerText = "Loading quote...";
  quoteAuthor.innerText = "";
  
  try {
    const res = await fetch("https://dummyjson.com/quotes/random");
    if (!res.ok) throw new Error("API issue");
    const data = await res.json();
    quoteText.innerText = `"${data.quote}"`;
    quoteAuthor.innerText = `- ${data.author}`;
  } catch (error) {
    quoteText.innerText = "Failed to load quote. Keep pushing, you're doing great!";
    quoteAuthor.innerText = "";
  } finally {
    newQuoteBtn.disabled = false;
  }
}

fetchQuote();


// Pomodoro Timer

const pomodoroTimer = document.getElementById("pomodoro-timer");

let pomodoroInterval = null;
let secondsLeft = 25 * 60;
let isWorkSession = true;

function updateTimerDisplay() {
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  pomodoroTimer.innerText = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function startPomodoro() {
  if (pomodoroInterval) return;
  
  pomodoroInterval = setInterval(() => {
    secondsLeft--;
    updateTimerDisplay();
    
    if (secondsLeft <= 0) {
      clearInterval(pomodoroInterval);
      pomodoroInterval = null;
      
      alert(isWorkSession ? "Work session completed" : "Break completed");
      
      isWorkSession = !isWorkSession;
      secondsLeft = (isWorkSession ? 25 : 5) * 60;
      updateTimerDisplay();
    }
  }, 1000);
}

function pausePomodoro() {
  clearInterval(pomodoroInterval);
  pomodoroInterval = null;
}

function resetPomodoro() {
  clearInterval(pomodoroInterval);
  pomodoroInterval = null;
  isWorkSession = true;
  secondsLeft = 25 * 60;
  updateTimerDisplay();
}

updateTimerDisplay();

// Date & Time

function updateDateTime() {
  const now = new Date();
  document.getElementById("dashboard-time").innerText = now.toLocaleTimeString("en-US", { hour12: true });
  document.getElementById("dashboard-date").innerText = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}
updateDateTime();
setInterval(updateDateTime, 1000);


// Background change

function updateBackground() {
  const hr = new Date().getHours();
  const isDark = document.body.classList.contains("dark");
  let bg = isDark ? "#080a0d" : "#f6eee9";
  let greeting = "Good Night!";
  
  if (hr >= 5 && hr < 11) {
    greeting = "Good Morning!";
    bg = isDark ? "#15181e" : "#fff3ec";
  } else if (hr >= 11 && hr < 17) {
    greeting = "Good Afternoon!";
    bg = isDark ? "#1b1817" : "#f5eae4";
  } else if (hr >= 17 && hr < 21) {
    greeting = "Good Evening!";
    bg = isDark ? "#2a1d1c" : "#e8d9d3";
  }
  
  const fs = document.getElementById("feature-section");
  if (fs) fs.style.backgroundColor = bg;
  const gt = document.getElementById("greeting-text");
  if (gt) gt.innerText = greeting;
}
updateBackground();
setInterval(updateBackground, 60000);


// Weather 

const weatherLoading = document.getElementById("weather-loading");
const weatherContent = document.getElementById("weather-content");
const weatherError = document.getElementById("weather-error");

function getWeatherDesc(c) {
  if (c === 0) return "Clear Sky";
  if (c <= 3) return "Partly Cloudy";
  if (c === 45 || c === 48) return "Foggy";
  if (c >= 51 && c <= 55) return "Drizzle";
  if (c >= 61 && c <= 65) return "Rainy";
  if (c >= 71 && c <= 75) return "Snowy";
  if (c >= 80 && c <= 82) return "Showers";
  return "Thunderstorm";
}

async function fetchWeather(lat, lon, city) {
  try {
    if (!city) {
      try {
        const geo = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
        const geoData = await geo.json();
        city = geoData.address.city || geoData.address.town || geoData.address.village || "Your Location";
      } catch {
        city = "Your Location";
      }
    }
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`);
    const data = await res.json();
    const curr = data.current;
    
    document.getElementById("weather-temp").innerText = `${Math.round(curr.temperature_2m)}°C`;
    document.getElementById("weather-desc").innerText = getWeatherDesc(curr.weather_code);
    document.getElementById("weather-city").innerText = city;
    document.getElementById("weather-humidity").innerText = `${curr.relative_humidity_2m}%`;
    document.getElementById("weather-wind").innerText = `${curr.wind_speed_10m} km/h`;
    
    weatherLoading.classList.add("hide");
    weatherContent.classList.remove("hide");
  } catch {
    weatherLoading.classList.add("hide");
    weatherError.classList.remove("hide");
  }
}

navigator.geolocation.getCurrentPosition(
  (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
  () => fetchWeather(28.6139, 77.2090, "Delhi")
);
