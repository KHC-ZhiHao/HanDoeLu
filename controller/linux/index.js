const io = require('socket.io-client')
const ip = process.argv[2]
const { execSync } = require('child_process')
  
let socket = io(ip, { query:'type=controller' })

socket.on('GetMousePos', () => {
    socket.emit('MousePos', `[${5}, ${10}]`)
})

socket.on('Controller', (data) => {
    if (data.type === 'KeyDown') {
        exec(`xdotool key ${data.value}`)
        return null
    }
    if (data.type === 'MouseMove') {
	console.log('move', data)
	let prefix = data.value[0] < 0 ? '--' : ''
try {
        
} catch(e) { console.log(e) }
        return null
    }
})

setInterval(() => {
	console.log('ccc')
}, 1000)
