const fs = require('fs')
const io = require('socket.io')
const http = require('http')
const querystring = require('querystring')

module.exports = class {

    constructor(ip, port = 80) {
        this.ip = ip
        this.id = Date.now() + Math.floor(Math.random() * 10000000)
        this.port = port
        this.apis = {}
        this.pages = {}
        this.public = './public'
        this.channels = {}
        this.initHttpServer()
        this.initWebSocketServer()
        console.log(`Server created.`)
    }

    broadcast(channelName, data) {
        this.channels[channelName](this.emitAll, data)
    }

    addChannel(name, action) {
        this.channels[name] = action
    }

    writeResponse(response, string) {
        response.write(string)
        response.end()
    }

    initHttpServer() {
        this.server = http.createServer((request, response) => {
            let split = request.url.split('?')
            let url = split[0]
            let query = querystring.parse(split[1])
            let page = this.pages[url]
            if (page) {
                response.writeHead(200, { 'Content-Type': 'text/html' })
                this.getStaticPage(page).then(html => this.writeResponse(response, html))
                return null
            }
            let api = this.apis[url]
            if (api) {
                api(request, response, query)
                return null
            }
            let publicUrl = this.public +url
            if (publicUrl) {
                this.getPublicFile(publicUrl)
                    .then(data => this.writeResponse(response, data))
                    .catch(data => this.writeResponse(response, ':('))
                return null
            }
        })
        this.server.listen(this.port, this.ip)
    }

    initWebSocketServer() {
        this.io = io(this.server)
        this.emitAll = this.io.emit.bind(this.io)
    }

    setSocketType(typeName, action) {
        this.io.on('connection', (socket) => {
            let type = socket.handshake.query.type
            if (type === typeName) {
                action(socket)
            }
        })
    }

    getPublicFile(url) {
        return new Promise((resolve, reject) => {
            fs.readFile(url, (err, data) => {
                if (err) return reject(err)
                resolve(data)
            })
        })
    }

    getStaticPage(url) {
        return new Promise((resolve, reject) => {
            fs.readFile(url, { encoding: 'utf8' }, (err, html) => {
                if (err) return reject(err)
                resolve(html)
            })
        })
    }

    addApi(url, callback) {
        console.log(`Add API : http://${this.ip}/api${url}`)
        this.apis['/api' + url] = callback
    }

    addStaticPage(url, pageUrl) {
        console.log(`Add Page : http://${this.ip}${url}`)
        this.pages[url] = pageUrl
    }

}
