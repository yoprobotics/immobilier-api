/**
 * Contrôleur pour les calculs de coûts de rénovation
 */

/**
 * Calcule le coût total des rénovations en fonction des pièces et travaux spécifiés
 * 
 * @param {Object} req - Requête Express
 * @param {Object} req.body - Corps de la requête
 * @param {Array} req.body.renovationItems - Liste des items de rénovation
 * @param {number} req.body.contingencyPercentage - Pourcentage de contingence pour imprévus (défaut: 10)
 * @param {Object} res - Réponse Express
 * @returns {Object} Résultat du calcul du coût total de rénovation
 */
exports.calculateCost = (req, res) => {
    try {
        const { renovationItems, contingencyPercentage = 10 } = req.body;

        // Validation des entrées
        if (!renovationItems || !Array.isArray(renovationItems)) {
            return res.status(400).json({
                success: false,
                message: 'Une liste d\'items de rénovation est requise'
            });
        }

        // Conversion en nombre
        const contingencyPercentageNum = Number(contingencyPercentage);

        // Validation du nombre
        if (isNaN(contingencyPercentageNum)) {
            return res.status(400).json({
                success: false,
                message: 'Le pourcentage de contingence doit être un nombre valide'
            });
        }

        // Calcul du coût total par catégorie
        const categoryTotals = {};
        let subtotal = 0;

        // Traitement de chaque item de rénovation
        renovationItems.forEach(item => {
            // Validation de l'item
            if (!item.name || item.cost === undefined) {
                return; // Ignorer les items invalides
            }

            const cost = Number(item.cost);
            if (isNaN(cost)) {
                return; // Ignorer les coûts non numériques
            }

            // Ajout au total par catégorie
            const category = item.category || 'Autre';
            if (!categoryTotals[category]) {
                categoryTotals[category] = 0;
            }
            categoryTotals[category] += cost;
            subtotal += cost;
        });

        // Calcul de la contingence pour imprévus
        const contingencyAmount = subtotal * (contingencyPercentageNum / 100);
        const totalCost = subtotal + contingencyAmount;

        // Renvoyer les résultats
        return res.status(200).json({
            success: true,
            data: {
                subtotal: subtotal,
                contingencyPercentage: contingencyPercentageNum,
                contingencyAmount: contingencyAmount,
                totalCost: totalCost,
                categoryBreakdown: categoryTotals
            }
        });
    } catch (error) {
        console.error('Erreur lors du calcul du coût de rénovation:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors du calcul du coût de rénovation',
            error: error.message
        });
    }
};

/**
 * Fournit des estimations de coûts par pièce selon la méthode Immofacile à 500$
 * 
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Object} Liste des estimations de rénovation par catégorie et pièce
 */
