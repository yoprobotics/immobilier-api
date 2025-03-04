/**
 * Calculateur Napkin MULTI (PAR)
 * 
 * Ce calculateur permet d'estimer rapidement la liquidité (cashflow) d'un immeuble à revenus
 * en utilisant la méthode PAR (Prix d'achat, Appartements, Revenus bruts)
 */

class NapkinMultiCalculator {
  /**
   * Calcule le pourcentage des dépenses en fonction du nombre d'appartements
   * 
   * @param {number} apartmentCount - Nombre d'appartements
   * @returns {number} Pourcentage des dépenses (entre 0 et 1)
   */
  static getExpenseRatio(apartmentCount) {
    if (apartmentCount <= 2) {
      return 0.30; // 30% pour 1-2 logements
    } else if (apartmentCount <= 4) {
      return 0.35; // 35% pour 3-4 logements
    } else if (apartmentCount <= 6) {
      return 0.45; // 45% pour 5-6 logements
    } else {
      return 0.50; // 50% pour 7+ logements
    }
  }

  /**
   * Calcule la liquidité (cashflow) estimée d'un immeuble à revenus
   * 
   * @param {number} purchasePrice - Prix d'achat de l'immeuble
   * @param {number} apartmentCount - Nombre d'appartements
   * @param {number} grossRevenue - Revenus bruts annuels
   * @returns {Object} Résultat du calcul avec détails
   */
  static calculateCashflow(purchasePrice, apartmentCount, grossRevenue) {
    // Validation des entrées
    if (isNaN(purchasePrice) || purchasePrice <= 0) {
      throw new Error('Le prix d\'achat doit être un nombre positif');
    }
    
    if (isNaN(apartmentCount) || apartmentCount <= 0 || !Number.isInteger(apartmentCount)) {
      throw new Error('Le nombre d\'appartements doit être un entier positif');
    }
    
    if (isNaN(grossRevenue) || grossRevenue < 0) {
      throw new Error('Les revenus bruts doivent être un nombre positif ou zéro');
    }

    // Calcul du pourcentage des dépenses en fonction du nombre d'appartements
    const expenseRatio = this.getExpenseRatio(apartmentCount);
    
    // Calcul des dépenses d'opération
    const operatingExpenses = grossRevenue * expenseRatio;
    
    // Calcul des revenus nets d'opération (RNO)
    const netOperatingIncome = grossRevenue - operatingExpenses;
    
    // Calcul du financement avec la méthode HIGH-5 (prix d'achat * 0.005 * 12)
    const mortgagePayment = purchasePrice * 0.005 * 12;
    
    // Calcul de la liquidité (cashflow)
    const cashflow = netOperatingIncome - mortgagePayment;
    
    // Calcul de la liquidité par porte par mois
    const cashflowPerUnitPerMonth = cashflow / apartmentCount / 12;
    
    // Calcul du rendement sur investissement (ROI)
    const downPayment = purchasePrice * 0.20; // 20% de mise de fonds
    const roi = (cashflow / downPayment) * 100;
    
    // Vérification si le projet est viable (75$ par porte par mois)
    const targetCashflowPerMonth = 75 * apartmentCount;
    const targetCashflowPerYear = targetCashflowPerMonth * 12;
    
    return {
      purchasePrice,
      apartmentCount,
      grossRevenue,
      expenseRatio: expenseRatio * 100, // Convertir en pourcentage pour l'affichage
      operatingExpenses,
      netOperatingIncome,
      mortgagePayment,
      cashflow,
      cashflowPerUnitPerMonth: parseFloat(cashflowPerUnitPerMonth.toFixed(2)),
      roi: parseFloat(roi.toFixed(2)),
      targetCashflowPerMonth,
      targetCashflowPerYear,
      isViable: cashflowPerUnitPerMonth >= 75,
      message: cashflowPerUnitPerMonth >= 75
        ? `Ce projet semble viable avec ${cashflowPerUnitPerMonth.toFixed(2)}$ de cashflow par porte par mois`
        : `Ce projet ne semble pas viable avec seulement ${cashflowPerUnitPerMonth.toFixed(2)}$ de cashflow par porte par mois (cible: 75$)`
    };
  }

  /**
   * Calcule le prix d'achat maximal pour obtenir un cashflow cible par porte par mois
   * 
   * @param {number} apartmentCount - Nombre d'appartements
   * @param {number} grossRevenue - Revenus bruts annuels
   * @param {number} targetCashflowPerUnit - Cashflow cible par porte par mois (par défaut 75$)
   * @returns {Object} Prix d'achat maximal recommandé avec détails
   */
  static calculateMaxPurchasePrice(apartmentCount, grossRevenue, targetCashflowPerUnit = 75) {
    // Validation des entrées
    if (isNaN(apartmentCount) || apartmentCount <= 0 || !Number.isInteger(apartmentCount)) {
      throw new Error('Le nombre d\'appartements doit être un entier positif');
    }
    
    if (isNaN(grossRevenue) || grossRevenue < 0) {
      throw new Error('Les revenus bruts doivent être un nombre positif ou zéro');
    }
    
    if (isNaN(targetCashflowPerUnit) || targetCashflowPerUnit < 0) {
      throw new Error('Le cashflow cible par porte doit être un nombre positif ou zéro');
    }

    // Calcul du pourcentage des dépenses en fonction du nombre d'appartements
    const expenseRatio = this.getExpenseRatio(apartmentCount);
    
    // Calcul des dépenses d'opération
    const operatingExpenses = grossRevenue * expenseRatio;
    
    // Calcul des revenus nets d'opération (RNO)
    const netOperatingIncome = grossRevenue - operatingExpenses;
    
    // Calcul du cashflow annuel cible
    const targetAnnualCashflow = targetCashflowPerUnit * apartmentCount * 12;
    
    // Calcul du montant disponible pour le financement
    const availableForMortgage = netOperatingIncome - targetAnnualCashflow;
    
    // Si le montant disponible est négatif ou nul, le projet n'est pas viable
    if (availableForMortgage <= 0) {
      return {
        apartmentCount,
        grossRevenue,
        expenseRatio: expenseRatio * 100,
        operatingExpenses,
        netOperatingIncome,
        targetCashflowPerUnit,
        targetAnnualCashflow,
        maxPurchasePrice: 0,
        isViable: false,
        message: 'Ce projet ne semble pas viable avec les revenus actuels - les revenus sont insuffisants pour générer le cashflow cible'
      };
    }
    
    // Calcul du prix d'achat maximal (inverse de la méthode HIGH-5)
    const maxPurchasePrice = availableForMortgage / (0.005 * 12);
    
    return {
      apartmentCount,
      grossRevenue,
      expenseRatio: expenseRatio * 100,
      operatingExpenses,
      netOperatingIncome,
      targetCashflowPerUnit,
      targetAnnualCashflow,
      maxPurchasePrice,
      isViable: true,
      message: `Pour atteindre un cashflow de ${targetCashflowPerUnit}$ par porte par mois, le prix d'achat ne devrait pas dépasser ${maxPurchasePrice.toFixed(2)}$`
    };
  }
}

module.exports = NapkinMultiCalculator;