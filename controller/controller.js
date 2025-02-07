const dbConn = require('../db/db_connection'); 

exports.getStats = async (req, res) => {
    try {
        console.log(`API /api/stats çağrıldı`);

        const [results1] = await dbConn.query('SELECT SUM(adet) AS totalOrders FROM siparisler'); 
        const [results2] = await dbConn.query('SELECT COUNT(forma_id) AS totalForms FROM formalar'); 
        const [results3] = await dbConn.query('SELECT SUM(fiyat) AS totalIncome FROM siparisler WHERE YEAR(tarih) = 2024'); 

        console.log("Veritabanı sorgu sonuçları:", results1, results2, results3);

        res.json({
            totalOrders: results1[0].totalOrders || 0, 
            totalForms: results2[0].totalForms || 0,   
            totalIncome: results3[0].totalIncome || 0 
        });
    } catch (err) {
        console.error("Veritabanı sorgu hatası:", err);
        res.status(500).send('Veritabanı hatası');
    }
};

exports.getSales = async (req, res) => {
    const year = req.query.year || new Date().getFullYear(); 
    try {
        console.log(`API /api/sales çağrıldı, yıl: ${year}`);
        const [monthlySalesResults] = await dbConn.query(
            'SELECT MONTH(tarih) AS month, SUM(adet) AS sales FROM siparisler WHERE YEAR(tarih) = ? GROUP BY MONTH(tarih)',
            [year]
        );

        const monthlySales = Array(12).fill(0);
        monthlySalesResults.forEach(row => {
            monthlySales[row.month - 1] = row.sales;
        });

        console.log("Aylık satış verileri:", monthlySales);
        res.json({ monthlySales });
    } catch (err) {
        console.error("Veritabanı sorgu hatası:", err);
        res.status(500).send('Veritabanı hatası');
    }
};

exports.getIncome = async (req, res) => {
    const year = req.query.year || new Date().getFullYear(); 
    try {
        console.log(`API /api/income çağrıldı, yıl: ${year}`);
        const [monthlyIncomeResults] = await dbConn.query(
            'SELECT MONTH(tarih) AS month, SUM(fiyat) AS income FROM siparisler WHERE YEAR(tarih) = ? GROUP BY MONTH(tarih)',
            [year]
        );

        const monthlyIncome = Array(12).fill(0);
        monthlyIncomeResults.forEach(row => {
            monthlyIncome[row.month - 1] = row.income;
        });

        console.log("Aylık gelir verileri:", monthlyIncome);
        res.json({ monthlyIncome });
    } catch (err) {
        console.error("Veritabanı sorgu hatası:", err);
        res.status(500).send('Veritabanı hatası');
    }
};

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

exports.getTeamSales = async (req, res) => {
    const year = req.query.year || new Date().getFullYear(); 
    try {
        const [results] = await dbConn.query('SELECT takim_ad, SUM(adet) AS sales FROM takimlar LEFT JOIN formalar ON takimlar.takim_id=formalar.takim_id LEFT JOIN siparisler ON formalar.forma_id=siparisler.forma_id WHERE YEAR(siparisler.tarih) = ? GROUP BY takim_ad', [year]);
        const teams = results.map(row => row.takim_ad);
        const sales = results.map(row => row.sales);
        res.json({ teams, sales });
    } catch (err) {
        console.error("Veritabanı sorgu hatası:", err);
        res.status(500).send('Veritabanı hatası');
    }
};

exports.getSizeSales = async (req, res) => {
    try {
        const [results] = await dbConn.query('SELECT beden, SUM(adet) AS sales FROM bedenler LEFT JOIN siparisler ON siparisler.beden_id=bedenler.beden_id GROUP BY beden');
        const sizes = results.map(row => row.beden);
        const sales = results.map(row => row.sales);
        res.json({ sizes, sales });
    } catch (err) {
        console.error("Veritabanı sorgu hatası:", err);
        res.status(500).send('Veritabanı hatası');
    }
};

exports.getPieChartData = async (req, res) => {
    try {
        const [results] = await dbConn.query('SELECT iller.sehir, SUM(siparisler.adet) AS toplam FROM iller LEFT JOIN sube ON sube.il_id=iller.il_id LEFT JOIN siparisler ON siparisler.il_id=iller.il_id GROUP BY iller.il_id ORDER BY toplam DESC');
        console.log("Sorgu Sonuçları:", results);
        const labels = results.map(row => row.sehir);
        const values = results.map(row => parseInt(row.toplam, 10)); 
        res.json({ labels, values });
    } catch (err) {
        console.error("Veritabanı sorgu hatası:", err);
        res.status(500).send('Veritabanı hatası');
    }
};

