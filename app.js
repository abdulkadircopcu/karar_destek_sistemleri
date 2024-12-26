const express = require('express');
const path = require('path');
const dotenv = require('dotenv'); // dotenv modülünü dahil edin
dotenv.config(); // .env dosyasını yükleyin

const app = express();
const port = process.env.PORT || 3000; // .env dosyasındaki PORT değişkenini kullanın
const routes = require('./routes'); // routes klasörünü dahil edin
const { login } = require('./controller/controller');

app.use(express.static('public', { index: false })); // index.html yüklenmesini devre dışı bırakın

app.use(express.json()); // JSON gövdesini işlemek için

app.use('/', routes); // routes klasörünü kullan

// /login route'u login.html sayfasına yönlendirme
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});