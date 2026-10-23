const input = document.getElementById("todo-input");
const button = document.getElementById("todo-btn");
const todoList = document.getElementById("todo-list");
const toggleBtn = document.getElementById("theme-btn");
const body = document.querySelector("body");

// Switch to light and dark mode
let currentMode = "light";
toggleBtn.addEventListener("click", () => {
  if(currentMode == "light") {
    body.classList.add("dark");
    body.classList.remove("light");
    toggleBtn.innerHTML = `<span class='material-symbols-outlined'>dark_mode</span>`;
    currentMode = "dark";
  }
  else {
    body.classList.add("light");
    body.classList.remove("dark");
    toggleBtn.innerHTML = `<span class='material-symbols-outlined'>light_mode</span>`;
    currentMode = "light";
  }
})

// try to load saved todos from local storage (if any)
const saved = localStorage.getItem("todos");
const todos = saved ? JSON.parse(saved) : [];

// saved function in local storage
function saveTodo() {
  // save current todos array to local storage
  localStorage.setItem("todos", JSON.stringify(todos));
}

// create a dom node for a todo object and append it
function createTodoNode(todo, index) {
  const li = document.createElement("li");
  const checkbox = document.createElement("input");

  // checkbox to toggle condition
  checkbox.type = "checkbox";
  checkbox.checked = !!todo.completed;

  checkbox.addEventListener("change", () => {
    todo.completed = checkbox.checked;

    // visual feedback : strike through when it is completed
    textSpan.style.textDecoration = todo.completed ? "line-through" : "";
    saveTodo();
  });

  // Text of the todo
  const textSpan = document.createElement("span");
  textSpan.textContent = todo.text;
  // textSpan.style.margin = "10px";

  if (todo.completed) {
    textSpan.style.textDecoration = "line-through";
  }

  // Add edit button and add event listener to edit todo
  const editButton = document.createElement("button");
  editButton.className = "edit-btn";
  editButton.innerHTML = `<span class='material-symbols-outlined'>edit</span>`;
  editButton.setAttribute("aria-label", "Edit task");
  editButton.title = "Edit task";

  editButton.addEventListener("click", () => {
    const newText = prompt("Edit Todo", todo.text);

    if (newText != null) {
      todo.text = newText.trim();
      textSpan.textContent = todo.text;
      saveTodo();
    }
  });

  // Delete todo button
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.innerHTML = `<span class='material-symbols-outlined'>close</span>`;
  deleteBtn.setAttribute("aria-label", "Delete task");
  deleteBtn.title = "Delete task";

  deleteBtn.addEventListener("click", () => {
    todos.splice(index, 1);
    renderNode();
    saveTodo();
  });

  li.appendChild(checkbox);
  li.appendChild(textSpan);
  li.appendChild(editButton);
  li.appendChild(deleteBtn);

  return li;
}

// render the whole todo list in webpage
function renderNode() {
  todoList.innerHTML = "";

  todos.forEach((todo, index) => {
    const node = createTodoNode(todo, index);
    todoList.appendChild(node);
  });
}

// Add function for add the todos
function addTodo() {
  const text = input.value.trim();
  if (!text) return;

  // Push a new todo object
  todos.push({ text: text, completed: false });

  input.value = "";
  renderNode();
  saveTodo();
}

button.addEventListener("click", addTodo);

input.addEventListener("keydown", (e) => {
  if (e.key == "Enter") addTodo();
});

renderNode();
