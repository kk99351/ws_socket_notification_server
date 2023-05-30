const url = require('url');
const {Server} = require('ws')

class Notifier {
    constructor(){
        this.connections = new Map()
    }

    connect (server){
        this.server = new Server({noServer: true})
        this.interval = setInterval(this.checkAll.bind(this), 10000)
        this.server.on('close', this.close.bind(this))
        this.server.on('connection', this.add.bind(this))
        server.on('upgrade', (request, socket, head) => {
            const id = url.parse(request.url, true).query.username
            id ? this.server.handleUpgrade(request, socket, head, ws => 
                this.server.emit('connection', id, ws)) : socket.destroy()
        })
    }

    add(id,socket){
        socket.isAlive = true
        socket.on('pong', () => socket.isAlive = true)
        socket.on('close', this.remove.bind(this,id))
        this.connections.set(id, socket)
    }

    send(id, message){
        const connection = this.connections.get(id)
        connection.send(JSON.stringify(message))
    }

    broadcast (message) {
        this.connections.forEach(connection => 
            connection.send(JSON.stringify(message))    
        )
    }

    isAlive(id){
        return !!this.connections.get(id)
    }

    checkAll(){
        this.connections.forEach(connection => {
            if(!connection.isAlive){
                return connection.terminate()
            }
            connection.isAlive = false
            connection.ping('')
        })
    }

    remove(id){
        this.connections.delete(id)
    }

    close(){
        clearInterval(this.interval)
    }
}

module.exports = Notifier