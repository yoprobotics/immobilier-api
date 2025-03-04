/**
 * Contrôleur pour les calculs relatifs aux immeubles multi-logements
 */

/**
 * Calcule la rentabilité d'un immeuble multi-logements utilisant la méthode PAR
 * Formule: 
 * 1. Déterminer le % de dépenses en fonction du nombre d'appartements
 * 2. Calculer le RNO (Revenu Net d'Opération) = Revenus bruts - Dépenses
 * 3. Calculer le financement = Prix d'achat * 0.005 * 12
 * 4. Calculer la liquidité (cashflow) = RNO - Financement
 * 5. Calculer le cashflow par porte = Liquidité / nombre d'appartements / 12
 * 
 * @param {Object} req - Requête Express
 * @param {Object} req.body - Corps de la requête
 * @param {number} req.body.purchasePrice - Prix d'achat de l'immeuble
 * @param {number} req.body.apartmentCount - Nombre d'appartements
 * @param {number} req.body.grossRevenue - Revenus bruts annuels
 * @param {Object} res - Réponse Express
 * @returns {Object} Résultat du calcul de rentabilité
 */
exports.calculateRentability = (req, res) => {
    try {
        const { purchasePrice, apartmentCount, grossRevenue } = req.body;

        // Validation des entrées
        if (!purchasePrice || !apartmentCount || !grossRevenue) {
            return res.status(400).json({
                success: false,
                message: 'Tous les champs sont requis: purchasePrice, apartmentCount, grossRevenue'
            });
        }

        // Conversion en nombres
        const purchasePriceNum = Number(purchasePrice);
        const apartmentCountNum = Number(apartmentCount);
        const grossRevenueNum = Number(grossRevenue);

        // Validation des nombres
        if (isNaN(purchasePriceNum) || isNaN(apartmentCountNum) || isNaN(grossRevenueNum)) {
            return res.status(400).json({
                success: false,
                message: 'Tous les champs doivent être des nombres valides'
            });
        }

        // Détermination du pourcentage des dépenses selon le nombre d'appartements
        let expensesPercentage;
        if (apartmentCountNum <= 2) {
            expensesPercentage = 30;
        } else if (apartmentCountNum <= 4) {
            expensesPercentage = 35;
        } else if (apartmentCountNum <= 6) {
            expensesPercentage = 45;
        } else {
            expensesPercentage = 50;
        }

        // Calcul des dépenses d'opération
        const operatingExpenses = grossRevenueNum * (expensesPercentage / 100);

        // Calcul des revenus nets d'opération (RNO)
        const netOperatingIncome = grossRevenueNum - operatingExpenses;

        // Calcul du financement (méthode HIGH-5)
        const financing = purchasePriceNum * 0.005 * 12;

        // Calcul de la liquidité (cashflow)
        const cashflow = netOperatingIncome - financing;

        // Calcul du cashflow par porte par mois
        const cashflowPerUnitPerMonth = cashflow / apartmentCountNum / 12;

        // Préparation des détails de calcul
        const details = {
            purchasePrice: purchasePriceNum,
            apartmentCount: apartmentCountNum,
            grossRevenue: grossRevenueNum,
            expensesPercentage: expensesPercentage,
            operatingExpenses: operatingExpenses,
            netOperatingIncome: netOperatingIncome,
            financing: financing,
            formula: 'RNO (Revenus - Dépenses) - Financement'
        };

        // Évaluation de la rentabilité
        let rentabilityStatus;
        if (cashflowPerUnitPerMonth >= 75) {
            rentabilityStatus = 'excellent';
        } else if (cashflowPerUnitPerMonth >= 50) {
            rentabilityStatus = 'good';
        } else if (cashflowPerUnitPerMonth > 0) {
            rentabilityStatus = 'moderate';
        } else {
            rentabilityStatus = 'poor';
        }

        // Calcul du rendement (ROI) sur la mise de fonds estimée à 20% du prix d'achat
        const estimatedDownPayment = purchasePriceNum * 0.2;
        const annualROI = (cashflow / estimatedDownPayment) * 100;

        return res.status(200).json({
            success: true,
            data: {
                cashflow: cashflow,
                cashflowPerUnitPerMonth: cashflowPerUnitPerMonth,
                netOperatingIncome: netOperatingIncome,
                rentabilityStatus: rentabilityStatus,
                annualROI: annualROI,
                details: details
            }
        });
    } catch (error) {
        console.error('Erreur lors du calcul de rentabilité:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors du calcul de rentabilité',
            error: error.message
        });
    }
};

