const dbConn = require('../db/db_connection'); // db_connection.js dosyasını dahil edin

// /api/stats endpoint'i için kontrol fonksiyonu
exports.getStats = async (req, res) => {
    try {
        console.log("API /api/stats çağrıldı");
        const [results] = await dbConn.query('SELECT COUNT(siparis_id) AS count FROM siparisler');
        console.log("Veritabanı sorgu sonuçları:", results);
        res.json({
            stat1: results[0].count,
            stat2: results[0].count, // Örnek olarak aynı veriyi kullanıyoruz
            stat3: results[0].count  // Örnek olarak aynı veriyi kullanıyoruz
        });
    } catch (err) {
        console.error("Veritabanı sorgu hatası:", err);
        res.status(500).send('Veritabanı hatası');
    }
};

// /api/login endpoint'i için kontrol fonksiyonu
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const [results] = await dbConn.query('SELECT * FROM kullanici WHERE kullanici_adi = ? AND sifre = ?', [username, password]);
        if (results.length > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Geçersiz kullanıcı adı veya şifre' });
        }
    } catch (err) {
        console.error("Veritabanı sorgu hatası:", err);
        res.status(500).send('Veritabanı hatası');
    }
};

// /api/user endpoint'i için kontrol fonksiyonu
exports.getUser = async (req, res) => {
    try {
        const [results] = await dbConn.query('SELECT ad, soyad FROM kullanici WHERE kullanici_adi = ?', [req.query.username]);
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send('Kullanıcı bulunamadı');
        }
    } catch (err) {
        console.error("Veritabanı sorgu hatası:", err);
        res.status(500).send('Veritabanı hatası');
    }
};