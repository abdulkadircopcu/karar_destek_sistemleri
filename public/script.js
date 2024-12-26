document.addEventListener('DOMContentLoaded', () => {
    console.log("Sayfa yüklendi");

    // Kullanıcı bilgilerini çekme
    fetch('/api/user?username=your_username') // Burada 'your_username' yerine gerçek kullanıcı adını kullanın
        .then(response => response.json())
        .then(data => {
            document.getElementById('user-name').textContent = `${data.ad} ${data.soyad}`;
        })
        .catch(error => {
            console.error('Kullanıcı bilgileri çekilemedi:', error);
        });

    // İstatistikleri çekme
    if (window.location.pathname === '/stats.html') {
        fetch('/api/stats')
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
                    window.location.href = 'index.html';
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