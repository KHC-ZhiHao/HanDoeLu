const childProcess = require('child_process');

module.exports = class {

    constructor(server) {
        this.spawn = null
        this.server = server
        this.socketChannel = 'Controller'
        this.initSocket()
    }

    run(url) {
        this.spawn = childProcess.spawn(url, [`http://${this.server.ip}`])
    }

    onInput(callback) {
        this.spawn.stdip.on('data', callback)
    }

    onOutput(callback) {
        this.spawn.stdout.on('data', callback)
    }

    initSocket() {
        this.mousePosListener = []
        this.server.setSocketType('controller', (socket) => {
            this.socket = socket
            this.initGetMousePos()
        })
    }

    initGetMousePos() {
        this.socket.on('MousePos', (data) => {
            let pos = JSON.parse(data)
            for (let event of this.mousePosListener) {
                event(pos[0], pos[1])
            }
        })
    }

    getMousePos(callback) {
        if (this.socket) {
            this.socket.emit('GetMousePos')
            this.mousePosListener.push(callback)
        }
    }

    emit(type, value) {
        this.server.emitAll(this.socketChannel, { type, value })
    }

    keyDown(value) {
        this.emit('KeyDown', value)
    }

    keyUp(value) {
        this.emit('KeyUp', value)
    }

    directInput(value) {
        this.emit('DirectInput', value)
    }

    mouseMove(x, y) {
        this.emit('MouseMove', [Math.floor(x), Math.floor(y)])
    }

    mouseTo(x, y) {
        this.emit('MouseTo', [Math.floor(x), Math.floor(y)])
    }

    mouseEvent(value) {
        this.emit('MouseEvent', Math.floor(value))
    }

    mouseWheel(scroll) {
        this.emit('MouseWheel', Math.floor(scroll))
    }

}