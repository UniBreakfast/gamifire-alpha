if (localStorage.token && localStorage.name) {
  loginBtn.disabled = true
  informer.innerText = `Hi, ${localStorage.name}`
} else {
  logoutBtn.disabled = true
  informer.innerText = `Hello, guest`
}

loginBtn.onclick = async function(e) {
  e.preventDefault()
  let answer = await (await fetch("http://localhost:3000/api/user/login", {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ mail: login.value, pass: pass.value })
  })).text()
  if (['false', "Cannot read property 'pass' of null"].includes(answer))
    return console.log("denied")
  answer = JSON.parse(answer)
  localStorage.token = answer.token
  informer.innerText = `Hi, ${localStorage.name = answer.name}`
  loginBtn.disabled = true
  logoutBtn.disabled = false
  console.log(answer.name)
}

logoutBtn.onclick = function(e) {
  e.preventDefault()
  informer.innerText = `Bye, ${localStorage.name}`
  localStorage.name = localStorage.token = ""
  setTimeout(() => informer.innerText = `And who are you?`)
  loginBtn.disabled = false
  logoutBtn.disabled = true
}

askPrivData.onclick = async function(e) {
  e.preventDefault()
  if (!localStorage.token) return console.log("denied")
  console.log(await (await fetch("http://localhost:3000/api/user/data", {
    method: 'POST',
    headers: {"auth-token": localStorage.token}
  })).text())
}