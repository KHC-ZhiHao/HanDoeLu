// ========================
//
// module
//

const fs = require('fs')
const os = require('os')
const env = require('./env.json')

// ========================
//
// core
//

const Action = require('./src/js/action')
const Server = require('./src/server')
const Controller = require('./src/js/controller')

// ========================
//
// server
//

const server = new Server(env.ip, env.port)

// ========================
//
// connection
//

// server.setSocketType('driver', (socket) => {
//     server.broadcast('config')
//     socket.on('control', data => {
//         server.broadcast('dashboard', data)
//     })
// })

// server.setSocketType('dashboard', (socket) => {
//     server.broadcast('config')
// })

// ========================
//
// broadcast
//

// server.addChannel('config', (emit) => {
//     emit('config', action.getConfig())
// })

// server.addChannel('dashboard', (emit, data) => {
//     emit('dashboard', data)
//     if (data.enable) {
//         action.update(data)
//     }
// })

// ========================
//
// apis
//

server.setRouter('getConfigs', (request, response) => {
    let files = fs.readdirSync('./src/configs').map(n => n.replace('.js', ''))
    response.send(files)
})

server.setRouter('getConfig', (request, response) => {
    response.send(server.getConfig())
})

server.setRouter('setConfig', (request, response) => {
    let name = request.query.name
    server.setConfig(name)
    response.send()
})

// ========================
//
// controller
//

// let osType = os.type()
// let controller = new Controller(server)
    
// if (osType === 'Windows_NT') {
//     controller.run('./controller/windows/Controller.exe')
// }

// if (osType === 'Darwin') {
//     controller.run(`node ${__dirname}/controller/linux/index.js`, 'exec')
// }

// if (osType === 'Linux') {
//     controller.run('node', [`${__dirname}/controller/linux/index.js`])
// }

// ========================
//
// action
//

// const action = new Action(controller)

// action.setScreen(env.width, env.height)

// action.addButtonEvent('MouseReset', [
//     function(value, action, controller) {
//         controller.mouseTo(action.screen.width / 2, action.screen.height / 2)
//     }
// ])

// action.addButtonEvent('MouseWheel', [
//     function(value, action, controller) {
//         controller.mouseWheel(value)
//     }
// ])

// action.addButtonEvent('MouseLeft', [
//     function(value, action, controller) {
//         controller.mouseEvent(0x0002)
//     },
//     function(value, action, controller) {
//         controller.mouseEvent(0x0004)
//     }
// ])

// action.addButtonEvent('MouseMiddle', [
//     function(value, action, controller) {
//         controller.mouseEvent(0x0020)
//     },
//     function(value, action, controller) {
//         controller.mouseEvent(0x0040)
//     }
// ])

// action.addButtonEvent('MouseRight', [
//     function(value, action, controller) {
//         controller.mouseEvent(0x0008)
//     },
//     function(value, action, controller) {
//         controller.mouseEvent(0x0010)
//     }
// ])

// action.addButtonEvent('Keyboard', [
//     function(value, action, controller) {
//         controller.keyDown(value)
//     },
//     function(value, action, controller) {
//         controller.keyUp(value)
//     }
// ])

// action.addButtonEvent('directInput', [
//     function(value, action, controller) {
//         controller.directInput(value)
//     }
// ])

// function setConfig(configUrl) {
//     if (require.cache[configUrl]) {
//         delete require.cache[configUrl]
//     }
//     let config = require(configUrl)
//     action.setConfig(config)
// }

// setConfig('./configs/LaserPen')

// controller.onOutput((data) => {
//     console.log(data.toString())
// })
