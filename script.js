const taskInput = document.getElementById("taskInput");
const categorySelect = document.getElementById("categorySelect");
const prioritySelect = document.getElementById("prioritySelect");
const reminderSelect = document.getElementById("reminderSelect");
const dateInput = document.getElementById("dateInput");
const addTaskBtn = document.getElementById("add-button");
const taskList = document.getElementById("task-list");

//Notificaton alert function
function requestNotificationPermission() {
    if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
    }
}

function checkReminders() {
    const now = new Date();
    
    tasks.forEach(function(task) {
        if (!task.reminder || !task.dueDate || task.completed) {
            return;
        }
        
        const dueDate = new Date(task.dueDate);
        const reminderMinutes = parseInt(task.reminder);
        const reminderTime = new Date(dueDate.getTime() - (reminderMinutes * 60 * 1000));
        const timeDiff = reminderTime - now;
        const oneMinute = 60 * 1000;
        
        if (timeDiff > 0 && timeDiff <= oneMinute && !task.notified) {
            showNotification(task);
            task.notified = true;
        }
    });
}

function showNotification(task) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Task Reminder", {
            body: `${task.text}\nDue: ${task.dueDate}`,
            icon: "🔔",
            tag: task.id.toString()
        });
    } else {
        alert(`Reminder: ${task.text}\nDue: ${task.dueDate}`);
    }
}

requestNotificationPermission();

// Array of tasks
let tasks = [];

// Function to add new task
function addTask() {
  const taskText = taskInput.value;
  const taskCategory = categorySelect.value;
  const taskPriority = prioritySelect.value;
  const taskReminder = reminderSelect.value;
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
    category: taskCategory || null,
    priority: taskPriority,
    reminder: taskReminder || null,
    dueDate: taskDate || null
  };

  // Add task to the task array
  tasks.push(newTask);

  // Clears input box after task is added
  taskInput.value = "";
  categorySelect.value = "";
  prioritySelect.value = "medium",
  reminderSelect.value = "";
  dateInput.value = "";

  // Displays all task
  displayTasks();
}

function displayTasks() {
  console.log("displayTasks function called!")
  console.log("current task:", tasks);
  taskList.innerHTML = "";

  let filteredTasks = tasks;
  if (currentFilter !=="all") {
    if (currentFilter === "none") {
      filteredTasks = tasks.filter(task => !task.category || task.category === "");
    } else {
      filteredTasks = tasks.filter(task => task.category === currentFilter);
    }
  }

  const priorityOrder = {"high" : 1, "medium" : 2, "low" : 3};
  filteredTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  filteredTasks.forEach(function(task) {
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
    <div class="task-header">
      <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleComplete(${task.id})">
      <span class="priority-indicator priority-${task.priority}">${task.priority === "high" ? "❗" : task.priority === "low" ? "⬇" : "⏺"}</span>
      <span class="task-text ${task.completed ? "completed" : ""}">${task.text}</span>
    </div>
    ${task.reminder ? '<span class="reminder-icon" title="Reminder set">🔔</span>' : ''}
    <span class="category-tag ${task.category ? 'category-' + task.category : ""}">${task.category ? task.category.charAt(0).toUpperCase() + task.category.slice(1) : ""}</span>
    <span class="due-date ${dueDateClass}">${dueDateText}</span>
    <div class="task-buttons">
      <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
      <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
    </div>
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

let currentFilter = "all";

function filterTasks(filterType) {
  currentFilter = filterType;

  const allButtons = document.querySelectorAll(".filter-btn");
  allButtons.forEach(btn => btn.classList.remove("active"));

  allButtons.forEach(btn => {
    if (btn.textContent.toLowerCase() === filterType || (filterType === "none" && btn.textContent === "No Category")) {
      btn.classList.add("active");
    }
  });
  displayTasks();
}

addTaskBtn.addEventListener("click", addTask)
taskInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    addTask();
  }
});


setInterval(checkReminders, 10000);

checkReminders();
console.log("JavaScript is working!");