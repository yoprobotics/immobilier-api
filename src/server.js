const app = require('./app');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

// Définir le port
const PORT = process.env.PORT || 5000;

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT} en mode ${process.env.NODE_ENV || 'development'}`);
});