const io = require('socket.io-client')
const ip = process.argv[2]
const { execSync } = require('child_process')

let socket = io(ip, { query: 'type=controller' })
let working = false

function work(command) {
    if (working === true) {
        return null
    }
    working = true
    execSync(command)
    working = false
}

socket.on('GetMousePos', () => {
    socket.emit('MousePos', `[${5}, ${10}]`)
})

socket.on('Controller', (data) => {
    if (data.type === 'MouseMove') {
        let prefix = data.value[0] < 0 ? '--' : ''
        work(`xdotool mousemove_relative ${prefix} ${data.value[0]} ${data.value[1]}`)
        return null
    }
})

setInterval(() => {
    console.log('ccc')
}, 1000)
