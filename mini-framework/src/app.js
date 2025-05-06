import { MiniFrame, State, Router } from './index.js';

// Create state to hold todos and additional editing state
const state = new State({
  todos: [],
  filter: 'all',  // default filter
  editingIndex: null, // Track which todo is being edited
});

// Add Todo function
function addTodo() {
  const input = document.getElementById('todoInput');
  const newTodo = input.value.trim();
  if (newTodo) {
    state.setState({ todos: [...state.getState().todos, { text: newTodo, completed: false }] });
    input.value = '';
  }
}

// Toggle Todo completed state
function toggleTodo(index) {
  const todos = state.getState().todos;
  todos[index].completed = !todos[index].completed;
  state.setState({ todos });
}

// Start Editing a Todo
function startEditing(index) {
  state.setState({ editingIndex: index });
}

// Save Edited Todo
function saveEdit(index, newText) {
  const todos = state.getState().todos;
  if (newText.trim()) {
    todos[index].text = newText.trim();
  }
  state.setState({ todos, editingIndex: null }); // Reset editing index
}

// Handle input blur (when clicking outside)
function handleBlur(event, index) {
  saveEdit(index, event.target.value);
}

// Handle Enter key press
function handleKeyPress(event, index) {
  if (event.key === 'Enter') {
    saveEdit(index, event.target.value);
  }
}

// Delete completed todos
function clearCompleted() {
  const todos = state.getState().todos.filter(todo => !todo.completed);
  state.setState({ todos });
}

// Delete all todos
function deleteAll() {
  state.setState({ todos: [] });  // Clears all todos from the state
}

// Set filter
function setFilter(filter) {
  state.setState({ filter });
  window.location.hash = filter;  // Change URL hash to reflect the filter
}

// Render Todos
function renderTodos() {
  const { todos, filter, editingIndex } = state.getState();
  let filteredTodos = todos;

  if (filter === 'completed') {
    filteredTodos = todos.filter(todo => todo.completed);
  } else if (filter === 'notcompleted') {
    filteredTodos = todos.filter(todo => !todo.completed);
  }

  return filteredTodos.map((todo, index) => ({
    tag: 'li',
    attrs: { class: todo.completed ? 'completed' : '' },
    events: { click: () => toggleTodo(index) },
    children: [
      editingIndex === index
        ? { 
            tag: 'input',
            attrs: { type: 'text', value: todo.text, autofocus: true },
            events: {
              blur: (e) => handleBlur(e, index),
              keypress: (e) => handleKeyPress(e, index),
            },
          }
        : todo.text,
      {
        tag: 'button',
        attrs: { class: 'edit-btn' },
        events: { click: () => startEditing(index) },  // No stopPropagation, direct edit
        children: ['Edit'],
      },
    ],
  }));
}

// Main Application UI
const TodoApp = () => {
  const { todos, filter } = state.getState();
  const { total, completed, notCompleted } = {
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    notCompleted: todos.filter(todo => !todo.completed).length,
  };

  return MiniFrame.createElement({
    tag: 'div',
    attrs: { id: 'app' },
    children: [
      {
        tag: 'h1',
        children: ['TodoMVC'],
      },
      {
        tag: 'input',
        attrs: { id: 'todoInput', type: 'text', placeholder: 'Add a new task' },
      },
      {
        tag: 'button',
        events: { click: addTodo },
        children: ['Add'],
      },
      {
        tag: 'button',
        events: { click: () => setFilter('completed') },
        children: ['Show Completed'],
      },
      {
        tag: 'button',
        events: { click: () => setFilter('notcompleted') },
        children: ['Show Not Completed'],
      },
      {
        tag: 'button',
        events: { click: () => setFilter('all') },
        children: ['Show All'],
      },
      {
        tag: 'ul',
        children: renderTodos(),
      },
      {
        tag: 'button',
        events: { click: clearCompleted },
        children: ['Clear Completed'],
      },
      {
        tag: 'button',
        events: { click: deleteAll },  // Add the delete all button
        children: ['Delete All'],
      },
      {
        tag: 'div',
        children: [
          `Total: ${total} | Completed: ${completed} | Not Completed: ${notCompleted}`,
        ],
      },
    ],
  });
};

// Initialize routing and state sync
function initializeApp() {
  Router.initialize();
  state.subscribe(() => MiniFrame.renderApp(TodoApp));  // Re-render when state changes
  state.setState({ filter: Router.getCurrentRoute() });  // Sync state with URL
}

// Start the app
initializeApp();
