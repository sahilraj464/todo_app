const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');

async function fetchTasks() {
    const response = await fetch('http://localhost:5000/tasks');
    const tasks = await response.json();
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task._id}', ${!task.completed})">
            <span>${task.title}</span>
            <button onclick="editTask('${task._id}')">Edit</button>
            <button onclick="deleteTask('${task._id}')">Delete</button>
        `;
        taskList.appendChild(li);
    });
}

addTaskButton.addEventListener('click', async () => {
    if (taskInput.value) {
        await fetch('http://localhost:5000/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: taskInput.value })
        });
        taskInput.value = '';
        fetchTasks();
    }
});

async function toggleTask(id, completed) {
    await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
    });
    fetchTasks();
}

async function editTask(id) {
    const newTitle = prompt("Enter new task title:");
    if (newTitle) {
        await fetch(`http://localhost:5000/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle })
        });
        fetchTasks();
    }
}

async function deleteTask(id) {
    await fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
}

fetchTasks();
