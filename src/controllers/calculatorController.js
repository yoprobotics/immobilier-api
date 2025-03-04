// @desc    Calculer la rentabilité d'un flip (méthode Napkin)
// @route   POST /api/calculators/flip-napkin
// @access  Private
exports.calculateFlipNapkin = async (req, res, next) => {
  try {
    const { finalPrice, initialPrice, renovationCost } = req.body;
    
    // Validation des champs requis
    if (!finalPrice || !initialPrice) {
      return res.status(400).json({
        success: false,
        message: 'Le prix final et le prix initial sont requis'
      });
    }
    
    // Conversion en nombres
    const finalPriceNum = Number(finalPrice);
    const initialPriceNum = Number(initialPrice);
    const renovationCostNum = Number(renovationCost || 0);
    
    // Calcul avec la méthode Napkin FIP10
    const expenses = finalPriceNum * 0.1; // 10% de la valeur de revente
    const profit = finalPriceNum - initialPriceNum - renovationCostNum - expenses;
    
    res.status(200).json({
      success: true,
      data: {
        finalPrice: finalPriceNum,
        initialPrice: initialPriceNum,
        renovationCost: renovationCostNum,
        expenses,
        profit
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Calculer le montant de l'offre pour un flip (méthode Napkin)
// @route   POST /api/calculators/flip-offer
// @access  Private
exports.calculateFlipOffer = async (req, res, next) => {
  try {
    const { finalPrice, renovationCost, targetProfit } = req.body;
    
    // Validation des champs requis
    if (!finalPrice) {
      return res.status(400).json({
        success: false,
        message: 'Le prix final est requis'
      });
    }
    
    // Conversion en nombres
    const finalPriceNum = Number(finalPrice);
    const renovationCostNum = Number(renovationCost || 0);
    const targetProfitNum = Number(targetProfit || 25000); // Profit cible par défaut
    
    // Calcul du montant de l'offre
    const expenses = finalPriceNum * 0.1; // 10% de la valeur de revente
    const offerAmount = finalPriceNum - renovationCostNum - expenses - targetProfitNum;
    
    res.status(200).json({
      success: true,
      data: {
        finalPrice: finalPriceNum,
        renovationCost: renovationCostNum,
        expenses,
        targetProfit: targetProfitNum,
        offerAmount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Calculer la rentabilité d'un multi (méthode Napkin)
// @route   POST /api/calculators/multi-napkin
// @access  Private
exports.calculateMultiNapkin = async (req, res, next) => {
  try {
    const { purchasePrice, unitCount, grossRevenue } = req.body;
    
    // Validation des champs requis
    if (!purchasePrice || !unitCount || !grossRevenue) {
      return res.status(400).json({
        success: false,
        message: 'Le prix d\'achat, le nombre d\'unités et les revenus bruts sont requis'
      });
    }
    
    // Conversion en nombres
    const purchasePriceNum = Number(purchasePrice);
    const unitCountNum = Number(unitCount);
    const grossRevenueNum = Number(grossRevenue);
    
    // Calcul du pourcentage de dépenses en fonction du nombre d'unités
    let expensePercentage;
    if (unitCountNum <= 2) {
      expensePercentage = 0.3; // 30%
    } else if (unitCountNum <= 4) {
      expensePercentage = 0.35; // 35%
    } else if (unitCountNum <= 6) {
      expensePercentage = 0.45; // 45%
    } else {
      expensePercentage = 0.5; // 50%
    }
    
    // Calcul des dépenses
    const operatingExpenses = grossRevenueNum * expensePercentage;
    
    // Calcul du Net Operating Income (NOI)
    const noi = grossRevenueNum - operatingExpenses;
    
    // Calcul du financement avec la méthode HIGH-5
    const financing = purchasePriceNum * 0.005 * 12; // 0.5% par mois * 12 mois
    
    // Calcul de la liquidité (cashflow)
    const cashflow = noi - financing;
    
    // Calcul du cashflow par porte par mois
    const cashflowPerDoor = cashflow / unitCountNum / 12;
    
    res.status(200).json({
      success: true,
      data: {
        purchasePrice: purchasePriceNum,
        unitCount: unitCountNum,
        grossRevenue: grossRevenueNum,
        operatingExpenses,
        noi,
        financing,
        cashflow,
        cashflowPerDoor
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Calculer les taxes de mutation
// @route   POST /api/calculators/mutation-tax
// @access  Private
exports.calculateMutationTax = async (req, res, next) => {
  try {
    const { purchasePrice } = req.body;
    
    // Validation des champs requis
    if (!purchasePrice) {
      return res.status(400).json({
        success: false,
        message: 'Le prix d\'achat est requis'
      });
    }
    
    // Conversion en nombre
    const purchasePriceNum = Number(purchasePrice);
    
    // Calcul des taxes de mutation selon les tranches (Québec)
    let taxAmount = 0;
    
    if (purchasePriceNum <= 51700) {
      taxAmount = purchasePriceNum * 0.005;
    } else if (purchasePriceNum <= 258600) {
      taxAmount = 51700 * 0.005 + (purchasePriceNum - 51700) * 0.01;
    } else {
      taxAmount = 51700 * 0.005 + (258600 - 51700) * 0.01 + (purchasePriceNum - 258600) * 0.015;
    }
    
    res.status(200).json({
      success: true,
      data: {
        purchasePrice: purchasePriceNum,
        mutationTax: taxAmount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Calculer l'amortissement hypothécaire
// @route   POST /api/calculators/mortgage
// @access  Private
exports.calculateMortgage = async (req, res, next) => {
  try {
    const { principal, interestRate, amortizationPeriod, paymentFrequency } = req.body;
    
    // Validation des champs requis
    if (!principal || !interestRate || !amortizationPeriod) {
      return res.status(400).json({
        success: false,
        message: 'Le principal, le taux d\'intérêt et la période d\'amortissement sont requis'
      });
    }
    
    // Conversion en nombres
    const principalNum = Number(principal);
    const interestRateNum = Number(interestRate) / 100; // Conversion en pourcentage
    const amortizationPeriodNum = Number(amortizationPeriod);
    const frequency = paymentFrequency || 'monthly';
    
    // Calcul du nombre de paiements et du taux périodique
    let paymentsPerYear, totalPayments, periodicRate;
    
    switch (frequency) {
      case 'weekly':
        paymentsPerYear = 52;
        break;
      case 'biweekly':
        paymentsPerYear = 26;
        break;
      case 'monthly':
      default:
        paymentsPerYear = 12;
        break;
    }
    
    totalPayments = paymentsPerYear * amortizationPeriodNum;
    periodicRate = interestRateNum / paymentsPerYear;
    
    // Calcul du paiement régulier
    const payment = principalNum * (periodicRate * Math.pow(1 + periodicRate, totalPayments)) / (Math.pow(1 + periodicRate, totalPayments) - 1);
    
    // Calcul du total des paiements et des intérêts
    const totalPaymentAmount = payment * totalPayments;
    const totalInterest = totalPaymentAmount - principalNum;
    
    res.status(200).json({
      success: true,
      data: {
        principal: principalNum,
        interestRate: interestRateNum * 100,
        amortizationPeriod: amortizationPeriodNum,
        paymentFrequency: frequency,
        payment,
        totalPayments: totalPayments,
        totalPaymentAmount,
        totalInterest
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Estimer les coûts de rénovation avec la méthode des 500$
// @route   POST /api/calculators/renovation-cost
// @access  Private
exports.calculateRenovationCost = async (req, res, next) => {
  try {
    const { items } = req.body;
    
    // Validation des champs requis
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Une liste d\'éléments à rénover est requise'
      });
    }
    
    // Prix standards de rénovation selon la méthode à 500$
    const standardPrices = {
      kitchen: 10000,          // Cuisine de base
      luxuryKitchen: 25000,    // Cuisine de luxe
      bathroom: 5000,          // Salle de bain standard
      halfBathroom: 3000,      // Salle d'eau
      exteriorDoor: 1500,      // Porte extérieure
      interiorDoor: 500,       // Porte intérieure + garde-robe
      basementWindow: 500,     // Fenêtre sous-sol
      bedroomWindow: 500,      // Fenêtre chambre
      livingroomWindow: 1500,  // Fenêtre salon (grande)
      flooringPerSqFt: 5,      // Planchers ($/pied carré)
      paintPerGallon: 500      // Peinture ($/gallon)
    };
    
    let totalCost = 0;
    const detailedCosts = [];
    
    // Calculer le coût total
    for (const item of items) {
      let itemCost = 0;
      
      switch (item.type) {
        case 'kitchen':
          itemCost = item.luxury ? standardPrices.luxuryKitchen : standardPrices.kitchen;
          break;
        case 'bathroom':
          itemCost = standardPrices.bathroom;
          break;
        case 'halfBathroom':
          itemCost = standardPrices.halfBathroom;
          break;
        case 'exteriorDoor':
          itemCost = standardPrices.exteriorDoor;
          break;
        case 'interiorDoor':
          itemCost = standardPrices.interiorDoor * (item.quantity || 1);
          break;
        case 'window':
          switch (item.subtype) {
            case 'basement':
              itemCost = standardPrices.basementWindow * (item.quantity || 1);
              break;
            case 'bedroom':
              itemCost = standardPrices.bedroomWindow * (item.quantity || 1);
              break;
            case 'livingroom':
              itemCost = standardPrices.livingroomWindow * (item.quantity || 1);
              break;
            default:
              itemCost = standardPrices.bedroomWindow * (item.quantity || 1);
          }
          break;
        case 'flooring':
          // Arrondir à la tranche de 500$ supérieure
          itemCost = Math.ceil((item.squareFeet * standardPrices.flooringPerSqFt) / 500) * 500;
          break;
        case 'paint':
          itemCost = standardPrices.paintPerGallon * (item.gallons || 1);
          break;
        case 'custom':
          // Pour tout autre élément, arrondir à la tranche de 500$ supérieure
          itemCost = Math.ceil((item.cost || 0) / 500) * 500;
          break;
        default:
          // Par défaut, utiliser la méthode à 500$ pour tout élément non spécifié
          itemCost = 500;
      }
      
      detailedCosts.push({
        description: item.description || item.type,
        cost: itemCost
      });
      
      totalCost += itemCost;
    }
    
    // Ajouter une contingence de 10% pour les imprévus
    const contingency = totalCost * 0.1;
    const grandTotal = totalCost + contingency;
    
    res.status(200).json({
      success: true,
      data: {
        detailedCosts,
        subtotal: totalCost,
        contingency,
        total: grandTotal
      }
    });
  } catch (error) {
    next(error);
  }
};