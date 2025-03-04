/**
 * Contrôleur pour les calculs relatifs aux flips immobiliers
 */

/**
 * Calcule le profit d'un flip immobilier en utilisant la méthode FIP10
 * Formule: Prix Final - Prix Initial - Prix des Rénovations - 10% de la valeur de revente = Profit
 * 
 * @param {Object} req - Requête Express
 * @param {Object} req.body - Corps de la requête
 * @param {number} req.body.finalPrice - Prix final/de revente estimé
 * @param {number} req.body.initialPrice - Prix d'achat initial
 * @param {number} req.body.renovationCost - Coût estimé des rénovations
 * @param {Object} res - Réponse Express
 * @returns {Object} Résultat du calcul de profit
 */
exports.calculateProfit = (req, res) => {
    try {
        const { finalPrice, initialPrice, renovationCost } = req.body;

        // Validation des entrées
        if (!finalPrice || !initialPrice || renovationCost === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Tous les champs sont requis: finalPrice, initialPrice, renovationCost'
            });
        }

        // Conversion en nombres
        const finalPriceNum = Number(finalPrice);
        const initialPriceNum = Number(initialPrice);
        const renovationCostNum = Number(renovationCost);

        // Validation des nombres
        if (isNaN(finalPriceNum) || isNaN(initialPriceNum) || isNaN(renovationCostNum)) {
            return res.status(400).json({
                success: false,
                message: 'Tous les champs doivent être des nombres valides'
            });
        }

        // Calcul selon la méthode FIP10 (Final - Initial - Prix réno - 10% du final)
        const tenPercent = finalPriceNum * 0.1;
        const profit = finalPriceNum - initialPriceNum - renovationCostNum - tenPercent;

        // Préparation des détails de calcul pour la transparence
        const details = {
            finalPrice: finalPriceNum,
            initialPrice: initialPriceNum,
            renovationCost: renovationCostNum,
            expensesPercent: 10,
            expenses: tenPercent,
            formula: 'Final - Initial - Rénovations - 10% du prix final'
        };

        // Calcul du ROI (Return On Investment)
        const investment = initialPriceNum + renovationCostNum;
        const roi = (profit / investment) * 100;

        // Statut de rentabilité
        let profitStatus = 'neutral';
        if (profit > 25000) {
            profitStatus = 'excellent';
        } else if (profit > 0) {
            profitStatus = 'positive';
        } else {
            profitStatus = 'negative';
        }

        return res.status(200).json({
            success: true,
            data: {
                profit: profit,
                roi: roi,
                status: profitStatus,
                details: details
            }
        });
    } catch (error) {
        console.error('Erreur lors du calcul du profit:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors du calcul du profit',
            error: error.message
        });
    }
};

/**
 * Calcule l'offre optimale pour un flip immobilier
 * Formule: Valeur de revente - Coût des rénovations - 10% de la valeur de revente - Profit souhaité = Offre maximale
 * 
 * @param {Object} req - Requête Express
 * @param {Object} req.body - Corps de la requête
 * @param {number} req.body.finalPrice - Prix final/de revente estimé
 * @param {number} req.body.renovationCost - Coût estimé des rénovations
 * @param {number} req.body.desiredProfit - Profit minimum souhaité (par défaut 25000)
 * @param {Object} res - Réponse Express
 * @returns {Object} Résultat du calcul de l'offre optimale
 */
exports.calculateOffer = (req, res) => {
    try {
        const { finalPrice, renovationCost, desiredProfit = 25000 } = req.body;

        // Validation des entrées
        if (!finalPrice || renovationCost === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Les champs finalPrice et renovationCost sont requis'
            });
        }

        // Conversion en nombres
        const finalPriceNum = Number(finalPrice);
        const renovationCostNum = Number(renovationCost);
        const desiredProfitNum = Number(desiredProfit);

        // Validation des nombres
        if (isNaN(finalPriceNum) || isNaN(renovationCostNum) || isNaN(desiredProfitNum)) {
            return res.status(400).json({
                success: false,
                message: 'Tous les champs doivent être des nombres valides'
            });
        }

        // Calcul de l'offre maximale
        const tenPercent = finalPriceNum * 0.1;
        const maxOffer = finalPriceNum - renovationCostNum - tenPercent - desiredProfitNum;

        // Arrondir à la centaine inférieure pour une offre stratégique
        const strategicOffer = Math.floor(maxOffer / 1000) * 1000;

        // Préparation des détails de calcul
        const details = {
            finalPrice: finalPriceNum,
            renovationCost: renovationCostNum,
            expensesPercent: 10,
            expenses: tenPercent,
            desiredProfit: desiredProfitNum,
            formula: 'Final - Rénovations - 10% du prix final - Profit souhaité'
        };

        return res.status(200).json({
            success: true,
            data: {
                maxOffer: maxOffer,
                strategicOffer: strategicOffer,
                details: details
            }
        });
    } catch (error) {
        console.error('Erreur lors du calcul de l\'offre:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors du calcul de l\'offre',
            error: error.message
        });
    }
};