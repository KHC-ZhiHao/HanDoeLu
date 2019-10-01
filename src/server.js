const fs = require('fs')
const io = require('socket.io')
const http = require('http')
const express = require('express')

module.exports = class {
    constructor(ip, port = 3000) {
        this.ip = ip
        this.port = port
        this.config = null
        this.initHttpServer()
        console.log(`Server created.`)
    }

    get host() {
        return this.ip + ':' + this.port
    }

    initHttpServer() {
        this.app = express()
        this.server = http.createServer(this.app)
        this.io = io(this.server)
        this.app.use(express.static(`${__dirname}/page`))
        this.app.get('/driver', function(req, res) {
            res.sendFile(`${__dirname}/page/index.html`)
        })
        this.app.get('/setting', function(req, res) {
            res.sendFile(`${__dirname}/page/index.html`)
        })
        this.app.listen(this.port, this.ip, () => {
            console.log(`http://${this.host}`)
        })
    }

    setConfig(name) {
        let path = `${__dirname}/configs/${name}.js`
        if (require.cache[path]) {
            delete require.cache[path]
        }
        this.config = require(path)
    }

    getConfig() {
        return this.config
    }

    setRouter(name, callback) {
        console.log(`API : http://${this.host}/api/${name}`)
        this.app.get(`/api/${name}`, callback)
    }
}
