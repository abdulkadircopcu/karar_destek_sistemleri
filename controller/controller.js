const dbConn = require('../db/db_connection'); // db_connection.js dosyasını dahil edin

// /api/stats endpoint'i için kontrol fonksiyonu
exports.getStats = async (req, res) => {
    const year = 2024; // Yıl parametresini 2024 olarak sabitle
    try {
        console.log(`API /api/stats çağrıldı, yıl: ${year}`);
        const [results1] = await dbConn.query('SELECT SUM(adet) AS total FROM siparisler');
        const [results2] = await dbConn.query('SELECT COUNT(formalar.forma_id) AS count FROM formalar');
        const [results3] = await dbConn.query('SELECT SUM(fiyat) AS total FROM siparisler WHERE YEAR(siparisler.tarih) = ?', [year]);
        console.log("Veritabanı sorgu sonuçları:", results1, results2, results3);
        res.json({
            stat1: results1[0].total,
            stat2: results2[0].count,
            stat3: results3[0].total
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