exports.getNewPieChartData = async (req, res) => {
    try {
        const [results] = await dbConn.query('SELECT iller.sehir, SUM(siparisler.adet) AS toplam FROM iller LEFT JOIN sube ON sube.il_id=iller.il_id LEFT JOIN siparisler ON siparisler.il_id=iller.il_id WHERE sube.sube_id IS NULL GROUP BY iller.il_id ORDER BY toplam DESC');
        console.log("Sorgu Sonuçları:", results);
        const labels = results.map(row => row.sehir);
        const values = results.map(row => parseInt(row.toplam, 10)); 
        res.json({ labels, values });
    } catch (err) {
        console.error("Veritabanı sorgu hatası:", err);
        res.status(500).send('Veritabanı hatası');
    }
};

exports.getCitySalesData = async (req, res) => {
    const year = req.query.year; 
    try {
        const [results] = await dbConn.query('SELECT iller.sehir, SUM(siparisler.adet) AS toplam FROM iller LEFT JOIN siparisler ON siparisler.il_id=iller.il_id WHERE YEAR(siparisler.tarih) = ? GROUP BY iller.il_id', [year]);
        console.log("Sorgu Sonuçları:", results);
        const labels = results.map(row => row.sehir);
        const values = results.map(row => parseInt(row.toplam, 10)); 
        res.json({ labels, values });
    } catch (err) {
        console.error("Veritabanı sorgu hatası:", err);
        res.status(500).send('Veritabanı hatası');
    }
};

exports.getCitySalesDataWithoutBranch = async (req, res) => {
    const year = req.query.year;
    try {
        const [results] = await dbConn.query('SELECT iller.sehir, SUM(siparisler.adet) AS toplam FROM iller LEFT JOIN siparisler ON siparisler.il_id=iller.il_id WHERE siparisler.sube_id IS NULL AND YEAR(siparisler.tarih) = ? GROUP BY iller.il_id ORDER BY toplam DESC', [year]);
        console.log("Sorgu Sonuçları:", results);
        const labels = results.map(row => row.sehir);
        const values = results.map(row => parseInt(row.toplam, 10)); 
        res.json({ labels, values });
    } catch (err) {
        console.error("Veritabanı sorgu hatası:", err);
        res.status(500).send('Veritabanı hatası');
    }
};

exports.getCitySalesPrediction = async (req, res) => {
    try {
        const [results] = await dbConn.query('SELECT iller.sehir, SUM(siparisler.adet) AS toplam FROM iller LEFT JOIN siparisler ON siparisler.il_id=iller.il_id WHERE YEAR(siparisler.tarih) = 2024 GROUP BY iller.il_id ORDER BY toplam DESC');
        console.log("Sorgu Sonuçları:", results);
        const labels = results.map(row => row.sehir);
        const values2024 = results.map(row => parseInt(row.toplam, 10)); 

        const predictedValues = values2024.map(value => Math.round(value * 1.1));

        res.json({ labels, values2024, predictedValues });
    } catch (err) {
        console.error("Veritabanı sorgu hatası:", err);
        res.status(500).send('Veritabanı hatası');
    }
};

exports.getCityMonthlySalesPrediction = async (req, res) => {
    const city = req.query.city; 
    try {
        const [results] = await dbConn.query('SELECT MONTH(siparisler.tarih) AS ay, SUM(siparisler.adet) AS toplam FROM siparisler LEFT JOIN iller ON siparisler.il_id=iller.il_id WHERE iller.sehir = ? AND YEAR(siparisler.tarih) = 2024 GROUP BY ay ORDER BY ay', [city]);
        console.log("Sorgu Sonuçları:", results);
        const labels = results.map(row => `Ay ${row.ay}`);
        const values2024 = results.map(row => parseInt(row.toplam, 10)); 

        const predictedValues = values2024.map(value => Math.round(value * 1.0));

        res.json({ labels, values2024, predictedValues });
    } catch (err) {
        console.error("Veritabanı sorgu hatası:", err);
        res.status(500).send('Veritabanı hatası');
    }
};