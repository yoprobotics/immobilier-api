/**
 * Contrôleur pour les calculs de taxe de mutation (taxe de bienvenue)
 */

/**
 * Calcule la taxe de mutation (taxe de bienvenue) pour une transaction immobilière au Québec
 * Formule basée sur les taux progressifs appliqués selon les tranches de valeur de la propriété
 * Taux généralement appliqués:
 * - 0.5% sur les premiers 50 000$
 * - 1.0% sur la tranche de 50 001$ à 250 000$
 * - 1.5% sur la tranche de 250 001$ à 500 000$
 * - 2.0% sur la tranche de 500 001$ à 1 000 000$
 * - 2.5% sur la tranche excédant 1 000 000$
 * 
 * Note: Les municipalités peuvent avoir des taux différents
 * 
 * @param {Object} req - Requête Express
 * @param {Object} req.body - Corps de la requête
 * @param {number} req.body.propertyValue - Valeur de la propriété
 * @param {string} req.body.municipality - Nom de la municipalité (optionnel)
 * @param {Object} res - Réponse Express
 * @returns {Object} Résultat du calcul de la taxe de mutation
 */
exports.calculateTax = (req, res) => {
    try {
        const { propertyValue, municipality } = req.body;

        // Validation de l'entrée
        if (!propertyValue) {
            return res.status(400).json({
                success: false,
                message: 'La valeur de la propriété est requise'
            });
        }

        // Conversion en nombre
        const propertyValueNum = Number(propertyValue);

        // Validation du nombre
        if (isNaN(propertyValueNum)) {
            return res.status(400).json({
                success: false,
                message: 'La valeur de la propriété doit être un nombre valide'
            });
        }

        // Définition des taux par défaut (taux standard au Québec)
        const defaultRates = [
            { threshold: 50000, rate: 0.005 },
            { threshold: 250000, rate: 0.01 },
            { threshold: 500000, rate: 0.015 },
            { threshold: 1000000, rate: 0.02 },
            { threshold: Infinity, rate: 0.025 }
        ];

        // Taux spécifiques pour certaines municipalités
        const municipalityRates = {
            'Montréal': [
                { threshold: 50000, rate: 0.005 },
                { threshold: 250000, rate: 0.01 },
                { threshold: 500000, rate: 0.015 },
                { threshold: 1000000, rate: 0.02 },
                { threshold: Infinity, rate: 0.025 }
            ],
            'Laval': [
                { threshold: 50000, rate: 0.005 },
                { threshold: 250000, rate: 0.01 },
                { threshold: 500000, rate: 0.015 },
                { threshold: 1000000, rate: 0.02 },
                { threshold: Infinity, rate: 0.025 }
            ],
            'Québec': [
                { threshold: 50000, rate: 0.005 },
                { threshold: 250000, rate: 0.01 },
                { threshold: 500000, rate: 0.015 },
                { threshold: Infinity, rate: 0.02 }
            ]
            // Ajouter d'autres municipalités au besoin
        };

        // Sélection des taux à utiliser
        const rates = municipality && municipalityRates[municipality] ? municipalityRates[municipality] : defaultRates;

        // Calcul de la taxe de mutation
        let remainingValue = propertyValueNum;
        let totalTax = 0;
        let previousThreshold = 0;
        const brackets = [];

        for (const { threshold, rate } of rates) {
            if (remainingValue <= 0) break;

            const bracketValue = Math.min(remainingValue, threshold - previousThreshold);
            const bracketTax = bracketValue * rate;
            
            totalTax += bracketTax;
            
            brackets.push({
                from: previousThreshold,
                to: previousThreshold + bracketValue,
                rate: rate * 100, // Convertir en pourcentage pour l'affichage
                amount: bracketTax
            });
            
            remainingValue -= bracketValue;
            previousThreshold = threshold;
        }

        // Arrondir au dollar près
        totalTax = Math.round(totalTax);

        return res.status(200).json({
            success: true,
            data: {
                propertyValue: propertyValueNum,
                municipality: municipality || 'Standard',
                mutationTax: totalTax,
                brackets: brackets
            }
        });
    } catch (error) {
        console.error('Erreur lors du calcul de la taxe de mutation:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors du calcul de la taxe de mutation',
            error: error.message
        });
    }
};