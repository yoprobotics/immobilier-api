/**
 * Calculateur détaillé pour les projets FLIP
 * 
 * Ce calculateur permet d'analyser en détail la rentabilité d'un projet FLIP
 * en tenant compte de tous les coûts et frais associés
 */

class FlipDetailedCalculator {
  /**
   * Calcule la rentabilité détaillée d'un projet FLIP
   * 
   * @param {Object} data - Données du projet
   * @param {number} data.purchasePrice - Prix d'achat
   * @param {number} data.sellingPrice - Prix de vente estimé
   * @param {number} data.renovationCost - Coût total des rénovations
   * @param {number} data.holdingPeriod - Période de détention (en mois)
   * @param {Object} data.acquisitionCosts - Coûts d'acquisition (notaire, inspection, etc.)
   * @param {Object} data.holdingCosts - Coûts de détention (intérêts, taxes, assurances, etc.)
   * @param {Object} data.sellingCosts - Coûts de vente (courtier, notaire, etc.)
   * @param {Object} data.financing - Détails du financement
   * @returns {Object} Analyse détaillée de la rentabilité
   */
  static calculate(data) {
    // Validation des entrées minimales
    if (!data.purchasePrice || !data.sellingPrice) {
      throw new Error('Les prix d\'achat et de vente sont requis');
    }

    // Valeurs par défaut pour les paramètres optionnels
    const renovationCost = data.renovationCost || 0;
    const holdingPeriod = data.holdingPeriod || 3; // 3 mois par défaut

    // Calcul des coûts d'acquisition
    const acquisitionCosts = this.calculateAcquisitionCosts(data);
    
    // Calcul des coûts de détention
    const holdingCosts = this.calculateHoldingCosts(data);
    
    // Calcul des coûts de vente
    const sellingCosts = this.calculateSellingCosts(data);
    
    // Calcul du total des coûts
    const totalCosts = data.purchasePrice + renovationCost + acquisitionCosts.total + holdingCosts.total + sellingCosts.total;
    
    // Calcul du profit et du ROI
    const profit = data.sellingPrice - totalCosts;
    const investmentAmount = data.financing?.downPayment || (data.purchasePrice * 0.2); // 20% du prix d'achat par défaut
    const totalInvestment = investmentAmount + (data.financing?.otherCosts || 0) + renovationCost;
    const roi = (profit / totalInvestment) * 100;
    
    // Calcul du rendement annualisé (si le projet dure moins d'un an)
    const annualizedRoi = holdingPeriod < 12 ? roi * (12 / holdingPeriod) : roi;
    
    return {
      summary: {
        purchasePrice: data.purchasePrice,
        renovationCost: renovationCost,
        acquisitionCosts: acquisitionCosts.total,
        holdingCosts: holdingCosts.total,
        sellingPrice: data.sellingPrice,
        sellingCosts: sellingCosts.total,
        totalCosts: totalCosts,
        profit: profit,
        investmentAmount: totalInvestment,
        roi: parseFloat(roi.toFixed(2)),
        annualizedRoi: parseFloat(annualizedRoi.toFixed(2)),
        holdingPeriod: holdingPeriod,
        isViable: profit >= 25000,
        message: profit >= 25000 
          ? `Ce projet est viable avec un profit de ${profit.toFixed(2)}$ et un ROI annualisé de ${annualizedRoi.toFixed(2)}%` 
          : `Ce projet n'est pas viable avec un profit de seulement ${profit.toFixed(2)}$ (cible: 25 000$)`
      },
      details: {
        acquisition: acquisitionCosts,
        holding: holdingCosts,
        selling: sellingCosts,
        renovation: data.renovationDetails || { total: renovationCost },
        financing: data.financing || { downPayment: investmentAmount }
      }
    };
  }

