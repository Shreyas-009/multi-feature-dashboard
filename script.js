let backBtn = document.getElementById("back-btn");
let featureSeaction = document.getElementById("feature-section");
let allSections = document.querySelectorAll(".sections");

backBtn.addEventListener("click", () => {
  featureSeaction.style.display = "block";
  allSections.forEach((p) => p.style.display = "none");
});

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
                            <button class="btn-delete" onclick="deleteTodo(${index})">D</button>
                            <button class="btn-mark ${todo.important ? "active" : ""}" onclick="markTodo(${index})"Important">M</button>
                            <button class="btn-complete ${todo.complete ? "active" : ""}" onclick="completeTodo(${index})">C</button>
                        </div>
                    </div>
        `;
  });

  // console.log(todoList);

  todoContainer.innerHTML = ui;
}

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
themeToggle.onclick = () => toggleTheme(!document.body.classList.contains("dark"));
