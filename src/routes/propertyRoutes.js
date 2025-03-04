const express = require('express');
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');

const router = express.Router();

const auth = require('../middleware/auth');

// Appliquer auth à toutes les routes
router.use(auth);

router
  .route('/')
  .get(getProperties)
  .post(createProperty);

router
  .route('/:id')
  .get(getProperty)
  .put(updateProperty)
  .delete(deleteProperty);

module.exports = router;