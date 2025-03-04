/**
 * Modèle pour le calculateur Napkin Flip
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma pour le calcul Napkin Flip
 * @typedef {Object} FlipNapkinCalculation
 * @property {number} finalPrice - Prix final (valeur de revente)
 * @property {number} initialPrice - Prix initial (prix à l'achat)
 * @property {number} renoPrice - Prix des rénovations
 * @property {number} tenPercent - 10% de la valeur de revente
 * @property {number} profit - Profit estimé
 * @property {Date} calculatedAt - Date du calcul
 */
const FlipNapkinSchema = new Schema({
    finalPrice: {
        type: Number,
        required: [true, 'Le prix final est requis'],
    },
    initialPrice: {
        type: Number,
        required: [true, 'Le prix initial est requis'],
    },
    renoPrice: {
        type: Number,
        required: [true, 'Le coût des rénovations est requis'],
        default: 0
    },
    tenPercent: {
        type: Number,
        required: [true, '10% de la valeur de revente est requis'],
    },
    profit: {
        type: Number,
        required: [true, 'Le profit est requis'],
    },
    calculatedAt: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    propertyName: {
        type: String,
        required: false
    },
    propertyAddress: {
        type: String,
        required: false
    },
    notes: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

/**
 * Méthode pour formater le profit en devise
 * @returns {string} - Profit formaté en devise
 */
FlipNapkinSchema.methods.formatProfit = function() {
    return new Intl.NumberFormat('fr-CA', {
        style: 'currency',
        currency: 'CAD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(this.profit);
};

/**
 * Méthode pour obtenir le taux de rendement
 * @returns {number} - Taux de rendement (profit / mise de fonds)
 */
FlipNapkinSchema.methods.getRoi = function() {
    const downPayment = this.initialPrice * 0.2; // Supposons une mise de fonds de 20%
    return this.profit / downPayment;
};

/**
 * Méthode statique pour trouver les calculs rentables
 * @param {number} minProfit - Profit minimum
 * @returns {Promise<FlipNapkinCalculation[]>} - Liste des calculs rentables
 */
FlipNapkinSchema.statics.findProfitable = function(minProfit = 0) {
    return this.find({ profit: { $gt: minProfit } }).sort({ profit: -1 });
};

/**
 * Méthode statique pour trouver les calculs les plus récents
 * @param {number} limit - Nombre de calculs à retourner
 * @returns {Promise<FlipNapkinCalculation[]>} - Liste des calculs récents
 */
FlipNapkinSchema.statics.findRecent = function(limit = 10) {
    return this.find().sort({ calculatedAt: -1 }).limit(limit);
};

// Création de l'index pour les recherches
FlipNapkinSchema.index({ profit: -1 });
FlipNapkinSchema.index({ calculatedAt: -1 });
FlipNapkinSchema.index({ userId: 1 });

module.exports = mongoose.model('FlipNapkin', FlipNapkinSchema);