const express = require('express');
const router = express.Router();
const { 
  calculateFlipNapkin,
  calculateFlipOffer,
  calculateMultiNapkin,
  calculateMutationTax,
  calculateMortgage
} = require('../controllers/calculatorController');

// Protection des routes avec middleware d'authentification (à implémenter)
// const { protect } = require('../middleware/authMiddleware');

// Routes des calculatrices
router.post('/flip-napkin', calculateFlipNapkin);
router.post('/flip-offer', calculateFlipOffer);
router.post('/multi-napkin', calculateMultiNapkin);
router.post('/mutation-tax', calculateMutationTax);
router.post('/mortgage', calculateMortgage);

module.exports = router;