const io = require('socket.io')
const http = require('http')
const express = require('express')

module.exports = class {
    constructor({ ip, port, width, height }) {
        this.ip = ip
        this.port = port || 3000
        this.width = width
        this.height = height
        this.config = null
        this.initHttpServer()
        console.log(`Server created.`)
    }

    get host() {
        return this.ip + ':' + this.port
    }

    initHttpServer() {
        this.app = express()
        this.app.use(express.static(`${__dirname}/view`))
        this.server = http.createServer(this.app)
        this.socket = io(this.server)
        this.server.listen(this.port, this.ip, () => {
            console.log(`http://${this.host}`)
        })
    }

    setStaticRouter(path) {
        this.app.get(path, function(req, res) {
            res.sendFile(`${__dirname}/view/index.html`)
        })
    }

    setConfig(name, params) {
        this.config = this.getConfig(name)
        this.config.params = this.config.params || {}
        Object.assign(this.config.params, params)
    }

    getConfig(name) {
        let path = `${__dirname}/configs/${name}.js`
        if (require.cache[path]) {
            delete require.cache[path]
        }
        return require(path)
    }

    setRouter(name, callback) {
        console.log(`API : http://${this.host}/api/${name}`)
        this.app.get(`/api/${name}`, callback)
    }
}
