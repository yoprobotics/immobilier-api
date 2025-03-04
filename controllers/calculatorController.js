/**
 * Contrôleur pour les calculateurs immobiliers
 */
const NapkinFlipCalculator = require('../utils/calculators/NapkinFlipCalculator');
const NapkinMultiCalculator = require('../utils/calculators/NapkinMultiCalculator');
const FlipDetailedCalculator = require('../utils/calculators/FlipDetailedCalculator');
const MultiDetailedCalculator = require('../utils/calculators/MultiDetailedCalculator');
const MortgageCalculator = require('../utils/calculators/MortgageCalculator');
const LiquidityCalculator = require('../utils/calculators/LiquidityCalculator');
const TransferTaxCalculator = require('../utils/calculators/TransferTaxCalculator');
const RenovationEstimateCalculator = require('../utils/calculators/RenovationEstimateCalculator');

/**
 * Méthode pour le calculateur Napkin FLIP (FIP10)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.calculateNapkinFlip = (req, res) => {
  try {
    const { finalPrice, initialPrice, renovationPrice } = req.body;

    // Validation des entrées
    if (!finalPrice || !initialPrice || renovationPrice === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Veuillez fournir tous les paramètres requis: finalPrice, initialPrice, renovationPrice'
      });
    }

    // Calcul avec la méthode FIP10
    const result = NapkinFlipCalculator.calculateProfit(
      parseFloat(finalPrice),
      parseFloat(initialPrice),
      parseFloat(renovationPrice)
    );

    return res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Erreur lors du calcul',
      error: error.message
    });
  }
};

/**
 * Méthode pour le calculateur Napkin MULTI (PAR)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.calculateNapkinMulti = (req, res) => {
  try {
    const { purchasePrice, apartmentCount, grossRevenue } = req.body;

    // Validation des entrées
    if (!purchasePrice || !apartmentCount || !grossRevenue) {
      return res.status(400).json({
        status: 'error',
        message: 'Veuillez fournir tous les paramètres requis: purchasePrice, apartmentCount, grossRevenue'
      });
    }

    // Calcul avec la méthode PAR
    const result = NapkinMultiCalculator.calculateCashflow(
      parseFloat(purchasePrice),
      parseInt(apartmentCount),
      parseFloat(grossRevenue)
    );

    return res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Erreur lors du calcul',
      error: error.message
    });
  }
};

/**
 * Méthode pour le calculateur détaillé FLIP
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.calculateFlipDetailed = (req, res) => {
  try {
    // Récupération des données du formulaire
    const data = req.body;
    
    // Validation des entrées minimales
    if (!data.purchasePrice || !data.sellingPrice) {
      return res.status(400).json({
        status: 'error',
        message: 'Veuillez fournir au moins le prix d\'achat et le prix de vente'
      });
    }

    // Calcul détaillé
    const result = FlipDetailedCalculator.calculate(data);

    return res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Erreur lors du calcul détaillé',
      error: error.message
    });
  }
};

/**
 * Méthode pour le calculateur détaillé MULTI
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.calculateMultiDetailed = (req, res) => {
  try {
    // Récupération des données du formulaire
    const data = req.body;
    
    // Validation des entrées minimales
    if (!data.purchasePrice || !data.grossRevenue) {
      return res.status(400).json({
        status: 'error',
        message: 'Veuillez fournir au moins le prix d\'achat et les revenus bruts'
      });
    }

    // Calcul détaillé
    const result = MultiDetailedCalculator.calculate(data);

    return res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Erreur lors du calcul détaillé',
      error: error.message
    });
  }
};

/**
 * Méthode pour le calculateur d'hypothèque
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.calculateMortgage = (req, res) => {
  try {
    const { loanAmount, interestRate, amortizationPeriod, paymentFrequency } = req.body;

    // Validation des entrées
    if (!loanAmount || !interestRate || !amortizationPeriod) {
      return res.status(400).json({
        status: 'error',
        message: 'Veuillez fournir tous les paramètres requis: loanAmount, interestRate, amortizationPeriod'
      });
    }

    // Calcul de l'hypothèque
    const result = MortgageCalculator.calculate(
      parseFloat(loanAmount),
      parseFloat(interestRate),
      parseInt(amortizationPeriod),
      paymentFrequency || 'monthly'
    );

    return res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Erreur lors du calcul de l\'hypothèque',
      error: error.message
    });
  }
};

/**
 * Méthode pour le calculateur de liquidité
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.calculateLiquidity = (req, res) => {
  try {
    // Récupération des données
    const data = req.body;
    
    // Validation minimale
    if (!data.revenues || !data.expenses) {
      return res.status(400).json({
        status: 'error',
        message: 'Veuillez fournir les revenus et les dépenses'
      });
    }

    // Calcul de la liquidité
    const result = LiquidityCalculator.calculate(data);

    return res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Erreur lors du calcul de la liquidité',
      error: error.message
    });
  }
};

/**
 * Méthode pour le calculateur de taxes de mutation (taxe de bienvenue)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.calculateTransferTax = (req, res) => {
  try {
    const { purchasePrice, municipality } = req.body;

    // Validation des entrées
    if (!purchasePrice) {
      return res.status(400).json({
        status: 'error',
        message: 'Veuillez fournir le prix d\'achat'
      });
    }

    // Calcul des taxes de mutation
    const result = TransferTaxCalculator.calculate(
      parseFloat(purchasePrice),
      municipality
    );

    return res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Erreur lors du calcul des taxes de mutation',
      error: error.message
    });
  }
};

/**
 * Méthode pour le calculateur d'estimation des rénovations
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.calculateRenovationEstimate = (req, res) => {
  try {
    // Récupération des données
    const renovations = req.body;
    
    // Validation minimale
    if (!renovations || !Array.isArray(renovations.items)) {
      return res.status(400).json({
        status: 'error',
        message: 'Veuillez fournir une liste d\'éléments de rénovation'
      });
    }

    // Calcul de l'estimation des rénovations
    const result = RenovationEstimateCalculator.calculate(renovations);

    return res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Erreur lors du calcul de l\'estimation des rénovations',
      error: error.message
    });
  }
};