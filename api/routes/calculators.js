/**
 * Routes pour les calculateurs immobiliers
 */
const express = require('express');
const router = express.Router();
const flipNapkinController = require('../controllers/flip-napkin.controller');
const multiNapkinController = require('../controllers/multi-napkin.controller');
const flipOfferController = require('../controllers/flip-offer.controller');
const renovationCostController = require('../controllers/renovation-cost.controller');
const mutationTaxController = require('../controllers/mutation-tax.controller');
const mortgageController = require('../controllers/mortgage.controller');

/**
 * Routes pour le calculateur Napkin Flip
 */
router.post('/flip-napkin/calculate', flipNapkinController.calculate);
router.get('/flip-napkin/history', flipNapkinController.getHistory);

/**
 * Routes pour le calculateur Napkin Multi
 */
router.post('/multi-napkin/calculate', multiNapkinController.calculate);
router.get('/multi-napkin/history', multiNapkinController.getHistory);

/**
 * Routes pour le calculateur d'offre Flip
 */
router.post('/flip-offer/calculate', flipOfferController.calculate);
router.get('/flip-offer/history', flipOfferController.getHistory);

/**
 * Routes pour le calculateur de coûts de rénovation
 */
router.post('/renovation-cost/calculate', renovationCostController.calculate);
router.get('/renovation-cost/items', renovationCostController.getRenovationItems);

/**
 * Routes pour le calculateur de taxe de mutation
 */
router.post('/mutation-tax/calculate', mutationTaxController.calculate);

/**
 * Routes pour le calculateur hypothécaire
 */
router.post('/mortgage/calculate', mortgageController.calculate);
router.post('/mortgage/amortization', mortgageController.getAmortizationSchedule);

module.exports = router;