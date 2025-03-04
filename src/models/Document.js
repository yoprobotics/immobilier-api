const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  },
  name: {
    type: String,
    required: [true, 'Le nom du document est requis'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: [
      'VENDOR_DECLARATION', // Déclaration du vendeur (DV)
      'PURCHASE_OFFER', // Promesse d'achat
      'COUNTER_OFFER', // Contre-proposition
      'INSPECTION_REPORT', // Rapport d'inspection
      'LOCATION_CERTIFICATE', // Certificat de localisation
      'FINANCIAL_DOCUMENTS', // Documents financiers
      'LEASE', // Bail
      'RENOVATION_ESTIMATE', // Estimé de rénovation
      'PROPERTY_TAX', // Taxes foncières
      'INSURANCE', // Assurance
      'OTHER' // Autre
    ],
    required: [true, 'Le type de document est requis']
  },
  fileUrl: {
    type: String,
    required: [true, 'L\'URL du fichier est requise']
  },
  fileSize: {
    type: Number, // en bytes
    required: [true, 'La taille du fichier est requise']
  },
  fileType: {
    type: String,
    required: [true, 'Le type de fichier est requis']
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Mise à jour de la date de modification avant sauvegarde
DocumentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Document', DocumentSchema);