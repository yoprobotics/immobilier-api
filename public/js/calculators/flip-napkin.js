/**
 * Calculateur Napkin Flip
 * Formule: Prix Final - Prix Initial - Prix des Rénovations - 10% de la valeur de revente = Profit
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation du calculateur Flip Napkin
    initFlipNapkinCalculator();
});

/**
 * Initialisation du calculateur Flip Napkin
 */
function initFlipNapkinCalculator() {
    // Récupérer les éléments du formulaire
    const form = document.getElementById('flip-napkin-form');
    const resetButton = document.getElementById('flip-napkin-reset');
    
    // Ajouter les gestionnaires d'événements
    if (form) {
        form.addEventListener('submit', calculateFlipNapkin);
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            resetForm('flip-napkin-form', 'flip-napkin');
        });
    }
}

/**
 * Calcul du profit d'un flip immobilier selon la méthode Napkin
 * @param {Event} event - Événement de soumission du formulaire
 */
function calculateFlipNapkin(event) {
    // Empêcher le comportement par défaut du formulaire
    event.preventDefault();
    
    // Récupérer les valeurs du formulaire
    const finalPrice = getNumberValue('flip-final-price', 0);
    const initialPrice = getNumberValue('flip-initial-price', 0);
    const renoPrice = getNumberValue('flip-reno-cost', 0);
    
    // Calcul du 10% de la valeur de revente
    const tenPercent = finalPrice * 0.1;
    
    // Calcul du profit
    const profit = finalPrice - initialPrice - renoPrice - tenPercent;
    
    // Afficher les résultats
    displayFlipNapkinResults(finalPrice, initialPrice, renoPrice, tenPercent, profit);
}

/**
 * Affichage des résultats du calculateur Flip Napkin
 * @param {number} finalPrice - Prix final (valeur de revente)
 * @param {number} initialPrice - Prix initial (prix à l'achat)
 * @param {number} renoPrice - Prix des rénovations
 * @param {number} tenPercent - 10% de la valeur de revente
 * @param {number} profit - Profit estimé
 */
function displayFlipNapkinResults(finalPrice, initialPrice, renoPrice, tenPercent, profit) {
    // Mettre à jour les valeurs dans les éléments HTML
    document.getElementById('result-final-price').textContent = window.formatMoney(finalPrice);
    document.getElementById('result-initial-price').textContent = window.formatMoney(initialPrice);
    document.getElementById('result-reno-cost').textContent = window.formatMoney(renoPrice);
    document.getElementById('result-ten-percent').textContent = window.formatMoney(tenPercent);
    
    const profitElement = document.getElementById('result-profit');
    profitElement.textContent = window.formatMoney(profit);
    
    // Changer la classe selon que le profit est positif ou négatif
    const profitBox = profitElement.closest('.result-box');
    if (profitBox) {
        profitBox.classList.remove('result-profit', 'result-loss', 'result-neutral');
        if (profit > 0) {
            profitBox.classList.add('result-profit');
        } else if (profit < 0) {
            profitBox.classList.add('result-loss');
        } else {
            profitBox.classList.add('result-neutral');
        }
    }
    
    // Afficher les résultats
    toggleResults('flip-napkin', true);
    
    // Option: enregistrer le calcul dans l'API
    saveFlipNapkinCalculation(finalPrice, initialPrice, renoPrice, tenPercent, profit);
}

/**
 * Sauvegarde du calcul dans l'API (optionnel)
 * @param {number} finalPrice - Prix final (valeur de revente)
 * @param {number} initialPrice - Prix initial (prix à l'achat)
 * @param {number} renoPrice - Prix des rénovations
 * @param {number} tenPercent - 10% de la valeur de revente
 * @param {number} profit - Profit estimé
 */
async function saveFlipNapkinCalculation(finalPrice, initialPrice, renoPrice, tenPercent, profit) {
    try {
        const data = {
            finalPrice,
            initialPrice,
            renoPrice,
            tenPercent,
            profit,
            calculatedAt: new Date().toISOString()
        };
        
        // Cette fonction appelle l'API si elle est disponible
        // Si l'API n'est pas encore implémentée, cette fonction ne fera rien
        if (typeof callApi === 'function') {
            await callApi('flip-napkin/calculate', data);
        }
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du calcul:', error);
        // Continuer même si la sauvegarde échoue
    }
}