/**
 * Calcule l'offre optimale pour un immeuble multi-logements
 * Formule: Détermine le prix d'achat maximal pour obtenir un cashflow cible par porte
 * 
 * @param {Object} req - Requête Express
 * @param {Object} req.body - Corps de la requête
 * @param {number} req.body.apartmentCount - Nombre d'appartements
 * @param {number} req.body.grossRevenue - Revenus bruts annuels
 * @param {number} req.body.targetCashflowPerUnit - Cashflow cible par porte par mois (défaut: 75)
 * @param {Object} res - Réponse Express
 * @returns {Object} Résultat du calcul de l'offre optimale
 */
exports.calculateOffer = (req, res) => {
    try {
        const { apartmentCount, grossRevenue, targetCashflowPerUnit = 75 } = req.body;

        // Validation des entrées
        if (!apartmentCount || !grossRevenue) {
            return res.status(400).json({
                success: false,
                message: 'Les champs apartmentCount et grossRevenue sont requis'
            });
        }

        // Conversion en nombres
        const apartmentCountNum = Number(apartmentCount);
        const grossRevenueNum = Number(grossRevenue);
        const targetCashflowPerUnitNum = Number(targetCashflowPerUnit);

        // Validation des nombres
        if (isNaN(apartmentCountNum) || isNaN(grossRevenueNum) || isNaN(targetCashflowPerUnitNum)) {
            return res.status(400).json({
                success: false,
                message: 'Tous les champs doivent être des nombres valides'
            });
        }

        // Détermination du pourcentage des dépenses selon le nombre d'appartements
        let expensesPercentage;
        if (apartmentCountNum <= 2) {
            expensesPercentage = 30;
        } else if (apartmentCountNum <= 4) {
            expensesPercentage = 35;
        } else if (apartmentCountNum <= 6) {
            expensesPercentage = 45;
        } else {
            expensesPercentage = 50;
        }

        // Calcul des dépenses d'opération
        const operatingExpenses = grossRevenueNum * (expensesPercentage / 100);

        // Calcul des revenus nets d'opération (RNO)
        const netOperatingIncome = grossRevenueNum - operatingExpenses;

        // Cashflow annuel cible total
        const targetAnnualCashflow = targetCashflowPerUnitNum * apartmentCountNum * 12;

        // Calcul du financement maximal acceptable
        const maxFinancing = netOperatingIncome - targetAnnualCashflow;

        // Calcul du prix d'achat maximal (méthode HIGH-5 inversée)
        const maxPurchasePrice = maxFinancing / (0.005 * 12);

        // Arrondir à la dizaine de milliers inférieure pour une offre stratégique
        const strategicOffer = Math.floor(maxPurchasePrice / 10000) * 10000;

        // Préparation des détails de calcul
        const details = {
            apartmentCount: apartmentCountNum,
            grossRevenue: grossRevenueNum,
            expensesPercentage: expensesPercentage,
            operatingExpenses: operatingExpenses,
            netOperatingIncome: netOperatingIncome,
            targetCashflowPerUnit: targetCashflowPerUnitNum,
            targetAnnualCashflow: targetAnnualCashflow,
            maxFinancing: maxFinancing,
            formula: 'Prix d\'achat = Financement maximal / (0.005 * 12)'
        };

        return res.status(200).json({
            success: true,
            data: {
                maxPurchasePrice: maxPurchasePrice,
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