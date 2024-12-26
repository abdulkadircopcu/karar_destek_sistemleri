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

    // İstatistikleri çekme
    if (window.location.pathname === '/index.html') {
        fetch('/api/stats?year=2024')
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