exports.getEstimates = (req, res) => {
    try {
        // Définition des estimations de base par la méthode 500$
        const estimates = {
            pieces: {
                cuisine: {
                    base: 10000,
                    description: 'Rénovation de base d\'une cuisine',
                    options: [
                        { name: 'Armoires standard', cost: 5000 },
                        { name: 'Armoires haut de gamme', cost: 10000 },
                        { name: 'Comptoir stratifié', cost: 1000 },
                        { name: 'Comptoir quartz', cost: 3000 },
                        { name: 'Évier et robinet', cost: 500 },
                        { name: 'Électroménagers', cost: 3000 },
                        { name: 'Plancher', cost: 1500 },
                        { name: 'Éclairage', cost: 500 }
                    ]
                },
                salleDeBain: {
                    base: 5000,
                    description: 'Rénovation de base d\'une salle de bain complète',
                    options: [
                        { name: 'Bain standard', cost: 1000 },
                        { name: 'Douche préfabriquée', cost: 1500 },
                        { name: 'Douche en céramique', cost: 3000 },
                        { name: 'Vanité standard', cost: 1000 },
                        { name: 'Vanité haut de gamme', cost: 2000 },
                        { name: 'Toilette', cost: 500 },
                        { name: 'Plancher', cost: 1000 },
                        { name: 'Éclairage', cost: 500 }
                    ]
                },
                salleEau: {
                    base: 3000,
                    description: 'Rénovation de base d\'une salle d\'eau',
                    options: [
                        { name: 'Vanité standard', cost: 500 },
                        { name: 'Vanité haut de gamme', cost: 1500 },
                        { name: 'Toilette', cost: 500 },
                        { name: 'Plancher', cost: 500 },
                        { name: 'Éclairage', cost: 500 }
                    ]
                },
                chambre: {
                    base: 2000,
                    description: 'Rénovation de base d\'une chambre',
                    options: [
                        { name: 'Peinture', cost: 500 },
                        { name: 'Plancher', cost: 1500 },
                        { name: 'Garde-robe', cost: 1000 },
                        { name: 'Éclairage', cost: 500 }
                    ]
                },
                salon: {
                    base: 2500,
                    description: 'Rénovation de base d\'un salon',
                    options: [
                        { name: 'Peinture', cost: 500 },
                        { name: 'Plancher', cost: 2000 },
                        { name: 'Éclairage', cost: 500 },
                        { name: 'Foyer', cost: 3000 }
                    ]
                },
                salleAManger: {
                    base: 2000,
                    description: 'Rénovation de base d\'une salle à manger',
                    options: [
                        { name: 'Peinture', cost: 500 },
                        { name: 'Plancher', cost: 1500 },
                        { name: 'Éclairage', cost: 500 }
                    ]
                },
                sousSol: {
                    base: 10000,
                    description: 'Rénovation de base d\'un sous-sol',
                    options: [
                        { name: 'Isolation des murs', cost: 3000 },
                        { name: 'Gypse et peinture', cost: 5000 },
                        { name: 'Plancher', cost: 3000 },
                        { name: 'Éclairage', cost: 1000 },
                        { name: 'Salle de bain', cost: 5000 }
                    ]
                }
            },
            elements: {
                portesFenetres: {
                    description: 'Portes et fenêtres',
                    items: [
                        { name: 'Porte extérieure', cost: 1500 },
                        { name: 'Porte intérieure + porte de garde-robe', cost: 500 },
                        { name: 'Fenêtre sous-sol', cost: 500 },
                        { name: 'Fenêtre chambre', cost: 500 },
                        { name: 'Fenêtre salon', cost: 1500 }
                    ]
                },
                plancherRevetements: {
                    description: 'Planchers et revêtements',
                    items: [
                        { name: 'Plancher flottant (par pied carré)', cost: 5, unit: 'pied carré' },
                        { name: 'Céramique (par pied carré)', cost: 8, unit: 'pied carré' },
                        { name: 'Bois franc (par pied carré)', cost: 10, unit: 'pied carré' },
                        { name: 'Peinture (par gallon)', cost: 500, unit: 'gallon' }
                    ]
                },
                salleDeBainElements: {
                    description: 'Éléments de salle de bain',
                    items: [
                        { name: 'Bain', cost: 1000 },
                        { name: 'Toilette', cost: 500 },
                        { name: 'Vanité', cost: 1000 },
                        { name: 'Robinetterie', cost: 500 }
                    ]
                },
                cuisineElements: {
                    description: 'Éléments de cuisine',
                    items: [
                        { name: 'Armoires complètes', cost: 5000 },
                        { name: 'Comptoir', cost: 1500 },
                        { name: 'Évier et robinet', cost: 500 },
                        { name: 'Dosseret', cost: 500 }
                    ]
                },
                electromecanique: {
                    description: 'Électricité et mécanique',
                    items: [
                        { name: 'Panneau électrique', cost: 1500 },
                        { name: 'Prise électrique ou interrupteur', cost: 500 },
                        { name: 'Éclairage', cost: 500 },
                        { name: 'Chauffe-eau', cost: 1000 },
                        { name: 'Plomberie de base', cost: 2000 }
                    ]
                },
                exterieur: {
                    description: 'Rénovations extérieures',
                    items: [
                        { name: 'Toiture (par 100 pi²)', cost: 1500, unit: '100 pi²' },
                        { name: 'Revêtement extérieur (par 100 pi²)', cost: 2000, unit: '100 pi²' },
                        { name: 'Balcon', cost: 2500 },
                        { name: 'Aménagement paysager de base', cost: 3000 }
                    ]
                }
            }
        };

        return res.status(200).json({
            success: true,
            data: estimates
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des estimations:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des estimations',
            error: error.message
        });
    }
};