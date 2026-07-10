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
