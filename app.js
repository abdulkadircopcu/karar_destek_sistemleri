const express = require('express');
const path = require('path');
const dotenv = require('dotenv'); 
dotenv.config(); 

const app = express();
const port = process.env.PORT || 3000; 
const routes = require('./routes'); 
const { login } = require('./controller/controller');

app.use(express.static('public', { index: false })); 

app.use(express.json()); 

app.use('/', routes); 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});