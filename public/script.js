document.addEventListener('DOMContentLoaded', () => {
    console.log("Sayfa yüklendi");

    // Kullanıcı bilgilerini yerel depolamadan al
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        if (window.location.pathname !== '/login.html') {
            const userNameElement = document.getElementById('user-name');
            if (userNameElement) {
                userNameElement.textContent = `${user.ad} ${user.soyad}`;
            }
        }
    } else {
        // Kullanıcı giriş yapmamışsa login.html sayfasına yönlendir
        if (window.location.pathname !== '/login.html') {
            window.location.href = 'login.html';
        }
    }

    let salesChart;
    let incomeChart;

    // İstatistikleri çekme
    const fetchStats = (year, chartType) => {
        const endpoint = chartType === 'sales' ? '/api/sales' : '/api/income';
        fetch(`${endpoint}?year=${year}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ağ yanıtı hatası');
                }
                return response.json();
            })
            .then(data => {
                console.log("API yanıtı alındı:", data);
                document.getElementById('stat1').textContent = data.stat1;
                document.getElementById('stat2').textContent = data.stat2;
                document.getElementById('stat3').textContent = data.stat3;

                if (chartType === 'sales') {
                    // Satış grafiği verilerini ayarla
                    const ctx = document.getElementById('salesChart').getContext('2d');
                    if (salesChart) {
                        salesChart.data.datasets[0].data = data.monthlySales;
                        salesChart.update();
                    } else {
                        salesChart = new Chart(ctx, {
                            type: 'bar',
                            data: {
                                labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
                                datasets: [{
                                    label: 'Aylık Satışlar',
                                    data: data.monthlySales, // Veritabanından gelen veriler
                                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                scales: {
                                    y: {
                                        beginAtZero: true
                                    }
                                },
                                plugins: {
                                    datalabels: {
                                        anchor: 'end',
                                        align: 'end',
                                        formatter: (value) => {
                                            return value.toLocaleString(); // Değerleri formatla
                                        }
                                    }
                                }
                            },
                            plugins: [ChartDataLabels] // ChartDataLabels eklentisini kullan
                        });
                    }
                } else if (chartType === 'income') {
                    // Gelir grafiği verilerini ayarla
                    const ctx = document.getElementById('incomeChart').getContext('2d');
                    if (incomeChart) {
                        incomeChart.data.datasets[0].data = data.monthlyIncome;
                        incomeChart.update();
                    } else {
                        incomeChart = new Chart(ctx, {
                            type: 'bar',
                            data: {
                                labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
                                datasets: [{
                                    label: 'Aylık Gelir',
                                    data: data.monthlyIncome, // Veritabanından gelen veriler
                                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                                    borderColor: 'rgba(153, 102, 255, 1)',
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                scales: {
                                    y: {
                                        beginAtZero: true
                                    }
                                },
                                plugins: {
                                    datalabels: {
                                        anchor: 'end',
                                        align: 'end',
                                        formatter: (value) => {
                                            return value.toLocaleString(); // Değerleri formatla
                                        }
                                    }
                                }
                            },
                            plugins: [ChartDataLabels] // ChartDataLabels eklentisini kullan
                        });
                    }
                }
            })
            .catch(error => {
                console.error('API isteği hatası:', error);
            });
    };

    if (window.location.pathname === '/index.html') {
        const yearSelectSales = document.getElementById('year-select-sales');
        yearSelectSales.addEventListener('change', (event) => {
            fetchStats(event.target.value, 'sales');
        });

        const yearSelectIncome = document.getElementById('year-select-income');
        yearSelectIncome.addEventListener('change', (event) => {
            fetchStats(event.target.value, 'income');
        });

        // Varsayılan yıl için istatistikleri çek
        fetchStats(yearSelectSales.value, 'sales');
        fetchStats(yearSelectIncome.value, 'income');

        // 2024 yılı gelirini sabit olarak göster
        fetch('/api/stats')
            .then(response => response.json())
            .then(data => {
                document.getElementById('stat3').textContent = data.stat3;
            })
            .catch(error => {
                console.error('API isteği hatası:', error);
            });
    }

    // Giriş formunu işleme
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Kullanıcı bilgilerini yerel depolamaya kaydet
                    fetch(`/api/user?username=${username}`)
                        .then(response => response.json())
                        .then(userData => {
                            localStorage.setItem('user', JSON.stringify(userData));
                            window.location.href = 'index.html';
                        });
                } else {
                    document.getElementById('message').textContent = data.message;
                }
            })
            .catch(error => {
                console.error('API isteği hatası:', error);
            });
        });
    }
});