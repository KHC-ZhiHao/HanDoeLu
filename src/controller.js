const os = require('os')
const childProcess = require('child_process');

module.exports = class {
    constructor(server) {
        this.server = server
        this.process = null
    }

    get host() {
        return `http://${this.server.host}`
    }

    get params() {
        return this.server.config.params
    }

    get width() {
        return this.server.width
    }

    get height() {
        return this.server.height
    }

    start() {
        let osType = os.type()
        if (osType === 'Windows_NT') {
            this.process = childProcess.spawn(`${__dirname}/controller/windows/Controller.exe`, [this.host])
        }
        if (osType === 'Darwin') {
            throw new Error('Not support macos.')
        }
        if (osType === 'Linux') {
            this.process = childProcess.spawn('node', [`${__dirname}/controller/linux/index.js`, this.host])
        }
    }

    emit(type, value) {
        this.server.socket.emit('Controller', {
            type,
            value
        })
    }

    keyDown(value) {
        this.emit('KeyDown', value)
    }

    keyUp(value) {
        this.emit('KeyUp', value)
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
