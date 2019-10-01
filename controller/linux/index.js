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
    let pos = execSync(`xdotool getmouselocation`)
    console.log(pos)
    socket.emit('MousePos', `[${5}, ${10}]`)
})

socket.on('Controller', ({ type, value }) => {
    if (type == "KeyDown") {
        work(`xdotool keydown ${value}`)
        return null
    }
    if (type == "KeyUp") {
        work(`xdotool keyup ${value}`)
        return null
    }
    if (type === 'MouseMove') {
        let prefix = data.value[0] < 0 ? '--' : ''
        work(`xdotool --sync mousemove_relative ${prefix} ${value[0]} ${value[1]}`)
        return null
    }
    if (type == "MouseTo") {
        work(`xdotool --sync mousemove ${value[0]} ${value[1]}`)
        return null
    }
    if (type == "MouseEvent") {
        work(`xdotool click ${value}`)
        return null
    }
})
