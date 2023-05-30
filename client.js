const WebSocket = require('ws')

class client {
    constructor(server, username){
        this.username = username
        this.notifier = new WebSocket((`${server}/?username=${username}`))
        this.notifier.on('error', (error) =>{
            console.log('error by %s: %s', username, error);
        });
        this.notifier.on('message', function message(data) {
            console.log('received by %s: %s', username, data);
        });
    }

    send(message){
        this.notifier.on('open', function open() {
            this.notifier.send(message);
          });
    }
}

module.exports = client