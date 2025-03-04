/**
 * Calculateur Napkin Multi
 * Formule pour calculer la rentabilité d'un immeuble à revenus:
 * Revenus bruts - Dépenses d'opération = Revenus nets d'opération (RNO)
 * RNO - Financement = Liquidité (Cashflow)
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation du calculateur Multi Napkin
    initMultiNapkinCalculator();
});

/**
 * Initialisation du calculateur Multi Napkin
 */
function initMultiNapkinCalculator() {
    // Récupérer les éléments du formulaire
    const form = document.getElementById('multi-napkin-form');
    const resetButton = document.getElementById('multi-napkin-reset');
    
    // Ajouter les gestionnaires d'événements
    if (form) {
        form.addEventListener('submit', calculateMultiNapkin);
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            resetForm('multi-napkin-form', 'multi-napkin');
        });
    }
}

/**
 * Calcul de la rentabilité d'un immeuble à revenus selon la méthode Napkin
 * @param {Event} event - Événement de soumission du formulaire
 */
function calculateMultiNapkin(event) {
    // Empêcher le comportement par défaut du formulaire
    event.preventDefault();
    
    // Récupérer les valeurs du formulaire
    const purchasePrice = getNumberValue('multi-purchase-price', 0);
    const unitCount = getNumberValue('multi-unit-count', 0);
    const grossRevenue = getNumberValue('multi-gross-revenue', 0);
    
    // Déterminer le pourcentage des dépenses selon le nombre de logements
    let expensePercentage = 0.5; // Par défaut 50%
    
    if (unitCount <= 2) {
        expensePercentage = 0.3; // 30% pour 1-2 logements
    } else if (unitCount <= 4) {
        expensePercentage = 0.35; // 35% pour 3-4 logements
    } else if (unitCount <= 6) {
        expensePercentage = 0.45; // 45% pour 5-6 logements
    }
    
    // Calcul des dépenses d'opération
    const expenses = grossRevenue * expensePercentage;
    
    // Calcul du revenu net d'opération
    const netRevenue = grossRevenue - expenses;
    
    // Calcul du financement (méthode HIGH-5)
    const financing = purchasePrice * 0.005 * 12;
    
    // Calcul de la liquidité annuelle
    const cashflow = netRevenue - financing;
    
    // Calcul de la liquidité mensuelle par porte
    const doorCashflow = unitCount > 0 ? cashflow / unitCount / 12 : 0;
    
    // Afficher les résultats
    displayMultiNapkinResults(grossRevenue, expenses, expensePercentage, netRevenue, financing, cashflow, doorCashflow, unitCount);
}

/**
 * Affichage des résultats du calculateur Multi Napkin
 * @param {number} grossRevenue - Revenus bruts
 * @param {number} expenses - Dépenses d'opération
 * @param {number} expensePercentage - Pourcentage des dépenses
 * @param {number} netRevenue - Revenus nets d'opération
 * @param {number} financing - Financement
 * @param {number} cashflow - Liquidité annuelle
 * @param {number} doorCashflow - Liquidité mensuelle par porte
 * @param {number} unitCount - Nombre de logements
 */
function displayMultiNapkinResults(grossRevenue, expenses, expensePercentage, netRevenue, financing, cashflow, doorCashflow, unitCount) {
    // Mettre à jour les valeurs dans les éléments HTML
    document.getElementById('result-gross-revenue').textContent = window.formatMoney(grossRevenue);
    document.getElementById('result-expenses').textContent = window.formatMoney(expenses);
    document.getElementById('result-expense-percent').textContent = `${Math.round(expensePercentage * 100)}% des revenus bruts`;
    document.getElementById('result-net-revenue').textContent = window.formatMoney(netRevenue);
    document.getElementById('result-financing').textContent = window.formatMoney(financing);
    
    const cashflowElement = document.getElementById('result-cashflow');
    cashflowElement.textContent = window.formatMoney(cashflow);
    
    const doorCashflowElement = document.getElementById('result-door-cashflow');
    doorCashflowElement.textContent = `${window.formatDecimal(doorCashflow, 2)}$`;
    
    // Changer la classe selon que la liquidité est positive ou négative
    const cashflowBoxes = document.querySelectorAll('.result-box.result-profit, .result-box.result-loss, .result-box.result-neutral');
    cashflowBoxes.forEach(box => {
        box.classList.remove('result-profit', 'result-loss', 'result-neutral');
        if (cashflow > 0) {
            box.classList.add('result-profit');
        } else if (cashflow < 0) {
            box.classList.add('result-loss');
        } else {
            box.classList.add('result-neutral');
        }
    });
    
    // Afficher les résultats
    toggleResults('multi-napkin', true);
    
    // Option: enregistrer le calcul dans l'API
    saveMultiNapkinCalculation(grossRevenue, expenses, expensePercentage, netRevenue, financing, cashflow, doorCashflow, unitCount);
}

/**
 * Sauvegarde du calcul dans l'API (optionnel)
 * @param {number} grossRevenue - Revenus bruts
 * @param {number} expenses - Dépenses d'opération
 * @param {number} expensePercentage - Pourcentage des dépenses
 * @param {number} netRevenue - Revenus nets d'opération
 * @param {number} financing - Financement
 * @param {number} cashflow - Liquidité annuelle
 * @param {number} doorCashflow - Liquidité mensuelle par porte
 * @param {number} unitCount - Nombre de logements
 */
async function saveMultiNapkinCalculation(grossRevenue, expenses, expensePercentage, netRevenue, financing, cashflow, doorCashflow, unitCount) {
    try {
        const data = {
            grossRevenue,
            expenses,
            expensePercentage,
            netRevenue,
            financing,
            cashflow,
            doorCashflow,
            unitCount,
            calculatedAt: new Date().toISOString()
        };
        
        // Cette fonction appelle l'API si elle est disponible
        // Si l'API n'est pas encore implémentée, cette fonction ne fera rien
        if (typeof callApi === 'function') {
            await callApi('multi-napkin/calculate', data);
        }
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du calcul:', error);
        // Continuer même si la sauvegarde échoue
    }
}