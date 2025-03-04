/**
 * Fichier JavaScript principal pour les calculateurs immobiliers
 */

// Initialisation du document
document.addEventListener('DOMContentLoaded', function() {
    // Sélection des calculateurs et configuration de la navigation
    setupCalculatorNavigation();
    
    // Initialisation des formats de nombre
    setupNumberFormats();
    
    // Initialisation des tooltips Bootstrap
    initTooltips();
});

/**
 * Configuration de la navigation entre les calculateurs
 */
function setupCalculatorNavigation() {
    const navItems = document.querySelectorAll('.calculator-nav-item');
    const calculators = document.querySelectorAll('.calculator-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Réinitialiser les classes actives
            navItems.forEach(navItem => navItem.classList.remove('active'));
            calculators.forEach(calc => calc.classList.add('d-none'));
            
            // Activer l'élément cliqué
            this.classList.add('active');
            const targetId = this.getAttribute('data-calculator');
            const targetCalculator = document.getElementById(targetId);
            
            if (targetCalculator) {
                targetCalculator.classList.remove('d-none');
            }
        });
    });
}

/**
 * Configuration des formats de nombres pour l'affichage
 */
function setupNumberFormats() {
    // Format monétaire
    window.formatMoney = function(amount) {
        return new Intl.NumberFormat('fr-CA', {
            style: 'currency',
            currency: 'CAD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };
    
    // Format décimal
    window.formatDecimal = function(number, decimals = 2) {
        return new Intl.NumberFormat('fr-CA', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(number);
    };
    
    // Format pourcentage
    window.formatPercent = function(number, decimals = 2) {
        return new Intl.NumberFormat('fr-CA', {
            style: 'percent',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(number / 100);
    };
}

/**
 * Initialisation des tooltips Bootstrap
 */
function initTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

/**
 * Utilitaire pour afficher et masquer les résultats
 */
function toggleResults(calculatorId, show) {
    const resultsContainer = document.getElementById(`${calculatorId}-results`);
    if (resultsContainer) {
        if (show) {
            resultsContainer.classList.remove('d-none');
            resultsContainer.classList.add('fade-in');
        } else {
            resultsContainer.classList.add('d-none');
            resultsContainer.classList.remove('fade-in');
        }
    }
}

/**
 * Utilitaire pour récupérer la valeur d'un champ numérique
 * @param {string} id - ID du champ
 * @param {number} defaultValue - Valeur par défaut si le champ est vide
 * @returns {number} - Valeur numérique du champ
 */
function getNumberValue(id, defaultValue = 0) {
    const element = document.getElementById(id);
    if (element && element.value) {
        return parseFloat(element.value);
    }
    return defaultValue;
}

/**
 * Réinitialiser un formulaire et masquer les résultats
 * @param {string} formId - ID du formulaire
 * @param {string} calculatorId - ID du calculateur
 */
function resetForm(formId, calculatorId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
    toggleResults(calculatorId, false);
}

/**
 * Gestion des erreurs API
 * @param {Error} error - Erreur à traiter
 */
function handleApiError(error) {
    console.error('API Error:', error);
    // Afficher un message d'erreur à l'utilisateur
    alert('Une erreur est survenue lors de la communication avec le serveur. Veuillez réessayer plus tard.');
}

/**
 * Fonction utilitaire pour appeler l'API
 * @param {string} endpoint - Point d'entrée de l'API
 * @param {Object} data - Données à envoyer
 * @returns {Promise} - Promesse contenant la réponse de l'API
 */
async function callApi(endpoint, data) {
    try {
        const response = await fetch(`/api/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        handleApiError(error);
        throw error;
    }
}