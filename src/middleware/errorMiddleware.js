/**
 * Middleware de gestion d'erreurs pour l'API
 */
const errorHandler = (err, req, res, next) => {
  // Log pour le développement
  console.error(err.stack);

  // Statut de l'erreur (ou 500 par défaut si non spécifié)
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Erreur serveur',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = { errorHandler };