  /**
   * Calcule les coûts d'acquisition
   * 
   * @param {Object} data - Données du projet
   * @returns {Object} Détail des coûts d'acquisition
   */
  static calculateAcquisitionCosts(data) {
    const purchasePrice = data.purchasePrice;
    
    // Utiliser les coûts d'acquisition fournis ou calculer les coûts par défaut
    if (data.acquisitionCosts) {
      return {
        ...data.acquisitionCosts,
        total: Object.values(data.acquisitionCosts).reduce((sum, value) => 
          typeof value === 'number' ? sum + value : sum, 0)
      };
    }
    
    // Calculs par défaut
    const notaryFees = Math.min(1500, purchasePrice * 0.01); // ~1% jusqu'à 1500$
    const transferTax = this.calculateTransferTax(purchasePrice);
    const inspectionFee = 500; // Frais d'inspection moyens
    const title = 300; // Frais de titre moyens
    
    const total = notaryFees + transferTax + inspectionFee + title;
    
    return {
      notaryFees,
      transferTax,
      inspectionFee,
      title,
      total
    };
  }

  /**
   * Calcule les coûts de détention
   * 
   * @param {Object} data - Données du projet
   * @returns {Object} Détail des coûts de détention
   */
  static calculateHoldingCosts(data) {
    const purchasePrice = data.purchasePrice;
    const holdingPeriod = data.holdingPeriod || 3; // 3 mois par défaut
    
    // Utiliser les coûts de détention fournis ou calculer les coûts par défaut
    if (data.holdingCosts) {
      return {
        ...data.holdingCosts,
        total: Object.values(data.holdingCosts).reduce((sum, value) => 
          typeof value === 'number' ? sum + value : sum, 0)
      };
    }
    
    // Calculs par défaut
    const mortgageAmount = data.financing?.loanAmount || (purchasePrice * 0.8); // 80% du prix d'achat par défaut
    const interestRate = data.financing?.interestRate || 5; // 5% par défaut
    const monthlyInterest = (mortgageAmount * (interestRate / 100)) / 12 * holdingPeriod;
    
    const propertyTax = (purchasePrice * 0.01) / 12 * holdingPeriod; // ~1% annuel
    const insurance = (purchasePrice * 0.005) / 12 * holdingPeriod; // ~0.5% annuel
    const utilities = 200 * holdingPeriod; // 200$ par mois par défaut
    
    const total = monthlyInterest + propertyTax + insurance + utilities;
    
    return {
      interest: monthlyInterest,
      propertyTax,
      insurance,
      utilities,
      total
    };
  }

  /**
   * Calcule les coûts de vente
   * 
   * @param {Object} data - Données du projet
   * @returns {Object} Détail des coûts de vente
   */
  static calculateSellingCosts(data) {
    const sellingPrice = data.sellingPrice;
    
    // Utiliser les coûts de vente fournis ou calculer les coûts par défaut
    if (data.sellingCosts) {
      return {
        ...data.sellingCosts,
        total: Object.values(data.sellingCosts).reduce((sum, value) => 
          typeof value === 'number' ? sum + value : sum, 0)
      };
    }
    
    // Calculs par défaut
    const realtorFees = sellingPrice * 0.05; // 5% de commission par défaut
    const notaryFees = 1000; // Frais de notaire moyens
    const staging = data.stagingCost || 0; // Coûts de mise en valeur
    const marketing = data.marketingCost || 500; // Coûts de marketing
    
    const total = realtorFees + notaryFees + staging + marketing;
    
    return {
      realtorFees,
      notaryFees,
      staging,
      marketing,
      total
    };
  }

  /**
   * Calcule la taxe de mutation (taxe de bienvenue)
   * 
   * @param {number} purchasePrice - Prix d'achat
   * @returns {number} Montant de la taxe de mutation
   */
  static calculateTransferTax(purchasePrice) {
    // Barème pour le Québec (peut varier selon les municipalités)
    let tax = 0;
    
    if (purchasePrice <= 50000) {
      tax = purchasePrice * 0.005;
    } else if (purchasePrice <= 250000) {
      tax = 50000 * 0.005 + (purchasePrice - 50000) * 0.01;
    } else if (purchasePrice <= 500000) {
      tax = 50000 * 0.005 + 200000 * 0.01 + (purchasePrice - 250000) * 0.015;
    } else {
      tax = 50000 * 0.005 + 200000 * 0.01 + 250000 * 0.015 + (purchasePrice - 500000) * 0.02;
    }
    
    // Certaines municipalités peuvent ajouter des frais supplémentaires
    // Par exemple, Montréal ajoute une taxe supplémentaire pour les propriétés de plus de 500 000$
    
    return tax;
  }
}

module.exports = FlipDetailedCalculator;