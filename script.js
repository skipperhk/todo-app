const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("add-button");
const taskList = document.getElementById("task-list");

// Array of tasks
let tasks = [];

// Function to add new task
function addTask() {
  const taskText = taskInput.value;
  console.log("User typed:", taskText);

  // stops from adding empty tasks
  if (taskText === "") {
    alert("please enter a task!");
    return;
  }
  
  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false
  };

  // Add task to the task array
  tasks.push(newTask);

  // Clears input box after task is added
  taskInput.value = "";

  // Displays all task
  displayTasks();
}

function displayTasks() {
  taskList.innerHTML = "";

  tasks.forEach(function(task) {
    const taskElement = document.createElement("div");

    taskElement.className = task.completed ? "task-item completed" : "task-item";

    taskElement.innerHTML = `
    <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleComplete(${task.id})">
    <span class="task-text ${task.completed ? "completed" : ""}">${task.text}</span>
    <button onclick="editTask(${task.id})">Edit</button>
    <button onclick="deleteTask(${task.id})">Delete</button>
    `;
    taskList.appendChild(taskElement);
  });
}

function deleteTask(taskId) {
  tasks = tasks.filter(function(task) {
    return task.id != taskId;
  });

  displayTasks();
}

function toggleComplete(taskId) {
  const task = tasks.find(function(t) {
    return t.id === taskId;
  });

  if (task) {
    task.completed = !task.completed;
    console.log("Task completed status:", task.completed)
    displayTasks();
  }
}

function editTask(taskId) {
  const task = tasks.find(function(t) {
    return t.id === taskId;
  });

  if (task) {
    const newText = prompt("Edit task:", task.text);

    if (newText !== null && newText.trim() !== "") {
      task.text = newText.trim();
      displayTasks();
    }
  }
}

addTaskBtn.addEventListener("click", addTask)
taskInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    addTask();
  }
});

console.log("JavaScript is working!");