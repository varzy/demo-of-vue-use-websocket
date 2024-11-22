import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 9090 })

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    console.log('received: %s', data)
  })

  ws.send('Hello from server!')
})

console.log('WebSocket server is running on port 9090')
