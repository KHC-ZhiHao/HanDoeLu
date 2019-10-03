const io = require('socket.io-client')
const ip = process.argv[2]
const { exec } = require('child_process')

let socket = io(ip, { query: 'type=controller' })
let moving = false

socket.on('GetMousePos', () => {
    let pos = execSync(`xdotool getmouselocation`)
    console.log(pos)
    socket.emit('MousePos', `[${5}, ${10}]`)
})

socket.on('Controller', ({ type, value }) => {
    if (type == "KeyDown") {
        exec(`xdotool keydown ${value}`)
        return null
    }
    if (type == "KeyUp") {
        exec(`xdotool keyup ${value}`)
        return null
    }
    if (type === 'MouseMove') {
        if (moving === true) {
            return null
        }
        moving = true
        let prefix = value[0] < 0 ? '--' : ''
        exec(`xdotool mousemove_relative --sync ${prefix} ${value[0]} ${value[1]}`, () => {
            moving = false
        })
        return null
    }
    if (type == "MouseTo") {
        exec(`xdotool mousemove --sync ${value[0]} ${value[1]}`)
        return null
    }
    if (type == "MouseEvent") {
        exec(`xdotool click ${value}`)
        return null
    }
})
