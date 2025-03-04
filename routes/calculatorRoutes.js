/**
 * Routes pour les calculateurs immobiliers
 */
const express = require('express');
const router = express.Router();
const calculatorController = require('../controllers/calculatorController');

// Routes pour le calculateur FLIP
router.post('/napkin-flip', calculatorController.calculateNapkinFlip);

// Routes pour le calculateur MULTI
router.post('/napkin-multi', calculatorController.calculateNapkinMulti);

// Routes pour le calculateur de rentabilité FLIP détaillé
router.post('/flip-detailed', calculatorController.calculateFlipDetailed);

// Routes pour le calculateur de rentabilité MULTI détaillé
router.post('/multi-detailed', calculatorController.calculateMultiDetailed);

// Route pour le calculateur d'hypothèque
router.post('/mortgage', calculatorController.calculateMortgage);

// Route pour le calculateur de liquidité
router.post('/liquidity', calculatorController.calculateLiquidity);

// Route pour le calculateur de taxes de mutation
router.post('/transfer-tax', calculatorController.calculateTransferTax);

// Route pour le calculateur d'estimation des rénovations
router.post('/renovation-estimate', calculatorController.calculateRenovationEstimate);

module.exports = router;