const dbConn = require('../db/db_connection'); // db_connection.js dosyasını dahil edin

// /api/stats endpoint'i için kontrol fonksiyonu
exports.getStats = async (req, res) => {
    const year = req.query.year || new Date().getFullYear(); // Yıl parametresini al, yoksa mevcut yılı kullan
    try {
        console.log(`API /api/stats çağrıldı, yıl: ${year}`);
        const [results1] = await dbConn.query('SELECT SUM(adet) AS total FROM siparisler');
        const [results2] = await dbConn.query('SELECT COUNT(formalar.forma_id) AS count FROM formalar');
        const [results3] = await dbConn.query('SELECT SUM(fiyat) AS total FROM siparisler WHERE YEAR(siparisler.tarih) = ?', [year]);
        const [monthlyIncomeResults] = await dbConn.query('SELECT MONTH(tarih) AS month, SUM(fiyat) AS income FROM siparisler WHERE YEAR(tarih) = ? GROUP BY MONTH(tarih)', [year]);
        
        // Aylık gelir verilerini hazırlayın
        const monthlyIncome = Array(12).fill(0);
        monthlyIncomeResults.forEach(row => {
            monthlyIncome[row.month - 1] = row.income;
        });

        console.log("Veritabanı sorgu sonuçları:", results1, results2, results3, monthlyIncomeResults);
        res.json({
            stat1: results1[0].total,
            stat2: results2[0].count,
            stat3: results3[0].total,
            monthlyIncome: monthlyIncome // Aylık gelir verilerini ekleyin
        });
    } catch (err) {
        console.error("Veritabanı sorgu hatası:", err);
        res.status(500).send('Veritabanı hatası');
    }
};

// /api/sales endpoint'i için kontrol fonksiyonu
exports.getSales = async (req, res) => {
    const year = req.query.year || new Date().getFullYear(); // Yıl parametresini al, yoksa mevcut yılı kullan
    try {
        console.log(`API /api/sales çağrıldı, yıl: ${year}`);
        const [results1] = await dbConn.query('SELECT SUM(adet) AS total FROM siparisler');
        const [results2] = await dbConn.query('SELECT COUNT(formalar.forma_id) AS count FROM formalar');
        const [results3] = await dbConn.query('SELECT SUM(adet) AS total FROM siparisler WHERE YEAR(siparisler.tarih) = ?', [year]);
        const [monthlySalesResults] = await dbConn.query('SELECT MONTH(tarih) AS month, SUM(adet) AS sales FROM siparisler WHERE YEAR(tarih) = ? GROUP BY MONTH(tarih)', [year]);
        
        // Aylık satış verilerini hazırlayın
        const monthlySales = Array(12).fill(0);
        monthlySalesResults.forEach(row => {
            monthlySales[row.month - 1] = row.sales;
        });

        console.log("Veritabanı sorgu sonuçları:", results1, results2, results3, monthlySalesResults);
        res.json({
            stat1: results1[0].total,
            stat2: results2[0].count,
            stat3: results3[0].total,
            monthlySales: monthlySales // Aylık satış verilerini ekleyin
        });
    } catch (err) {
        console.error("Veritabanı sorgu hatası:", err);
        res.status(500).send('Veritabanı hatası');
    }
};

// /api/income endpoint'i için kontrol fonksiyonu
exports.getIncome = async (req, res) => {
    const year = req.query.year || new Date().getFullYear(); // Yıl parametresini al, yoksa mevcut yılı kullan
    try {
        console.log(`API /api/income çağrıldı, yıl: ${year}`);
        const [results1] = await dbConn.query('SELECT SUM(adet) AS total FROM siparisler');
        const [results2] = await dbConn.query('SELECT COUNT(formalar.forma_id) AS count FROM formalar');
        const [results3] = await dbConn.query('SELECT SUM(fiyat) AS total FROM siparisler WHERE YEAR(siparisler.tarih) = ?', [year]);
        const [monthlyIncomeResults] = await dbConn.query('SELECT MONTH(tarih) AS month, SUM(fiyat) AS income FROM siparisler WHERE YEAR(tarih) = ? GROUP BY MONTH(tarih)', [year]);
        
        // Aylık gelir verilerini hazırlayın
        const monthlyIncome = Array(12).fill(0);
        monthlyIncomeResults.forEach(row => {
            monthlyIncome[row.month - 1] = row.income;
        });

        console.log("Veritabanı sorgu sonuçları:", results1, results2, results3, monthlyIncomeResults);
        res.json({
            stat1: results1[0].total,
            stat2: results2[0].count,
            stat3: results3[0].total,
            monthlyIncome: monthlyIncome // Aylık gelir verilerini ekleyin
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