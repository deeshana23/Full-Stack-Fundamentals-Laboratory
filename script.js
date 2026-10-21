const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const errorMsg = document.getElementById('errorMsg');
const emptyMsg = document.getElementById('emptyMsg');
const counter = document.getElementById('counter');
const remainingBadge = document.getElementById('remainingBadge');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';


function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';


  let filtered = tasks.filter(t => {
    if (currentFilter === 'active') return !t.completed;
    if (currentFilter === 'completed') return t.completed;
    return true; // all
  });

  
  if (filtered.length === 0) {
    emptyMsg.classList.remove('d-none');
    if (tasks.length === 0) {
      emptyMsg.textContent = "No tasks yet. Add your first task!";
    } else {
      emptyMsg.textContent = `No ${currentFilter} tasks.`;
    }
  } else {
    emptyMsg.classList.add('d-none');
  }

  
  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = `list-group-item ${task.completed ? 'completed' : ''}`;
    
    li.innerHTML = `
      <div class="d-flex align-items-center flex-grow-1">
        <input type="checkbox" class="form-check-input m-0" 
               ${task.completed ? 'checked' : ''} 
               onchange="toggleTask(${task.id})">
        <span class="task-text">${task.text}</span>
      </div>
      <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">
        Delete
      </button>
    `;
    taskList.appendChild(li);
  });

  updateCounter();
}


function updateCounter() {
  const activeCount = tasks.filter(t => !t.completed).length;
  remainingBadge.textContent = `${activeCount} remaining`;
  counter.textContent = `${tasks.length} Your tasks`;
}


function addTask() {
  const text = taskInput.value.trim();


  if (text === '') {
    errorMsg.classList.remove('d-none');
    return;
  }
  errorMsg.classList.add('d-none');

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.push(newTask);
  taskInput.value = '';
  saveTasks();
  renderTasks();
}


function toggleTask(id) {
  tasks = tasks.map(t => 
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks();
  renderTasks();
}


function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}


function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
}


addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

taskInput.addEventListener('input', () => {
  errorMsg.classList.add('d-none');
});

clearCompletedBtn.addEventListener('click', clearCompleted);


filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});


renderTasks();