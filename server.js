// 13 lignes, aucune dépendance hors "ws"
import { WebSocketServer } from 'ws';
import http from 'http';
import fs from 'fs/promises';

const PORT = 3000;
const log = (type, data) =>
    fs.appendFile('chat.log', `${Date.now()}|${type}|${JSON.stringify(data)}\n`);

const server = http.createServer(async (req, res) => {
    // sert index.html (GET /)
    const page = await fs.readFile('./index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' }).end(page);
});
const wss = new WebSocketServer({ server });
wss.on('connection', ws => {
    ws.on('message', raw => {
        const msg = raw.toString().slice(0, 500); // hard-limit anti-spam
        log('msg', msg);
        wss.clients.forEach(c => c.readyState === 1 && c.send(msg));
    });
});
server.listen(PORT, () => console.log('chatroom up on', PORT));
