const io = require('socket.io-client')
const ip = process.argv[2]
const { exec } = require('child_process')

let socket = io(ip, { query: 'type=controller' })
let working = false
let queue = []

function work(command) {
    if (working === true) {
	return null
    }
    console.log('aaa')
    working = true
    exec(command, () => {
    	console.log(command)
	setTimeout(() => {
	    working = false
	}, 1000)
    })
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

