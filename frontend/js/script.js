//elementos de login
const login = document.querySelector('.login')
const loginForm = login.querySelector('.form_login')
const nomeLogin = login.querySelector('.nome_login')

//elementos de chat
const chat = document.querySelector('.chat')
const chatForm = chat.querySelector('.chat_form')
const mensagemChat = chat.querySelector('.mensagem')
const chat_message = chat.querySelector('.chat_mensagens')

let websocket 

const user = {id:"",name:"",color:""}

const colors = [
    "aqua",
    "blue",
    "blueviolet",
    "green",
    "gold",
    "olive",
    "palegreen"
]

const randomColor =  () =>{
    const randomIndex = Math.floor(Math.round(Math.random() * 6 ) )
    return colors[randomIndex]
}

const handLogin = (event) =>{    
    event.preventDefault()

    user.id = crypto.randomUUID().toString()
    user.name = nomeLogin.value
    user.color = randomColor()

    login.style.display = "none"
    chat.style.display = "flex"

    websocket = new WebSocket('ws://localhost:8085')
    websocket.onmessage = processMessage

}

const sendMessage = (event) =>{
    event.preventDefault()
    
    const message = {
        userId : user.id,
        userName : user.name,
        userColor : user.color,
        content : mensagemChat.value
    }

    websocket.send(JSON.stringify(message))
    mensagemChat.value = ''
}

const scrollScrenn = ()=>{
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
        
    })
}

const processMessage = ({data}) => {
    const {userId, userName, userColor, content} = JSON.parse([data])
    
    const mensagem = 
        userId == user.id 
        ? createdMessageSelf(content)
        : createdMessageOther(content,userName,userColor)
    
    chat_message.appendChild(mensagem)

    scrollScrenn()
}

const createdMessageSelf = (messagecontent) => {
    const div = document.createElement('div')
    div.classList.add('message_self')
    div.innerHTML = messagecontent

    return div
}

const createdMessageOther = (messagecontent, user, usercolor) => {
    const div = document.createElement('div')
    const span = document.createElement('span')

    div.classList.add('message_other')
    span.classList.add('person_name')

    span.innerHTML = user
    span.style.color = usercolor

    div.appendChild(span)
    div.innerHTML += messagecontent

    return div
}

loginForm.addEventListener("submit", handLogin)
chatForm.addEventListener("submit", sendMessage)