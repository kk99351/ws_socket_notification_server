const server = "ws://localhost:8081"
const username = "kk99352"
const WebSocket = require('ws')
let notifier = new WebSocket(`${server}/?username=${username}`)

notifier.on('error', console.error);
notifier.on('open', function open() {
    notifier.send('something');
  });
notifier.on('message', function message(data) {
    console.log('received: %s', data);
  });

