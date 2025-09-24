const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const addTaskBtn = document.getElementById("add-button");
const taskList = document.getElementById("task-list");

// Array of tasks
let tasks = [];

// Function to add new task
function addTask() {
  const taskText = taskInput.value;
  const taskDate = dateInput.value;
  console.log("User typed:", taskText);

  // stops from adding empty tasks
  if (taskText === "") {
    alert("please enter a task!");
    return;
  }
  // Create a new task object
  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false,
    dueDate: taskDate || null
  };

  // Add task to the task array
  tasks.push(newTask);

  // Clears input box after task is added
  taskInput.value = "";
  dateInput.value = "";

  // Displays all task
  displayTasks();
}

function displayTasks() {
  console.log("displayTasks function called!")
  console.log("current task:", tasks);
  taskList.innerHTML = "";

  tasks.forEach(function(task) {
    const taskElement = document.createElement("div");
    taskElement.className = task.completed ? "task-item completed" : "task-item";

    // Calculate if task is due or overdue
    let dueDateClass = "";
    let dueDateText = "";
    if (task.dueDate) {
      const today = new Date();
      const dueDate = new Date(task.dueDate);
      const timeDiff = dueDate - today;
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      if (daysDiff < 0) {
        dueDateClass = "overdue";
        dueDateText = `Due: ${task.dueDate} (Overdue!)`;
      } else if (daysDiff <= 2) {
        dueDateClass = "due-soon";
        dueDateText = `Due: ${task.dueDate} (Soon!)`;
      } else {
        dueDateText = `Due: ${task.dueDate}`;
      }
    }

    taskElement.innerHTML = `
    <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleComplete(${task.id})">
    <span class="task-text ${task.completed ? "completed" : ""}">${task.text}</span>
    <span class="due-date ${dueDateClass}">${dueDateText}</span>
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