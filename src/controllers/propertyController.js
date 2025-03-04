const Property = require('../models/Property');

// @desc    Obtenir toutes les propriétés
// @route   GET /api/properties
// @access  Private
exports.getProperties = async (req, res, next) => {
  try {
    let query;
    
    // Copie des paramètres de requête
    const reqQuery = { ...req.query };
    
    // Champs à exclure
    const removeFields = ['select', 'sort', 'page', 'limit'];
    
    // Supprimer les champs à exclure de reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Créer une chaîne de requête
    let queryStr = JSON.stringify(reqQuery);
    
    // Créer des opérateurs ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Trouver les propriétés de l'utilisateur connecté
    query = Property.find({
      user: req.user.id,
      ...JSON.parse(queryStr)
    });
    
    // Sélectionner des champs spécifiques
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
    
    // Trier
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Property.countDocuments({
      user: req.user.id,
      ...JSON.parse(queryStr)
    });
    
    query = query.skip(startIndex).limit(limit);
    
    // Exécuter la requête
    const properties = await query;
    
    // Résultat de la pagination
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: properties.length,
      pagination,
      data: properties
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir une propriété spécifique
// @route   GET /api/properties/:id
// @access  Private
exports.getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: `Propriété non trouvée avec l'ID ${req.params.id}`
      });
    }
    
    // Vérifier si la propriété appartient à l'utilisateur
    if (property.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: `L'utilisateur ${req.user.id} n'est pas autorisé à voir cette propriété`
      });
    }
    
    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Créer une nouvelle propriété
// @route   POST /api/properties
// @access  Private
exports.createProperty = async (req, res, next) => {
  try {
    // Ajouter l'utilisateur à req.body
    req.body.user = req.user.id;
    
    const property = await Property.create(req.body);
    
    res.status(201).json({
      success: true,
      data: property
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour une propriété
// @route   PUT /api/properties/:id
// @access  Private
exports.updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: `Propriété non trouvée avec l'ID ${req.params.id}`
      });
    }
    
    // Vérifier si la propriété appartient à l'utilisateur
    if (property.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: `L'utilisateur ${req.user.id} n'est pas autorisé à mettre à jour cette propriété`
      });
    }
    
    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer une propriété
// @route   DELETE /api/properties/:id
// @access  Private
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: `Propriété non trouvée avec l'ID ${req.params.id}`
      });
    }
    
    // Vérifier si la propriété appartient à l'utilisateur
    if (property.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: `L'utilisateur ${req.user.id} n'est pas autorisé à supprimer cette propriété`
      });
    }
    
    await property.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};