/**
 * Calculateur Napkin FLIP (FIP10)
 * 
 * Ce calculateur permet d'estimer rapidement le profit d'un projet FLIP immobilier
 * en utilisant la formule FIP10 (Final price - Initial price - Price of renovations - 10% of final price)
 */

class NapkinFlipCalculator {
  /**
   * Calcule le profit estimé d'un projet FLIP
   * 
   * @param {number} finalPrice - Prix de vente estimé après travaux (Prix Final)
   * @param {number} initialPrice - Prix d'achat initial (Prix Initial)
   * @param {number} renovationPrice - Coût estimé des rénovations (Prix des Rénos)
   * @returns {Object} Résultat du calcul avec détails
   */
  static calculateProfit(finalPrice, initialPrice, renovationPrice) {
    // Validation des entrées
    if (isNaN(finalPrice) || finalPrice <= 0) {
      throw new Error('Le prix final doit être un nombre positif');
    }
    
    if (isNaN(initialPrice) || initialPrice <= 0) {
      throw new Error('Le prix initial doit être un nombre positif');
    }
    
    if (isNaN(renovationPrice) || renovationPrice < 0) {
      throw new Error('Le prix des rénovations doit être un nombre positif ou zéro');
    }

    // Calcul du 10% de la valeur de revente
    const tenPercent = finalPrice * 0.1;
    
    // Calcul du profit selon la formule FIP10
    const profit = finalPrice - initialPrice - renovationPrice - tenPercent;
    
    // Calcul du pourcentage de rendement
    const downPayment = initialPrice * 0.2; // Approximation de la mise de fonds (20% du prix initial)
    const roi = profit / downPayment * 100;
    
    return {
      finalPrice,
      initialPrice,
      renovationPrice,
      tenPercentFees: tenPercent,
      profit,
      roi: parseFloat(roi.toFixed(2)),
      isViable: profit > 25000,
      message: profit > 25000 
        ? 'Ce projet semble viable (profit > 25 000$)' 
        : 'Ce projet ne semble pas viable (profit < 25 000$)'
    };
  }

  /**
   * Calcule le prix d'offre recommandé pour atteindre un profit cible
   * 
   * @param {number} finalPrice - Prix de vente estimé après travaux
   * @param {number} renovationPrice - Coût estimé des rénovations
   * @param {number} targetProfit - Profit visé (par défaut 25000$)
   * @returns {Object} Montant de l'offre recommandé avec détails
   */
  static calculateOfferAmount(finalPrice, renovationPrice, targetProfit = 25000) {
    // Validation des entrées
    if (isNaN(finalPrice) || finalPrice <= 0) {
      throw new Error('Le prix final doit être un nombre positif');
    }
    
    if (isNaN(renovationPrice) || renovationPrice < 0) {
      throw new Error('Le prix des rénovations doit être un nombre positif ou zéro');
    }
    
    if (isNaN(targetProfit) || targetProfit <= 0) {
      throw new Error('Le profit visé doit être un nombre positif');
    }

    // Calcul du 10% de la valeur de revente
    const tenPercent = finalPrice * 0.1;
    
    // Calcul du montant de l'offre selon la formule inversée
    const offerAmount = finalPrice - renovationPrice - tenPercent - targetProfit;
    
    // Vérification si le résultat est cohérent
    if (offerAmount <= 0) {
      return {
        finalPrice,
        renovationPrice,
        tenPercentFees: tenPercent,
        targetProfit,
        offerAmount: 0,
        isViable: false,
        message: 'Ce projet ne semble pas viable avec le profit visé - le prix d\'offre serait négatif'
      };
    }
    
    return {
      finalPrice,
      renovationPrice,
      tenPercentFees: tenPercent,
      targetProfit,
      offerAmount,
      isViable: true,
      message: `Pour atteindre un profit de ${targetProfit}$, vous devriez offrir ${offerAmount.toFixed(2)}$`
    };
  }
}

module.exports = NapkinFlipCalculator;