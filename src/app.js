const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const calculatorRoutes = require('./routes/calculatorRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

// Charger les variables d'environnement
dotenv.config();

// Initialiser l'application Express
const app = express();

// Configuration CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(helmet()); // Protection des en-têtes HTTP

// Routes
app.use('/api/calculators', calculatorRoutes);

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API Immobilier - Calculateurs d\'investissement',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Gestion des routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route introuvable'
  });
});

// Middleware d'erreur
app.use(errorHandler);

module.exports = app;