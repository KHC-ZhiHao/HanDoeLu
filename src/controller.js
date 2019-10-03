const os = require('os')
const childProcess = require('child_process');

module.exports = class {
    constructor(server) {
        this.server = server
        this.osType = os.type()
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
        if (this.osType === 'Windows_NT') {
            this.process = childProcess.spawn(`${__dirname}/controller/windows/Controller.exe`, [this.host])
        }
        if (this.osType === 'Darwin') {
            throw new Error('Not support macos.')
        }
        if (this.osType === 'Linux') {
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

    mouseLeftDown() {
        if (this.osType === 'Windows_NT') {
            this.windowsMouseEvent(0x0002)
        }
        if (this.osType === 'Linux') {
            this.emit('MouseDown', 1)
        }
    }

    mouseLeftUp() {
        if (this.osType === 'Windows_NT') {
            this.windowsMouseEvent(0x0004)
        }
        if (this.osType === 'Linux') {
            this.emit('MouseUp', 1)
        }
    }

    mouseMiddleDown() {
        if (this.osType === 'Windows_NT') {
            this.windowsMouseEvent(0x0020)
        }
        if (this.osType === 'Linux') {
            this.emit('MouseDown', 2)
        }
    }

    mouseMiddleUp() {
        if (this.osType === 'Windows_NT') {
            this.windowsMouseEvent(0x0040)
        }
        if (this.osType === 'Linux') {
            this.emit('MouseUp', 2)
        }
    }

    mouseRightDown() {
        if (this.osType === 'Windows_NT') {
            this.windowsMouseEvent(0x0008)
        }
        if (this.osType === 'Linux') {
            this.emit('MouseDown', 3)
        }
    }

    mouseRightUp() {
        if (this.osType === 'Windows_NT') {
            this.windowsMouseEvent(0x0010)
        }
        if (this.osType === 'Linux') {
            this.emit('MouseUp', 3)
        }
    }

    // windows
    
    windowsMouseEvent(value) {
        this.emit('MouseEvent', Math.floor(value))
    }

    windowsMouseWheel(scroll) {
        this.emit('MouseWheel', Math.floor(scroll))
    }

    windowsDirectInput(value) {
        this.emit('DirectInput', value)
    }

    // linux

    linuxClick(value) {
        this.emit('MouseClick', value)
    }

    linuxMouseUp(value) {
        this.emit('MouseUp', value)
    }

    linuxMouseDown(value) {
        this.emit('MouseDown', value)
    }
}
