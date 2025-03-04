/**
 * Contrôleur pour les calculs hypothécaires
 */

/**
 * Calcule le paiement mensuel d'un prêt hypothécaire
 * Formule: PMT = P * [r(1+r)^n] / [(1+r)^n - 1]
 * où P = principal (montant du prêt), r = taux d'intérêt périodique, n = nombre de périodes
 * 
 * @param {Object} req - Requête Express
 * @param {Object} req.body - Corps de la requête
 * @param {number} req.body.loanAmount - Montant du prêt
 * @param {number} req.body.interestRate - Taux d'intérêt annuel (en pourcentage)
 * @param {number} req.body.amortizationPeriod - Période d'amortissement (en années)
 * @param {string} req.body.paymentFrequency - Fréquence des paiements (mensuel, bimensuel, etc.)
 * @param {Object} res - Réponse Express
 * @returns {Object} Résultat du calcul de paiement hypothécaire
 */
exports.calculatePayment = (req, res) => {
    try {
        const { loanAmount, interestRate, amortizationPeriod, paymentFrequency = 'monthly' } = req.body;

        // Validation des entrées
        if (!loanAmount || !interestRate || !amortizationPeriod) {
            return res.status(400).json({
                success: false,
                message: 'Les champs loanAmount, interestRate et amortizationPeriod sont requis'
            });
        }

        // Conversion en nombres
        const loanAmountNum = Number(loanAmount);
        const interestRateNum = Number(interestRate);
        const amortizationPeriodNum = Number(amortizationPeriod);

        // Validation des nombres
        if (isNaN(loanAmountNum) || isNaN(interestRateNum) || isNaN(amortizationPeriodNum)) {
            return res.status(400).json({
                success: false,
                message: 'Tous les champs doivent être des nombres valides'
            });
        }

        // Définition des facteurs de fréquence de paiement
        const frequencyFactors = {
            'monthly': { paymentsPerYear: 12, name: 'mensuel' },
            'semi-monthly': { paymentsPerYear: 24, name: 'bimensuel' },
            'bi-weekly': { paymentsPerYear: 26, name: 'aux deux semaines' },
            'weekly': { paymentsPerYear: 52, name: 'hebdomadaire' },
            'accelerated-weekly': { paymentsPerYear: 52, name: 'hebdomadaire accéléré', accelerated: true },
            'accelerated-bi-weekly': { paymentsPerYear: 26, name: 'aux deux semaines accéléré', accelerated: true }
        };

        // Utilisation du facteur de fréquence spécifié ou par défaut mensuel
        const frequencyFactor = frequencyFactors[paymentFrequency] || frequencyFactors['monthly'];
        
        // Taux d'intérêt ajusté pour la période
        const periodicInterestRate = (interestRateNum / 100) / frequencyFactor.paymentsPerYear;
        
        // Nombre total de paiements
        const numberOfPayments = amortizationPeriodNum * frequencyFactor.paymentsPerYear;

        // Paiement de base (formule standard PMT)
        let payment;
        
        if (frequencyFactor.accelerated) {
            // Pour les paiements accélérés, on calcule d'abord le paiement mensuel
            const monthlyInterestRate = (interestRateNum / 100) / 12;
            const monthlyPayment = loanAmountNum * 
                (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, amortizationPeriodNum * 12)) / 
                (Math.pow(1 + monthlyInterestRate, amortizationPeriodNum * 12) - 1);
            
            // Puis on ajuste pour le paiement accéléré
            payment = (monthlyPayment * 12) / frequencyFactor.paymentsPerYear;
        } else {
            // Calcul standard pour les paiements non accélérés
            payment = loanAmountNum * 
                (periodicInterestRate * Math.pow(1 + periodicInterestRate, numberOfPayments)) / 
                (Math.pow(1 + periodicInterestRate, numberOfPayments) - 1);
        }

        // Arrondir au cent près
        payment = Math.round(payment * 100) / 100;

        // Calcul des paiements totaux et des intérêts totaux
        const totalPayments = payment * numberOfPayments;
        const totalInterest = totalPayments - loanAmountNum;

        return res.status(200).json({
            success: true,
            data: {
                payment: payment,
                frequency: frequencyFactor.name,
                paymentsPerYear: frequencyFactor.paymentsPerYear,
                numberOfPayments: numberOfPayments,
                totalPayments: totalPayments,
                totalInterest: totalInterest,
                interestToLoanRatio: (totalInterest / loanAmountNum) * 100
            }
        });
    } catch (error) {
        console.error('Erreur lors du calcul du paiement hypothécaire:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors du calcul du paiement hypothécaire',
            error: error.message
        });
    }
};

/**
 * Génère un tableau d'amortissement pour un prêt hypothécaire
 * 
 * @param {Object} req - Requête Express
 * @param {Object} req.body - Corps de la requête
 * @param {number} req.body.loanAmount - Montant du prêt
 * @param {number} req.body.interestRate - Taux d'intérêt annuel (en pourcentage)
 * @param {number} req.body.amortizationPeriod - Période d'amortissement (en années)
 * @param {string} req.body.paymentFrequency - Fréquence des paiements (mensuel, bimensuel, etc.)
 * @param {number} req.body.termYears - Durée du terme (en années, généralement 5 ans)
 * @param {Object} res - Réponse Express
 * @returns {Object} Tableau d'amortissement
 */
