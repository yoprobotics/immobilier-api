/**
 * Routes API pour les calculateurs immobiliers
 */
const express = require('express');
const router = express.Router();
// Contrôleurs
const flipController = require('../controllers/flipController');
const multiController = require('../controllers/multiController');
const renovationController = require('../controllers/renovationController');
const mutationController = require('../controllers/mutationController');
const mortgageController = require('../controllers/mortgageController');

/**
 * Routes pour le calculateur Flip
 */
// Calculer le profit d'un flip
router.post('/flip/profit', flipController.calculateProfit);
// Calculer l'offre optimale pour un flip
router.post('/flip/offer', flipController.calculateOffer);

/**
 * Routes pour le calculateur Multi
 */
// Calculer la rentabilité d'un immeuble multi-logements
router.post('/multi/rentability', multiController.calculateRentability);
// Calculer l'offre optimale pour un multi
router.post('/multi/offer', multiController.calculateOffer);

/**
 * Routes pour le calculateur de coûts de rénovation
 */
// Calculer le coût total des rénovations
router.post('/renovation/cost', renovationController.calculateCost);
// Obtenir des estimations par pièce
router.get('/renovation/estimates', renovationController.getEstimates);

/**
 * Routes pour le calculateur de taxe de mutation
 */
// Calculer la taxe de mutation
router.post('/mutation/tax', mutationController.calculateTax);

/**
 * Routes pour le calculateur hypothécaire
 */
// Calculer le paiement hypothécaire mensuel
router.post('/mortgage/payment', mortgageController.calculatePayment);
// Générer un tableau d'amortissement
router.post('/mortgage/amortization', mortgageController.generateAmortizationTable);

module.exports = router;