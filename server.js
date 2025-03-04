/**
 * ImmoCalcul - Serveur principal
 * API pour les calculateurs immobiliers
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

// Routes API
const calculatorRoutes = require('./routes/calculatorRoutes');

// Configuration de l'application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir les fichiers statiques du dossier public
app.use(express.static(path.join(__dirname, 'public')));

// Routes API
app.use('/api/calculators', calculatorRoutes);

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Une erreur s\'est produite sur le serveur',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur ImmoCalcul démarré sur le port ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
});