exports.generateAmortizationTable = (req, res) => {
    try {
        const { 
            loanAmount, 
            interestRate, 
            amortizationPeriod, 
            paymentFrequency = 'monthly',
            termYears = 5
        } = req.body;

        // Validation des entrées
        if (!loanAmount || !interestRate || !amortizationPeriod) {
            return res.status(400).json({
                success: false,
                message: 'Les champs loanAmount, interestRate et amortizationPeriod sont requis'
            });
        }

        // Conversion en nombres
        const loanAmountNum = Number(loanAmount);
        const interestRateNum = Number(interestRate);
        const amortizationPeriodNum = Number(amortizationPeriod);
        const termYearsNum = Number(termYears);

        // Validation des nombres
        if (isNaN(loanAmountNum) || isNaN(interestRateNum) || isNaN(amortizationPeriodNum) || isNaN(termYearsNum)) {
            return res.status(400).json({
                success: false,
                message: 'Tous les champs doivent être des nombres valides'
            });
        }

        // Définition des facteurs de fréquence de paiement
        const frequencyFactors = {
            'monthly': { paymentsPerYear: 12, name: 'mensuel' },
            'semi-monthly': { paymentsPerYear: 24, name: 'bimensuel' },
            'bi-weekly': { paymentsPerYear: 26, name: 'aux deux semaines' },
            'weekly': { paymentsPerYear: 52, name: 'hebdomadaire' },
            'accelerated-weekly': { paymentsPerYear: 52, name: 'hebdomadaire accéléré', accelerated: true },
            'accelerated-bi-weekly': { paymentsPerYear: 26, name: 'aux deux semaines accéléré', accelerated: true }
        };

        // Utilisation du facteur de fréquence spécifié ou par défaut mensuel
        const frequencyFactor = frequencyFactors[paymentFrequency] || frequencyFactors['monthly'];
        
        // Taux d'intérêt ajusté pour la période
        const periodicInterestRate = (interestRateNum / 100) / frequencyFactor.paymentsPerYear;
        
        // Nombre total de paiements sur la période d'amortissement
        const totalNumberOfPayments = amortizationPeriodNum * frequencyFactor.paymentsPerYear;
        
        // Nombre de paiements pour le terme spécifié
        const numberOfPaymentsInTerm = Math.min(
            termYearsNum * frequencyFactor.paymentsPerYear,
            totalNumberOfPayments
        );

        // Calcul du paiement périodique
        let payment;
        
        if (frequencyFactor.accelerated) {
            // Pour les paiements accélérés
            const monthlyInterestRate = (interestRateNum / 100) / 12;
            const monthlyPayment = loanAmountNum * 
                (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, amortizationPeriodNum * 12)) / 
                (Math.pow(1 + monthlyInterestRate, amortizationPeriodNum * 12) - 1);
            
            payment = (monthlyPayment * 12) / frequencyFactor.paymentsPerYear;
        } else {
            // Calcul standard
            payment = loanAmountNum * 
                (periodicInterestRate * Math.pow(1 + periodicInterestRate, totalNumberOfPayments)) / 
                (Math.pow(1 + periodicInterestRate, totalNumberOfPayments) - 1);
        }

        // Arrondir au cent près
        payment = Math.round(payment * 100) / 100;

        // Génération du tableau d'amortissement
        const amortizationTable = [];
        let remainingBalance = loanAmountNum;
        let totalInterestPaid = 0;
        let totalPrincipalPaid = 0;

        for (let i = 1; i <= numberOfPaymentsInTerm; i++) {
            const interestPayment = remainingBalance * periodicInterestRate;
            const principalPayment = payment - interestPayment;
            
            remainingBalance -= principalPayment;
            
            totalInterestPaid += interestPayment;
            totalPrincipalPaid += principalPayment;

            // Pour éviter les erreurs d'arrondi à la fin
            if (i === totalNumberOfPayments) {
                remainingBalance = 0;
            }

            amortizationTable.push({
                paymentNumber: i,
                payment: payment,
                principalPayment: Math.round(principalPayment * 100) / 100,
                interestPayment: Math.round(interestPayment * 100) / 100,
                remainingBalance: Math.max(0, Math.round(remainingBalance * 100) / 100),
                totalInterestPaid: Math.round(totalInterestPaid * 100) / 100,
                totalPrincipalPaid: Math.round(totalPrincipalPaid * 100) / 100
            });
        }

        // Calcul des totaux pour le terme
        const termPayments = payment * numberOfPaymentsInTerm;
        const termInterest = totalInterestPaid;
        const termPrincipal = totalPrincipalPaid;
        const balanceAtEndOfTerm = remainingBalance;

        // Calcul des totaux pour l'amortissement complet
        const totalPayments = payment * totalNumberOfPayments;
        const totalInterest = totalPayments - loanAmountNum;

        return res.status(200).json({
            success: true,
            data: {
                payment: payment,
                frequency: frequencyFactor.name,
                termYears: termYearsNum,
                amortizationPeriod: amortizationPeriodNum,
                termSummary: {
                    numberOfPayments: numberOfPaymentsInTerm,
                    totalPayments: termPayments,
                    totalInterest: termInterest,
                    totalPrincipal: termPrincipal,
                    balanceAtEndOfTerm: balanceAtEndOfTerm
                },
                totalSummary: {
                    numberOfPayments: totalNumberOfPayments,
                    totalPayments: totalPayments,
                    totalInterest: totalInterest,
                    interestToLoanRatio: (totalInterest / loanAmountNum) * 100
                },
                amortizationTable: amortizationTable
            }
        });
    } catch (error) {
        console.error('Erreur lors de la génération du tableau d\'amortissement:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la génération du tableau d\'amortissement',
            error: error.message
        });
    }
};