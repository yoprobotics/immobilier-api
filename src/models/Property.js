const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Le nom de la propriété est requis'],
    trim: true
  },
  address: {
    street: {
      type: String,
      required: [true, 'L\'adresse est requise']
    },
    city: {
      type: String,
      required: [true, 'La ville est requise']
    },
    province: {
      type: String,
      required: [true, 'La province est requise'],
      default: 'Québec'
    },
    postalCode: {
      type: String,
      required: [true, 'Le code postal est requis']
    }
  },
  propertyType: {
    type: String,
    enum: ['MULTI', 'FLIP', 'PLEX', 'RESIDENTIAL', 'COMMERCIAL', 'LAND'],
    required: [true, 'Le type de propriété est requis']
  },
  // Informations spécifiques selon le type (MULTI ou FLIP)
  details: {
    // Pour MULTI
    units: {
      type: Number,
      default: 0
    },
    unitDetails: [{
      unitNumber: String,
      bedrooms: Number,
      bathrooms: Number,
      area: Number,
      monthlyRent: Number,
      isRented: {
        type: Boolean,
        default: false
      },
      leaseEndDate: Date
    }],
    // Pour FLIP
    purchasePrice: {
      type: Number,
      default: 0
    },
    estimatedSalePrice: {
      type: Number,
      default: 0
    },
    renovationBudget: {
      type: Number,
      default: 0
    },
    estimatedProfit: {
      type: Number,
      default: 0
    },
    estimatedTimeframe: {
      type: Number, // en jours
      default: 90
    }
  },
  // Informations financières générales
  financials: {
    askingPrice: {
      type: Number,
      required: [true, 'Le prix demandé est requis']
    },
    purchasePrice: {
      type: Number,
      default: 0
    },
    downPayment: {
      type: Number,
      default: 0
    },
    mortgageAmount: {
      type: Number,
      default: 0
    },
    interestRate: {
      type: Number,
      default: 0
    },
    monthlyRevenue: {
      type: Number,
      default: 0
    },
    monthlyExpenses: {
      type: Number,
      default: 0
    },
    cashflow: {
      type: Number,
      default: 0
    }
  },
  // Informations sur la propriété
  propertyDetails: {
    lotSize: Number, // en m²
    buildingSize: Number, // en m²
    yearBuilt: Number,
    bedrooms: Number,
    bathrooms: Number,
    parkingSpaces: Number,
    hasBasement: Boolean,
    hasGarage: Boolean
  },
  // Statut de la propriété
  status: {
    type: String,
    enum: ['ACTIVE', 'PENDING', 'SOLD', 'RENTED', 'ARCHIVED'],
    default: 'ACTIVE'
  },
  // Photos de la propriété
  photos: [{
    url: String,
    description: String
  }],
  // Documents liés à la propriété
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  // Date d'acquisition ou de mise en vente
  listedDate: {
    type: Date,
    default: Date.now
  },
  // Date d'achat si applicable
  purchaseDate: {
    type: Date
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Property', PropertySchema);