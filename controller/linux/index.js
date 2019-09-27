const io = require('socket.io-client')
const ip = process.argv[2]
const { exec } = require('child_process')
  
let socket = io(ip, { query:'type=controller' })

socket.on('GetMousePos', () => {
    socket.emit('MousePos', `[${5}, ${10}]`)
})

socket.on('Controller', (json) => {
    let data = JSON.parse(json)
    if (type == 'KeyDown') {
        exec(`xdotool key ${data.value}`)
        return null
    }
    if (type == 'MouseMove') {
        exec(`xdotool mousemove ${data.value[0]} ${data.value[1]}`)
        return null
    }
})