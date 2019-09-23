// ========================
//
// module
//

const fs = require('fs')
const os = require('os')

// ========================
//
// core
//

const Env = require('./env.js')
const Action = require('./js/action')
const Server = require('./js/server')
const Controller = require('./js/controller')

// ========================
//
// server
//

let server = new Server(Env.ip)
    server.addStaticPage('/driver', './public/driver.html')
    server.addStaticPage('/dashboard', './public/dashboard.html')

// ========================
//
// connection
//

server.setSocketType('driver', (socket) => {
    server.broadcast('config')
    socket.on('control', data => {
        server.broadcast('dashboard', data)
    })
})

server.setSocketType('dashboard', (socket) => {
    server.broadcast('config')
})

// ========================
//
// broadcast
//

server.addChannel('config', (emit) => {
    emit('config', action.getConfig())
})

server.addChannel('dashboard', (emit, data) => {
    emit('dashboard', data)
    if (data.enable) {
        action.update(data)
    }
})

// ========================
//
// apis
//

server.addApi('/getConfigs', (request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    server.writeResponse(response, JSON.stringify(fs.readdirSync('./configs')).replace(/\.js/g, ''))
})

server.addApi('/setConfig', (request, response, query) => {
    setConfig(`./configs/${query.name}.js`)
    server.broadcast('config')
    server.writeResponse(response, '')
})

// ========================
//
// controller
//

let osType = os.type()
let controller = new Controller(server)
    
if (osType === 'Windows_NT') {
    controller.run('./controller/windows/Controller.exe')
}

if (osType === 'Darwin') {
    // do mac os
}

if (osType === 'Linux') {
    // do linux os
}

// ========================
//
// action
//

const action = new Action(controller)

action.setScreen(1920, 1080)

action.addButtonEvent('MouseReset', [
    function(value, action, controller) {
        controller.mouseTo(action.screen.width / 2, action.screen.height / 2)
    }
])

action.addButtonEvent('MouseWheel', [
    function(value, action, controller) {
        controller.mouseWheel(value)
    }
])

action.addButtonEvent('MouseLeft', [
    function(value, action, controller) {
        controller.mouseEvent(0x0002)
    },
    function(value, action, controller) {
        controller.mouseEvent(0x0004)
    }
])

action.addButtonEvent('MouseMiddle', [
    function(value, action, controller) {
        controller.mouseEvent(0x0020)
    },
    function(value, action, controller) {
        controller.mouseEvent(0x0040)
    }
])

action.addButtonEvent('MouseRight', [
    function(value, action, controller) {
        controller.mouseEvent(0x0008)
    },
    function(value, action, controller) {
        controller.mouseEvent(0x0010)
    }
])

action.addButtonEvent('Keyboard', [
    function(value, action, controller) {
        controller.keyDown(value)
    },
    function(value, action, controller) {
        controller.keyUp(value)
    }
])

action.addButtonEvent('directInput', [
    function(value, action, controller) {
        controller.directInput(value)
    }
])

function setConfig(configUrl) {
    if (require.cache[configUrl]) {
        delete require.cache[configUrl]
    }
    let config = require(configUrl)
    action.setConfig(config)
}

setConfig('./configs/LaserPen')

controller.onOutput((data) => {
    console.log(data.toString())
})