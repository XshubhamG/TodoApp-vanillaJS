import '../style.css'
import { timeAgo } from './utils'

const todoForm = document.getElementById('todo-form')
const todoInput = todoForm['todoInput']
const noTodos = document.getElementById('noTodos')
const todosContainer = document.getElementById('todos')

//* Event Listeners
todoForm.addEventListener('submit', (e) => {
    e.preventDefault()
    addTodo()
    renderTodos()
})

todosContainer.addEventListener('click', (e) => {
    const target = e.target;
    if (target.id.startsWith('deleteBtn-')) {
        const todoId = target.id.replace('deleteBtn-', '')
        deleteTodo(todoId)
    } else if (target.id.startsWith('checkbox-')) {
        const todoId = target.id.replace('checkbox-', '')
        toggleTodo(todoId)
    } else if (target.id.startsWith('editBtn-')) {
        const todoId = target.id.replace('editBtn-', '')
        editTodo(todoId)
    }
    renderTodos()
})

//* Todo Class
class Todo {
    constructor(title) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.time = new Date().toLocaleString();
        this.completed = false;
    }

    static saveTodo() {
        localStorage.setItem('todos', JSON.stringify(todos))
    }

    static getTodos() {
        return localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : []
    }
}

//* Todo Array
/** @type {Todo[]} */
let todos = Todo.getTodos()

//* Functions
function addTodo() {
    if (todoInput.value.trim() === "") return;

    const newTodo = new Todo(todoInput.value.trim())
    todos.push(newTodo)
    Todo.saveTodo()
    todoInput.value = ""
}

/**
 * Deletes a todo item from the todos array based on the provided id.
 *
 * @param {number} id - The id of the todo item to be deleted.
 * @return {undefined} This function does not return a value.
 */
function deleteTodo(id) {
    todos = todos.filter((todo) => todo.id !== id)
    Todo.saveTodo()
}

/**
 * Toggles the completion status of a todo item with the given ID.
 *
 * @param {number} id - The ID of the todo item to toggle.
 * @return {void} This function does not return a value.
 */
function toggleTodo(id) {
    todos = todos.map((todo) => {
        if (todo.id === id) {
            todo.completed = !todo.completed
        }
        return todo
    })
    Todo.saveTodo()
}

/**
 * Edits a todo item with the given ID.
 *
 * @param {number} id - The ID of the todo item to edit.
 * @return {undefined} This function does not return a value.
 */
function editTodo(id) {
    todos = todos.map((todo) => {
        if (todo.id === id) {
            todo.title = prompt('Edit Todo', todo.title)
            todo.time = new Date().toLocaleString();
        }
        return todo
    })
    Todo.saveTodo()
}

/**
 * Renders the todos on the page based on the current list of todos.
 * If there are todos, it clears the todos container and displays them.
 * If there are no todos, it hides the todos container and displays a "no todos" message.
 *
 * @return {void} This function does not return anything.
 */
function renderTodos() {
    if (todos.length > 0) {
        todosContainer.innerHTML = ''
        noTodos.style.display = 'none'
        todos.forEach((todo) => {
            todosContainer.innerHTML += `
                <div class="flex  items-center justify-between gap-4 p-6 bg-white rounded-lg shadow-md">
                    <div class="flex items-center gap-4">
                     <input type="checkbox" id="checkbox-${todo.id}" class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" id="${todo.id}" ${todo.completed ? 'checked' : ''}>
                        <p class="text-xl font-bold ${todo.completed ? 'line-through text-gray-400' : ''}">${todo.title} <span class="text-sm text-gray-400 ${todo.completed && "hidden"}">${timeAgo(todo.time)}</span></p>
                    </div>
                    <div class="flex items-center gap-4">
                        <button class="text-blue-500 hover:text-blue-700 hover:font-bold"  id="editBtn-${todo.id}">Edit</button>
                        <button class="text-red-500 hover:text-red-700 hover:font-bold" id="deleteBtn-${todo.id}">Delete</button>
                    </div>
                </div>`
        })
    } else {
        noTodos.style.display = 'block'
        todosContainer.innerHTML = ''
    }
}

//* initialize the app
document.addEventListener('DOMContentLoaded', renderTodos)
