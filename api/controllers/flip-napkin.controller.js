/**
 * Contrôleur pour le calculateur Napkin Flip
 */
const FlipNapkinModel = require('../models/flip-napkin.model');

/**
 * Calculer le profit d'un flip immobilier
 * @param {Object} req - Requête HTTP
 * @param {Object} res - Réponse HTTP
 */
exports.calculate = async (req, res) => {
    try {
        const { finalPrice, initialPrice, renoPrice } = req.body;
        
        // Validation des données
        if (!finalPrice || !initialPrice || renoPrice === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Données incomplètes. Veuillez fournir finalPrice, initialPrice et renoPrice.'
            });
        }
        
        // Conversion en nombres
        const finalPriceNum = Number(finalPrice);
        const initialPriceNum = Number(initialPrice);
        const renoPriceNum = Number(renoPrice);
        
        // Vérification que les valeurs sont des nombres valides
        if (isNaN(finalPriceNum) || isNaN(initialPriceNum) || isNaN(renoPriceNum)) {
            return res.status(400).json({
                success: false,
                error: 'Les valeurs doivent être des nombres valides.'
            });
        }
        
        // Calcul du 10% de la valeur de revente
        const tenPercent = finalPriceNum * 0.1;
        
        // Calcul du profit
        const profit = finalPriceNum - initialPriceNum - renoPriceNum - tenPercent;
        
        // Sauvegarde du calcul dans la base de données (optionnel)
        const calculation = await FlipNapkinModel.create({
            finalPrice: finalPriceNum,
            initialPrice: initialPriceNum,
            renoPrice: renoPriceNum,
            tenPercent,
            profit,
            calculatedAt: new Date()
        });
        
        // Réponse
        res.status(200).json({
            success: true,
            data: {
                finalPrice: finalPriceNum,
                initialPrice: initialPriceNum,
                renoPrice: renoPriceNum,
                tenPercent,
                profit,
                calculationId: calculation ? calculation._id : null
            }
        });
    } catch (error) {
        console.error('Erreur lors du calcul du profit Napkin Flip:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors du calcul du profit Napkin Flip.',
            details: error.message
        });
    }
};

/**
 * Récupérer l'historique des calculs
 * @param {Object} req - Requête HTTP
 * @param {Object} res - Réponse HTTP
 */
exports.getHistory = async (req, res) => {
    try {
        // Récupération des paramètres de pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Récupération des calculs
        const calculations = await FlipNapkinModel.find()
            .sort({ calculatedAt: -1 })
            .skip(skip)
            .limit(limit);
        
        // Comptage du nombre total de calculs
        const total = await FlipNapkinModel.countDocuments();
        
        // Réponse
        res.status(200).json({
            success: true,
            data: {
                calculations,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique des calculs Napkin Flip:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération de l\'historique des calculs Napkin Flip.',
            details: error.message
        });
    }
};