const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Le nom du projet est requis'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  projectType: {
    type: String,
    enum: ['MULTI', 'FLIP'],
    required: [true, 'Le type de projet est requis']
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  },
  status: {
    type: String,
    enum: [
      'RESEARCH', // Recherche
      'NEGOTIATION', // Négociation
      'FINANCING', // Financement
      'ACQUISITION', // Acquisition
      'RENOVATION', // Rénovation 
      'RENTING', // Mise en location (MULTI)
      'SELLING', // Vente (FLIP)
      'COMPLETED', // Complété
      'ABANDONED' // Abandonné
    ],
    default: 'RESEARCH'
  },
  // Étapes du projet (roadmap)
  steps: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    status: {
      type: String,
      enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED'],
      default: 'NOT_STARTED'
    },
    dueDate: Date,
    completedDate: Date,
    documents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    }],
    notes: String
  }],
  // Budget du projet
  budget: {
    totalBudget: {
      type: Number,
      default: 0
    },
    expenses: [{
      category: {
        type: String,
        enum: [
          'PURCHASE', // Achat
          'RENOVATION', // Rénovation
          'LEGAL_FEES', // Frais légaux
          'INSPECTION', // Inspection
          'FINANCING', // Financement
          'TAXES', // Taxes
          'INSURANCE', // Assurance
          'UTILITIES', // Services publics
          'MARKETING', // Marketing
          'OTHER' // Autre
        ],
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      description: String,
      date: {
        type: Date,
        default: Date.now
      },
      isPaid: {
        type: Boolean,
        default: false
      }
    }],
    revenue: [{
      source: {
        type: String,
        enum: [
          'RENT', // Loyer
          'SALE', // Vente
          'OTHER' // Autre
        ],
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      description: String,
      date: {
        type: Date,
        default: Date.now
      },
      isReceived: {
        type: Boolean,
        default: false
      }
    }]
  },
  // Collaborateurs du projet
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: [
        'OWNER', // Propriétaire
        'PARTNER', // Partenaire
        'CONTRACTOR', // Entrepreneur
        'AGENT', // Agent immobilier
        'LAWYER', // Avocat/Notaire
        'INSPECTOR', // Inspecteur
        'LENDER', // Prêteur
        'OTHER' // Autre
      ],
      required: true
    },
    permissions: {
      canEdit: {
        type: Boolean,
        default: false
      },
      canDelete: {
        type: Boolean,
        default: false
      },
      canInvite: {
        type: Boolean,
        default: false
      }
    }
  }],
  // Dates importantes
  dates: {
    startDate: {
      type: Date,
      default: Date.now
    },
    targetCompletionDate: Date,
    actualCompletionDate: Date
  },
  // Notes du projet
  notes: {
    type: String
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
ProjectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Project', ProjectSchema);