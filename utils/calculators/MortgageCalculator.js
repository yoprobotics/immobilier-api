/**
 * Calculateur d'hypothèque
 * 
 * Ce calculateur permet de calculer les paiements hypothécaires
 * et de générer un tableau d'amortissement
 */

class MortgageCalculator {
  /**
   * Calcule le paiement hypothécaire mensuel
   * 
   * @param {number} loanAmount - Montant du prêt hypothécaire
   * @param {number} interestRate - Taux d'intérêt annuel (en pourcentage)
   * @param {number} amortizationPeriod - Période d'amortissement (en années)
   * @param {string} paymentFrequency - Fréquence des paiements (mensuel, bimensuel, hebdomadaire, etc.)
   * @returns {Object} Résultat du calcul avec détails
   */
  static calculate(loanAmount, interestRate, amortizationPeriod, paymentFrequency = 'monthly') {
    // Validation des entrées
    if (isNaN(loanAmount) || loanAmount <= 0) {
      throw new Error('Le montant du prêt doit être un nombre positif');
    }
    
    if (isNaN(interestRate) || interestRate <= 0) {
      throw new Error('Le taux d\'intérêt doit être un nombre positif');
    }
    
    if (isNaN(amortizationPeriod) || amortizationPeriod <= 0 || !Number.isInteger(amortizationPeriod)) {
      throw new Error('La période d\'amortissement doit être un entier positif');
    }

    // Conversion du taux d'intérêt annuel en taux périodique
    const paymentsPerYear = this.getPaymentsPerYear(paymentFrequency);
    const numberOfPayments = amortizationPeriod * paymentsPerYear;
    const periodicInterestRate = (interestRate / 100) / paymentsPerYear;

    // Calcul du paiement périodique (formule du prêt à remboursements constants)
    const periodicPayment = loanAmount * 
      (periodicInterestRate * Math.pow((1 + periodicInterestRate), numberOfPayments)) / 
      (Math.pow((1 + periodicInterestRate), numberOfPayments) - 1);

    // Calcul des intérêts totaux
    const totalPayments = periodicPayment * numberOfPayments;
    const totalInterest = totalPayments - loanAmount;

    // Conversion en paiement mensuel pour comparaison
    const monthlyEquivalent = paymentFrequency === 'monthly' 
      ? periodicPayment 
      : this.convertToMonthlyPayment(periodicPayment, paymentFrequency);

    // Génération du tableau d'amortissement pour la première année
    const amortizationSchedule = this.generateAmortizationSchedule(
      loanAmount, 
      periodicInterestRate, 
      periodicPayment, 
      Math.min(numberOfPayments, paymentsPerYear) // Première année seulement
    );

    return {
      loanAmount,
      interestRate,
      amortizationPeriod,
      paymentFrequency,
      paymentsPerYear,
      numberOfPayments,
      periodicPayment: parseFloat(periodicPayment.toFixed(2)),
      totalPayments: parseFloat(totalPayments.toFixed(2)),
      totalInterest: parseFloat(totalInterest.toFixed(2)),
      monthlyEquivalent: parseFloat(monthlyEquivalent.toFixed(2)),
      amortizationSchedule,
      summary: {
        monthlyPayment: parseFloat(monthlyEquivalent.toFixed(2)),
        yearlyPayment: parseFloat((monthlyEquivalent * 12).toFixed(2)),
        totalInterest: parseFloat(totalInterest.toFixed(2)),
        totalCost: parseFloat((loanAmount + totalInterest).toFixed(2))
      }
    };
  }

  /**
   * Retourne le nombre de paiements par année selon la fréquence
   * 
   * @param {string} frequency - Fréquence des paiements
   * @returns {number} Nombre de paiements par année
   */
  static getPaymentsPerYear(frequency) {
    const frequencies = {
      'accelerated_weekly': 52,
      'weekly': 52,
      'accelerated_biweekly': 26,
      'biweekly': 26,
      'monthly': 12,
      'bimonthly': 6,
      'quarterly': 4,
      'semi_annually': 2,
      'annually': 1
    };

    return frequencies[frequency] || 12; // Par défaut, mensuel
  }

  /**
   * Convertit un paiement périodique en équivalent mensuel
   * 
   * @param {number} periodicPayment - Paiement périodique
   * @param {string} frequency - Fréquence des paiements
   * @returns {number} Équivalent mensuel du paiement
   */
  static convertToMonthlyPayment(periodicPayment, frequency) {
    const paymentsPerYear = this.getPaymentsPerYear(frequency);
    
    // Pour les paiements accélérés, le calcul est différent
    if (frequency === 'accelerated_weekly') {
      return (periodicPayment * 52) / 12;
    } else if (frequency === 'accelerated_biweekly') {
      return (periodicPayment * 26) / 12;
    } else {
      return (periodicPayment * paymentsPerYear) / 12;
    }
  }

  /**
   * Génère un tableau d'amortissement pour un nombre défini de paiements
   * 
   * @param {number} loanAmount - Montant du prêt
   * @param {number} periodicInterestRate - Taux d'intérêt périodique
   * @param {number} periodicPayment - Paiement périodique
   * @param {number} numberOfPayments - Nombre de paiements à générer
   * @returns {Array} Tableau d'amortissement
   */
  static generateAmortizationSchedule(loanAmount, periodicInterestRate, periodicPayment, numberOfPayments) {
    let remainingBalance = loanAmount;
    const schedule = [];

    for (let i = 1; i <= numberOfPayments; i++) {
      const interestPayment = remainingBalance * periodicInterestRate;
      const principalPayment = periodicPayment - interestPayment;
      remainingBalance -= principalPayment;

      schedule.push({
        paymentNumber: i,
        payment: parseFloat(periodicPayment.toFixed(2)),
        principalPayment: parseFloat(principalPayment.toFixed(2)),
        interestPayment: parseFloat(interestPayment.toFixed(2)),
        remainingBalance: parseFloat(remainingBalance.toFixed(2))
      });
    }

    return schedule;
  }
}

module.exports = MortgageCalculator;