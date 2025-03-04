/**
 * Application principale pour les calculateurs immobiliers
 */
const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

// Routes
const calculatorRoutes = require('./routes/calculatorRoutes');

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());                                  // Permet les requêtes cross-origin 
app.use(express.json());                          // Parse les requêtes JSON
app.use(express.urlencoded({ extended: true }));  // Parse les données de formulaire
app.use(morgan('dev'));                           // Logging des requêtes HTTP en mode développement

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Routes API
app.use('/api/calculators', calculatorRoutes);

// Route d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route pour tester l'API
app.get('/api/status', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'L\'API des calculateurs immobiliers fonctionne correctement',
        timestamp: new Date().toISOString()
    });
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Une erreur est survenue sur le serveur',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Route pour les chemins non trouvés
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'La ressource demandée n\'existe pas'
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    console.log(`Accédez à l'application via: http://localhost:${PORT}`);
});

module.exports = app; // Pour les tests