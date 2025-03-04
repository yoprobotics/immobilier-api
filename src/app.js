const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const calculatorRoutes = require('./routes/calculatorRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

// Charger les variables d'environnement
dotenv.config();

// Initialiser l'application Express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.use('/api/calculators', calculatorRoutes);

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API Immobilier - Calculateurs d\'investissement'
  });
});

// Middleware d'erreur
app.use(errorHandler);

module.exports = app;