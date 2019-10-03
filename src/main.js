const fs = require('fs')

const Server = require('./server')
const Controller = require('./controller')

module.exports = function(env) {
    const server = new Server(env)
    const controller = new Controller(server)

    // socket

    server
        .socket
        .on('connection', function(socket){
            socket.on('driver-update', data => {
                if (server.config.update) {
                    server.config.update(data, controller)
                }
            })
            socket.on('driver-down', index => {
                if (server.config.button[index].input) {
                    server.config.button[index].input(controller)
                }
            })
            socket.on('driver-up', index => {
                if (server.config.button[index].output) {
                    server.config.button[index].output(controller)
                }
            })
        })

    // router

    server.setStaticRouter('/driver')
    server.setStaticRouter('/setting')

    server.setRouter('getConfigs', (request, response) => {
        let files = fs.readdirSync(`${__dirname}/configs`).map(n => n.replace('.js', ''))
        response.send(files)
    })

    server.setRouter('getConfigDetail', (request, response) => {
        response.send(server.getConfig(request.query.name))
    })

    server.setRouter('getConfig', (request, response) => {
        response.send(server.config)
    })

    server.setRouter('setConfig', (request, response) => {
        server.setConfig(request.query.name, JSON.parse(request.query.params))
        response.send()
        controller.start()
    })
}
