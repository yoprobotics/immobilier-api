const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Vérifier si l'erreur est une erreur de validation Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({ message: 'Erreur de validation', errors });
  }
  
  // Vérifier si c'est une erreur de duplication de clé Mongoose
  if (err.code === 11000) {
    return res.status(400).json({ message: 'Erreur de duplication', field: err.keyValue });
  }
  
  // Erreur par défaut
  res.status(err.statusCode || 500).json({
    message: err.message || 'Erreur serveur',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;