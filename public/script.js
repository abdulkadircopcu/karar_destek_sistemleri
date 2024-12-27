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
    let teamSalesChart;
    let sizeSalesChart;
    let pieChart;
    let newPieChart;

    // Yıllara göre satış ve gelir verilerini al
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
                console.log(`${chartType} verileri alındı:`, data);

                if (chartType === 'sales') {
                    // Satış grafiği güncelle
                    const ctx = document.getElementById('salesChart').getContext('2d');
                    if (salesChart) {
                        salesChart.data.datasets[0].data = data.monthlySales;
                        salesChart.update();
                    } else {
                        salesChart = new Chart(ctx, {
                            type: 'line',
                            data: {
                                labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
                                datasets: [{
                                    label: 'Aylık Satışlar',
                                    data: data.monthlySales,
                                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    borderWidth: 1,
                                    fill: false
                                }]
                            },
                            options: {
                                scales: {
                                    y: {
                                        beginAtZero: true
                                    }
                                }
                            }
                        });
                    }
                } else if (chartType === 'income') {
                    // Gelir grafiği güncelle
                    const ctx = document.getElementById('incomeChart').getContext('2d');
                    if (incomeChart) {
                        incomeChart.data.datasets[0].data = data.monthlyIncome;
                        incomeChart.update();
                    } else {
                        incomeChart = new Chart(ctx, {
                            type: 'line',
                            data: {
                                labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
                                datasets: [{
                                    label: 'Aylık Gelir',
                                    data: data.monthlyIncome,
                                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                                    borderColor: 'rgba(153, 102, 255, 1)',
                                    borderWidth: 1,
                                    fill: false
                                }]
                            },
                            options: {
                                scales: {
                                    y: {
                                        beginAtZero: true
                                    }
                                }
                            }
                        });
                    }
                }
            })
            .catch(error => {
                console.error('API isteği hatası:', error);
            });
    };

    // Takımlara göre satış verilerini al
    const fetchTeamSales = (year) => {
        fetch(`/api/team-sales?year=${year}`)
            .then(response => response.json())
            .then(data => {
                const ctx = document.getElementById('teamSalesChart').getContext('2d');
                if (teamSalesChart) {
                    teamSalesChart.data.datasets[0].data = data.sales;
                    teamSalesChart.update();
                } else {
                    teamSalesChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: data.teams,
                            datasets: [{
                                label: 'Takımlara Göre Satış Sayısı',
                                data: data.sales,
                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Takımlara göre satış verisi alınamadı:', error);
            });
    };

    // Bedenlere göre satış verilerini al
    const fetchSizeSales = () => {
        fetch('/api/size-sales')
            .then(response => response.json())
            .then(data => {
                const ctx = document.getElementById('sizeSalesChart').getContext('2d');
                if (sizeSalesChart) {
                    sizeSalesChart.data.datasets[0].data = data.sales;
                    sizeSalesChart.update();
                } else {
                    sizeSalesChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: data.sizes,
                            datasets: [{
                                label: 'Bedenlere Göre Satış Sayısı',
                                data: data.sales,
                                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                                borderColor: 'rgba(255, 206, 86, 1)',
                                borderWidth: 1,
                                fill: false
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Bedenlere göre satış verisi alınamadı:', error);
            });
    };
    // Statik verileri almak için fetch fonksiyonu
    const fetchStatsOverview = () => {
        fetch('/api/stats')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ağ hatası');
                }
                return response.json();
            })
            .then(data => {
                console.log('Genel istatistikler:', data);
                document.getElementById('stat1').textContent = data.totalOrders || 0; // Toplam sipariş adedi
                document.getElementById('stat2').textContent = data.totalForms || 0;  // Toplam forma sayısı
                document.getElementById('stat3').textContent = `${data.totalIncome || 0} TL`; // 2024 yılı geliri
            })
            .catch(error => {
                console.error('Stats API isteği hatası:', error);
            });
    };
    
    // Pasta grafiği verilerini al
    const fetchPieChartData = () => {
        fetch('/api/pie-chart-data')
            .then(response => response.json())
            .then(data => {
                const ctx = document.getElementById('pieChart').getContext('2d');
                pieChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: data.labels,
                        datasets: [{
                            data: data.values, // Buradaki veriyi kontrol edin
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const dataset = context.dataset;
                                        const dataIndex = context.dataIndex;
                                        const value = dataset.data[dataIndex];
                                        const total = dataset.data.reduce((acc, val) => acc + val, 0);
                                        const percentage = total > 0 ? ((value / total) * 100).toFixed(2) : 0;
                
                                        return `${context.label}: ${value} (${percentage}%)`;
                                    }
                                }
                            }
                        }
                    }
                });
                
            })
            .catch(error => {
                console.error('Pasta grafiği verisi alınamadı:', error);
            });
    };
        // Yeni pasta grafiği verilerini al
    const fetchNewPieChartData = () => {
        fetch('/api/new-pie-chart-data')
            .then(response => response.json())
            .then(data => {
                const ctx = document.getElementById('newPieChart').getContext('2d');
                if (newPieChart) {
                    newPieChart.data.datasets[0].data = data.values;
                    newPieChart.update();
                } else {
                    newPieChart = new Chart(ctx, {
                        type: 'pie',
                        data: {
                            labels: data.labels,
                            datasets: [{
                                label: 'Yeni Pasta Grafiği',
                                data: data.values,
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(255, 159, 64, 0.2)'
                                ],
                                borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)'
                                ],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Yeni Pasta Grafiği'
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function(context) {
                                            console.log(context); // context nesnesinin yapısını kontrol etmek için konsola yazdır
                                            const label = context.label || context.chart.data.labels[context.dataIndex] || '';
                                            const value = context.raw || context.parsed || 0;
                                            const total = context.chart.data.datasets[0].data.reduce((acc, val) => acc + val, 0);
                                            const percentage = ((value / total) * 100).toFixed(2);
                                            return `${label}: ${value} (${percentage}%)`;
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Yeni pasta grafiği verisi alınamadı:', error);
            });
    };
    fetch('/api/pie-chart-data')
    .then(response => response.json())
    .then(data => {
        console.log('Pie Chart Data:', data);
    });


    if (window.location.pathname === '/index.html') {
        const yearSelectSales = document.getElementById('year-select-sales');
        const yearSelectIncome = document.getElementById('year-select-income');
        const yearSelectTeamSales = document.getElementById('year-select-team-sales');

        yearSelectSales.addEventListener('change', (event) => {
            fetchStats(event.target.value, 'sales');
        });

        yearSelectIncome.addEventListener('change', (event) => {
            fetchStats(event.target.value, 'income');
        });

        yearSelectTeamSales.addEventListener('change', (event) => {
            fetchTeamSales(event.target.value);
        });

        
        // Varsayılan yıl için istatistikleri al
        fetchStats(yearSelectSales.value, 'sales');
        fetchStats(yearSelectIncome.value, 'income');
        fetchTeamSales(yearSelectTeamSales.value);
        fetchStatsOverview();
        // Takımlara göre ve bedenlere göre satış verilerini al
        fetchSizeSales();
    }

    if (window.location.pathname === '/satislar.html') {
        fetchPieChartData();
        fetchNewPieChartData();
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
