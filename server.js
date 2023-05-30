// import Notifier from ".";
const http = require("http")
const querystring = require('querystring');
const Notifier = require("./socket.js");
const url = require("url");
const client = require("./client.js");
const server = http.createServer(function (request, response) {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    URL = url.parse(request.url, true)
    if (request.method == "GET") {
        if (URL.pathname == '/isAlive') {
            query = URL.query
            if (notifier.isAlive(query.id)) {
                response.end(JSON.stringify({
                    "message": "alive"
                }));
                return
            }
            response.end(JSON.stringify({
                "message": "not alive"
            }));
            return;
        }
        else if (URL.path == '/checkAll') {
            notifier.checkAll();
            const arr = []
            for(const [name, value] of notifier.connections){
                arr.push(name)
            }
            response.end(JSON.stringify(arr));
            return
        }
        response.end(JSON.stringify({
            "message": "Something Went Wrong"
        }));
    }
    if (request.method == "POST") {
        let rawData = ''
        let parsedData
        request.on('data', (chunk) => {
            rawData += chunk
            return rawData
        })
        request.on('end', () => {
            parsedData = querystring.decode(rawData)
            if (URL.path == '/send') {
                notifier.send(parsedData.id, parsedData.message)
                response.end();
            }
            else if (URL.path == '/broadcast') {
                notifier.broadcast(parsedData.message)
                response.end();
            }
            else if(URL.path == '/newClient'){
                let clients = new client("ws://localhost:8081", parsedData.id);
                clientArray.push(clients)
                response.end();
            }
            else if(URL.path == '/ClientMessgae'){
                clientArray.forEach(client => {
                    if (client.username == parsedData.id){
                        client.send(parsedData.message)
                    }
                });
                response.end();
            }
            else {
                response.end(JSON.stringify({
                    "message": "Something Went Wrong"
                }));
            }
        })
    }
}).listen(8081);

const notifier = new Notifier();
const clientArray = [];
notifier.connect(server);

console.log('Server running at http://127.0.0.1:8081/');