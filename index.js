const inputElement = document.getElementById('TodoInput')
const listElement = document.getElementById('TodoList')
const counterTextElement = document.getElementById('TodoCounterText')

let todoList = []

inputElement.onkeydown = function (event){
    if (event.key == 'Enter') handleAddItem()
}

function handleAddItem() {
    const inputValue = inputElement.value
    
    if (inputValue == '') return

    const newTodoItem = {
        id: Date.now(),
        name: inputValue,
        status: 'pending'
    }
todoList.push(newTodoItem)    

render()
inputElement.value = ''
inputElement.focus()
}

function render(){
    listElement.innerHTML = ''

    todoList.forEach(function(listItem){
        const todoItemElement = document.createElement('li')
        todoItemElement.classList = 'todo-list-item'
        todoItemElement.id = listItem.id

        todoItemElement.innerHTML = getTodoItemContentByTodo(listItem)
    
        const deleteButton = todoItemElement.querySelector(`#trash_${listItem.id}`)

        deleteButton.onclick = function() {
            handleDeleteTodoById(listItem.id)
        }
        
        const toggleButton = todoItemElement.querySelector(`#toggle_${listItem.id}`)
        toggleButton.onclick = () => {
            handleToggleItembyId(listItem.id)
        }

        const todoCheckbox = todoItemElement.querySelector(`#check_${listItem.id}`)
        todoCheckbox.onclick = () => {
            handleToggleItembyId(listItem.id)
        }

        listElement.append(todoItemElement)
    })

    const pendingTodos = todoList.filter(todoItem => todoItem.status === 'pending')
    counterTextElement.innerHTML = 'Você tem '
    counterTextElement.innerHTML += pendingTodos.length
    counterTextElement.innerHTML += pendingTodos.length == 1 ? ' tarefa ' : ' tarefas '
    counterTextElement.innerHTML += pendingTodos.length == 1 ? 'pendente' : 'pendentes'

    saveState()
}
  
function getTodoItemContentByTodo (listItem) {
    return `
        <div class="todo-list-item-content">
            <input 
            type="checkbox" 
            class="todo-item-check" 
            ${listItem.status == 'done' ? 'checked' : 'não tem nada'}
            id= "check_${listItem.id}"
            >
            <span class="todo-item-text">${listItem.name}</span>
        </div>
        <div class="todo-list-item-actions">
            <button class="purple-background" id="toggle_${listItem.id}">
                <img src="assets/checkmark.svg">
            </button>
            <button class="orange-background" id="trash_${listItem.id}" onclick = "">
                <img src="assets/trash.svg">
            </button>
        </div>
    `
}
function handleDeleteTodoById (todoId){
    const todoListOnlyId = todoList.map(function(listItem){
        return listItem.id
    })
    const removeTodoIndex = todoListOnlyId.indexOf(todoId)
    todoList.splice(removeTodoIndex, 1)
    render()
}

function handleToggleItembyId(todoId){
    const todoItemToToggle = todoList.find((todoItem) => {
        return todoItem.id == todoId
    })
    if (todoItemToToggle.status == 'pending') {
        todoItemToToggle.status = 'done'
    } else {
        todoItemToToggle.status = 'pending'
    }

    render()

}

function handleClearAll () {
    todoList = []

    render()
}

function saveState() {
    localStorage.setItem('state', JSON.stringify(todoList))
}
function getState(){
    const state = localStorage.getItem('state')
    todoList = JSON.parse(state)
    render()
}
window.onload = getState 