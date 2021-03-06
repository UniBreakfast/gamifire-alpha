app.tasks = []
// app.tasks = [{task: 'do something', level: 4, mins: 452, id: 1, customMins: 40}]
const minsPerLevel = 120

if (localStorage.token && localStorage.name) {
  loginBtn.disabled = true
  informer.innerText = `Hi, ${localStorage.name}`
  addEventListener('load', ()=>body.switch('tasks'))
  getTasks()
} else {
  logoutBtn.disabled = true
  informer.innerText = `Hello, guest`
}

loginBtn.onclick = async function(e) {
  e.preventDefault()
  let answer = await (await fetch(location.href+"api/user/login", {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ mail: login.value, pass: pass.value })
  })).text()
  if (['false', "Cannot read property 'pass' of null"].includes(answer))
    return console.log("denied")
  answer = JSON.parse(answer)
  localStorage.token = answer.token
  informer.innerText = `Hi, ${localStorage.name = answer.name}`
  getTasks()
  loginBtn.disabled = true
  logoutBtn.disabled = false
  body.switch('tasks')
}

logoutBtn.onclick = function(e) {
  e.preventDefault()
  informer.innerText = `Bye, ${localStorage.name}`
  localStorage.name = localStorage.token = ""
  setTimeout(() => informer.innerText = `And who are you?`)
  loginBtn.disabled = false
  logoutBtn.disabled = true
  body.switch('auth')
}

askPrivData.onclick = async function(e) {
  e.preventDefault()
  if (!localStorage.token) return console.log("denied")
  console.log(await (await fetch(location.href+"api/user/data", {
    method: 'POST',
    headers: {"auth-token": localStorage.token}
  })).text())
}

addTask.onclick = async function() {
  const {_id} = await (await fetch(location.href+"api/addtask", {
    method: 'POST',
    headers: {
      "auth-token": localStorage.token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ task: taskToAdd.value })
  })).json()
  upd.tasks.push({task: taskToAdd.value, mins: 0, level: 0, _id})
}

taskToAdd.onkeydown = e => {
  if (e.which == 13) addTask.onclick()
}

async function getTasks() {
  const tasks = await (await fetch(location.href+"api/tasks", {
    method: 'GET',
    headers: { "auth-token": localStorage.token }
  })).json()
  upd.tasks.push(... tasks.map(task => ({...task, 
    progress: (task.mins % minsPerLevel)*100/minsPerLevel, custom:45})))
}

addEventListener('load', () => taskTable.render(() => 
  taskTable.querySelectorAll('tr').forEach((tr, i, trs) => tr.onclick = e => {
    trs.forEach(tr => tr.classList.remove('active'))
    tr.classList.add('active')
  })
))

onkeydown = e => {
  if (e.key == 'Delete' && e.target == document.body) {
    const active = taskTable.querySelector('.active')
    if (!active) return
    const activeId = active.dataset.id
    upd.tasks.splice(app.tasks.indexOf(app.tasks.find(task => 
      task._id == activeId)), 1)
    fetch(location.href+"api/rmtask", {
      method: 'POST',
      headers: {
        "auth-token": localStorage.token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: activeId })
    })
  }
}

function addMins(mins, id) {
  const task = upd.tasks.find(task => task._id == id)
    task.mins += mins
    task.level = Math.floor(task.mins / minsPerLevel)
    task.progress = (task.mins % minsPerLevel)*100/minsPerLevel

  fetch(location.href+"api/addmins", {
    method: 'POST',
    headers: {
      "auth-token": localStorage.token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id, mins })
  })
}

function setCustom(id, mins) {
  app.tasks.find(task => task._id == id).custom = mins
}