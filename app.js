const STORAGE_KEY = 'todos';

const form = document.getElementById('add-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

function loadTodos() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function renderTodos() {
  const todos = loadTodos();
  list.innerHTML = '';
  for (const todo of todos) {
    const li = document.createElement('li');
    if (todo.done) li.classList.add('done');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.addEventListener('change', () => toggleTodo(todo.id));

    const span = document.createElement('span');
    span.textContent = todo.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    li.append(checkbox, span, deleteBtn);
    list.appendChild(li);
  }
}

function addTodo(text) {
  const todos = loadTodos();
  todos.push({
    id: crypto.randomUUID(),
    text,
    done: false,
    createdAt: new Date().toISOString(),
  });
  saveTodos(todos);
  renderTodos();
}

function toggleTodo(id) {
  const todos = loadTodos();
  const todo = todos.find((t) => t.id === id);
  if (todo) todo.done = !todo.done;
  saveTodos(todos);
  renderTodos();
}

function deleteTodo(id) {
  const todos = loadTodos().filter((t) => t.id !== id);
  saveTodos(todos);
  renderTodos();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  addTodo(text);
});

renderTodos();
