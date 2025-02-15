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
    let citySalesChart;
    let citySalesChartWithoutBranch;
    let predictionChart;
    let monthlyPredictionChart;

    // İllere göre satış verileri
    const fetchCitySalesData = (year) => {
        fetch(`/api/city-sales-data?year=${year}`)
            .then(response => response.json())
            .then(data => {
                const ctx = document.getElementById('citySalesChart').getContext('2d');
                if (citySalesChart) {
                    citySalesChart.data.datasets[0].data = data.values;
                    citySalesChart.update();
                } else {
                    citySalesChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: data.labels,
                            datasets: [{
                                label: 'İllere Göre Satış Sayısı',
                                data: data.values,
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
                console.error('İllere göre satış verisi alınamadı:', error);
            });
    };

    // Şubesi olmayan illere göre satış verileri
    const fetchCitySalesDataWithoutBranch = (year) => {
        fetch(`/api/city-sales-data-without-branch?year=${year}`)
            .then(response => response.json())
            .then(data => {
                const ctx = document.getElementById('citySalesChartWithoutBranch').getContext('2d');
                if (citySalesChartWithoutBranch) {
                    citySalesChartWithoutBranch.data.datasets[0].data = data.values;
                    citySalesChartWithoutBranch.update();
                } else {
                    citySalesChartWithoutBranch = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: data.labels,
                            datasets: [{
                                label: 'Şubesi Olmayan İllere Göre Satış Sayısı',
                                data: data.values,
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                borderColor: 'rgba(255, 99, 132, 1)',
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
                console.error('Şubesi olmayan illere göre satış verisi alınamadı:', error);
            });
    };

    
    // Pasta grafiği verileri
    const fetchPieChartData = () => {
        fetch('/api/pie-chart-data')
            .then(response => response.json())
            .then(data => {
                const ctx = document.getElementById('pieChart').getContext('2d');
                if (pieChart) {
                    pieChart.data.datasets[0].data = data.values;
                    pieChart.update();
                } else {
                    pieChart = new Chart(ctx, {
                        type: 'pie',
                        data: {
                            labels: data.labels,
                            datasets: [{
                                label: 'Pasta Grafiği',
                                data: data.values,
                                backgroundColor: [
                                    'rgba(0, 100, 0, 0.8)', 
                                    'rgba(255, 140, 0, 0.8)', 
                                    'rgba(255, 69, 0, 0.8)', 
                                    'rgba(255, 0, 0, 0.8)', 
                                    'rgba(128, 0, 0, 0.8)', 
                                    'rgba(75, 0, 130, 0.8)', 
                                    'rgba(138, 43, 226, 0.8)', 
                                    'rgba(0, 0, 255, 0.8)', 
                                    'rgba(0, 191, 255, 0.8)', 
                                    'rgba(0, 255, 255, 0.8)', 
                                    'rgba(0, 255, 127, 0.8)',
                                    'rgba(34, 139, 34, 0.8)' 
                                ],
                                borderColor: [
                                    'rgba(0, 100, 0, 1)',
                                    'rgba(255, 140, 0, 1)', 
                                    'rgba(255, 69, 0, 1)', 
                                    'rgba(255, 0, 0, 1)', 
                                    'rgba(128, 0, 0, 1)', 
                                    'rgba(75, 0, 130, 1)', 
                                    'rgba(138, 43, 226, 1)',
                                    'rgba(0, 0, 255, 1)', 
                                    'rgba(0, 191, 255, 1)', 
                                    'rgba(0, 255, 255, 1)', 
                                    'rgba(0, 255, 127, 1)', 
                                    'rgba(34, 139, 34, 1)' 
                                ],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                datalabels: {
                                    formatter: (value, context) => {
                                        const total = context.chart.data.datasets[0].data.reduce((acc, val) => acc + val, 0);
                                        const percentage = ((value / total) * 100).toFixed(2);
                                        const sortedData = context.chart.data.datasets[0].data.slice().sort((a, b) => b - a);
                                        const top5Values = sortedData.slice(0, 7);
                                        if (top5Values.includes(value)) {
                                            return `${context.chart.data.labels[context.dataIndex]}: ${percentage}%`;
                                        }
                                        return '';
                                    },
                                    color: '#fff',
                                    font: {
                                        weight: 'bold'
                                    }
                                },
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
                        },
                        plugins: [ChartDataLabels]
                    });
                }

                // En çok satış yapılan 3 il
                const top3Cities = data.labels
                    .map((label, index) => ({ label, value: data.values[index] }))
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 3)
                    .map(item => `${item.label}: ${item.value}`)
                    .join('<br>');
                document.getElementById('top3Cities').innerHTML = `<strong>En Çok Satış Yapılan 3 İl:</strong><br>${top3Cities}`;
            })
            .catch(error => {
                console.error('Pasta grafiği verisi alınamadı:', error);
            });
    };

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
                                    'rgba(0, 100, 0, 0.8)', 
                                    'rgba(255, 140, 0, 0.8)', 
                                    'rgba(255, 69, 0, 0.8)',
                                    'rgba(255, 0, 0, 0.8)', 
                                    'rgba(128, 0, 0, 0.8)',
                                    'rgba(75, 0, 130, 0.8)', 
                                    'rgba(138, 43, 226, 0.8)', 
                                    'rgba(0, 0, 255, 0.8)', 
                                    'rgba(0, 191, 255, 0.8)',
                                    'rgba(0, 255, 255, 0.8)',
                                    'rgba(0, 255, 127, 0.8)', 
                                    'rgba(34, 139, 34, 0.8)' 
                                ],
                                borderColor: [
                                    'rgba(0, 100, 0, 1)', 
                                    'rgba(255, 140, 0, 1)',
                                    'rgba(255, 69, 0, 1)', 
                                    'rgba(255, 0, 0, 1)', 
                                    'rgba(128, 0, 0, 1)', 
                                    'rgba(75, 0, 130, 1)',
                                    'rgba(138, 43, 226, 1)', 
                                    'rgba(0, 0, 255, 1)',
                                    'rgba(0, 191, 255, 1)', 
                                    'rgba(0, 255, 255, 1)', 
                                    'rgba(0, 255, 127, 1)', 
                                    'rgba(34, 139, 34, 1)' 
                                ],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                datalabels: {
                                    formatter: (value, context) => {
                                        const total = context.chart.data.datasets[0].data.reduce((acc, val) => acc + val, 0);
                                        const percentage = ((value / total) * 100).toFixed(2);
                                        const sortedData = context.chart.data.datasets[0].data.slice().sort((a, b) => b - a);
                                        const top5Values = sortedData.slice(0, 6);
                                        if (top5Values.includes(value)) {
                                            return `${context.chart.data.labels[context.dataIndex]}: ${percentage}%`;
                                        }
                                        return '';
                                    },
                                    color: '#fff',
                                    font: {
                                        weight: 'bold'
                                    }
                                },
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
                        },
                        plugins: [ChartDataLabels]
                    });
                }

                // En çok satış yapılan 3 il
                const top3CitiesNew = data.labels
                    .map((label, index) => ({ label, value: data.values[index] }))
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 3)
                    .map(item => `${item.label}: ${item.value}`)
                    .join('<br>');
                document.getElementById('top3CitiesNew').innerHTML = `<strong>En Çok Satış Yapılan 3 İl:</strong><br>${top3CitiesNew}`;
            })
            .catch(error => {
                console.error('Yeni pasta grafiği verisi alınamadı:', error);
            });
    };

    if (window.location.pathname === '/satislar.html') {
        fetchPieChartData();
        fetchNewPieChartData();
        const yearSelectCitySales = document.getElementById('year-select-city-sales');
        yearSelectCitySales.addEventListener('change', (event) => {
            fetchCitySalesData(event.target.value);
        });
        fetchCitySalesData(yearSelectCitySales.value); 

        const yearSelectCitySalesWithoutBranch = document.getElementById('year-select-city-sales-without-branch');
        yearSelectCitySalesWithoutBranch.addEventListener('change', (event) => {
            fetchCitySalesDataWithoutBranch(event.target.value);
        });
        fetchCitySalesDataWithoutBranch(yearSelectCitySalesWithoutBranch.value);
    }



    // Yıllara göre satış ve gelir verileri
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

    // Takımlara göre satış verileri
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

    // Bedenlere göre satış verileri
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
                document.getElementById('stat1').textContent = data.totalOrders || 0;
                document.getElementById('stat2').textContent = data.totalForms || 0; 
                document.getElementById('stat3').textContent = `${data.totalIncome || 0} TL`; 
            })
            .catch(error => {
                console.error('Stats API isteği hatası:', error);
            });
    };
    

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

        
        fetchStats(yearSelectSales.value, 'sales');
        fetchStats(yearSelectIncome.value, 'income');
        fetchTeamSales(yearSelectTeamSales.value);
        fetchStatsOverview();
        fetchSizeSales();
    }

    if (window.location.pathname === '/satislar.html') {
        fetchPieChartData();
        fetchNewPieChartData();
    }

    // 2024 yılı satış verilerine göre 2025 yılı satış tahmini
    const fetchCitySalesPrediction = (percentage) => {
        fetch('/api/city-sales-prediction')
            .then(response => response.json())
            .then(data => {
                const ctx = document.getElementById('predictionChart').getContext('2d');
                const predictedValues = data.values2024.map(value => Math.round(value * (1 + percentage / 100)));
                if (predictionChart) {
                    predictionChart.data.datasets[0].data = data.values2024;
                    predictionChart.data.datasets[1].data = predictedValues;
                    predictionChart.update();
                } else {
                    predictionChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: data.labels,
                            datasets: [
                                {
                                    label: '2024 Satış Verileri',
                                    data: data.values2024,
                                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                    borderColor: 'rgba(54, 162, 235, 1)',
                                    borderWidth: 1
                                },
                                {
                                    label: '2025 Tahmini',
                                    data: predictedValues,
                                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    borderWidth: 1
                                }
                            ]
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
                console.error('Tahmin verisi alınamadı:', error);
            });
    };

    // İl seçimi ve aylık satış tahmini
    const fetchCityMonthlySalesPrediction = (city, percentage) => {
        fetch(`/api/city-monthly-sales-prediction?city=${city}`)
            .then(response => response.json())
            .then(data => {
                const ctx = document.getElementById('monthlyPredictionChart').getContext('2d');
                const predictedValues = data.values2024.map(value => Math.round(value * (1 + percentage / 100)));
                const monthLabels = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
                if (monthlyPredictionChart) {
                    monthlyPredictionChart.data.datasets[0].data = data.values2024;
                    monthlyPredictionChart.data.datasets[1].data = predictedValues;
                    monthlyPredictionChart.update();
                } else {
                    monthlyPredictionChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: monthLabels,
                            datasets: [
                                {
                                    label: '2024 Aylık Satış Verileri',
                                    data: data.values2024,
                                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                    borderColor: 'rgba(54, 162, 235, 1)',
                                    borderWidth: 1
                                },
                                {
                                    label: '2025 Aylık Tahmini',
                                    data: predictedValues,
                                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    borderWidth: 1
                                }
                            ]
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
                console.error('Aylık tahmin verisi alınamadı:', error);
            });
    };

    if (window.location.pathname === '/tahmin.html') {
        const predictionInput = document.getElementById('prediction-input');
        const updatePredictionButton = document.getElementById('update-prediction');

        updatePredictionButton.addEventListener('click', () => {
            const percentage = parseInt(predictionInput.value, 10);
            if (!isNaN(percentage)) {
                fetchCitySalesPrediction(percentage);
            } else {
                alert('Lütfen geçerli bir yüzde değeri girin.');
            }
        });

        fetchCitySalesPrediction(0); 

        const citySelect = document.getElementById('city-select');
        const monthlyPredictionInput = document.getElementById('monthly-prediction-input');
        const updateMonthlyPredictionButton = document.getElementById('update-monthly-prediction');

        citySelect.addEventListener('change', () => {
            const city = citySelect.value;
            const percentage = parseInt(monthlyPredictionInput.value, 10) || 0;
            fetchCityMonthlySalesPrediction(city, percentage);
        });

        updateMonthlyPredictionButton.addEventListener('click', () => {
            const city = citySelect.value;
            const percentage = parseInt(monthlyPredictionInput.value, 10);
            if (!isNaN(percentage)) {
                fetchCityMonthlySalesPrediction(city, percentage);
            } else {
                alert('Lütfen geçerli bir yüzde değeri girin.');
            }
        });

        fetchCityMonthlySalesPrediction(citySelect.value, 0); 
    }

    // Giriş formu
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
                    // Kullanıcı bilgilerini yerel depolamaya kaydet (Kullanıcının adı ve soyadı, menünün üstünde yazacak.)
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
