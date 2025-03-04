/**
 * ImmoCalcul - Fichier JavaScript principal
 * 
 * Ce fichier contient des fonctions communes utilisées par tous les calculateurs immobiliers.
 */

// Formatage des montants en dollars canadiens
function formatMoney(amount) {
    return new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(amount);
}

// Formatage des pourcentages
function formatPercent(percent, decimals = 1) {
    return new Intl.NumberFormat('fr-CA', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(percent / 100);
}

// Formatage des nombres avec séparateurs de milliers
function formatNumber(number, decimals = 0) {
    return new Intl.NumberFormat('fr-CA', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(number);
}

// Fonction pour animer les valeurs lors de leur affichage
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        
        // Si la valeur est un élément DOM
        if (element instanceof Element) {
            // Vérifier si l'élément attend un formatage monétaire
            if (element.classList.contains('money-value')) {
                element.textContent = formatMoney(value);
            }
            // Vérifier si l'élément attend un formatage de pourcentage
            else if (element.classList.contains('percent-value')) {
                element.textContent = formatPercent(value);
            }
            // Sinon, afficher la valeur sans formatage spécial
            else {
                element.textContent = formatNumber(value);
            }
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    
    window.requestAnimationFrame(step);
}

// Fonction pour ajouter un effet de fade-in à un élément
function fadeIn(element, duration = 500) {
    element.style.opacity = 0;
    element.style.display = 'block';
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.style.opacity = progress;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.classList.add('fade-in-complete');
        }
    };
    
    window.requestAnimationFrame(step);
}

// Fonction pour ajouter un écouteur d'événements à tous les éléments correspondant à un sélecteur
function addEventListenerToAll(selector, event, handler) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        element.addEventListener(event, handler);
    });
}

// Fonction pour valider un formulaire (vérification des champs requis)
function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
        }
    });
    
    return isValid;
}

// Fonction pour copier les résultats dans le presse-papier
function copyResults(resultsId) {
    const resultsElement = document.getElementById(resultsId);
    
    if (!resultsElement) return false;
    
    // Créer un élément temporaire pour copier le texte
    const textarea = document.createElement('textarea');
    textarea.value = resultsElement.innerText;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        return successful;
    } catch (err) {
        console.error('Erreur lors de la copie:', err);
        document.body.removeChild(textarea);
        return false;
    }
}

// Fonction pour créer un PDF à partir des résultats
function generatePDF(elementId, filename) {
    // Cette fonction nécessiterait l'utilisation d'une bibliothèque comme jsPDF
    // L'implémentation complète n'est pas incluse ici
    alert('La fonctionnalité d\'export PDF sera bientôt disponible!');
}

// Fonction pour vérifier si l'élément est visible dans la fenêtre
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Fonction pour faire défiler en douceur jusqu'à un élément
function scrollToElement(elementId, offset = 0) {
    const element = document.getElementById(elementId);
    
    if (!element) return;
    
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Détection du mode sombre
function detectDarkMode() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Détecter le mode sombre
    detectDarkMode();
    
    // Ajouter des écouteurs d'événements pour la navigation
    addEventListenerToAll('.calculator-nav-item', 'click', function() {
        const items = document.querySelectorAll('.calculator-nav-item');
        items.forEach(item => item.classList.remove('active'));
        this.classList.add('active');
    });
    
    // Ajout des écouteurs pour les boutons de copie des résultats
    addEventListenerToAll('.copy-results', 'click', function() {
        const resultsId = this.getAttribute('data-results');
        if (copyResults(resultsId)) {
            // Afficher un message de confirmation
            const tooltip = document.createElement('div');
            tooltip.className = 'copy-tooltip';
            tooltip.textContent = 'Copié!';
            this.appendChild(tooltip);
            
            // Supprimer le message après 2 secondes
            setTimeout(() => {
                tooltip.remove();
            }, 2000);
        }
    });
});