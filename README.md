# API de Calculateurs Immobiliers

Une API RESTful qui offre divers calculateurs pour l'investissement immobilier, basés sur les concepts de la formation "Les secrets de l'immobilier".

## Fonctionnalités

L'API propose plusieurs calculateurs pour faciliter l'analyse et la prise de décision dans les projets immobiliers :

### Calculateurs principaux

- **Calculateur Napkin FLIP (FIP10)** - Méthode rapide pour évaluer la rentabilité d'un projet FLIP immobilier
- **Calculateur Napkin MULTI (PAR)** - Méthode rapide pour évaluer la liquidité d'un immeuble à revenus
- **Calculateur détaillé FLIP** - Analyse complète de la rentabilité d'un projet FLIP
- **Calculateur détaillé MULTI** - Analyse complète de la rentabilité d'un immeuble à revenus

### Calculateurs complémentaires

- **Calculateur d'hypothèque** - Pour estimer les paiements hypothécaires
- **Calculateur de liquidité** - Pour analyser les flux de trésorerie
- **Calculateur de taxes de mutation** - Pour estimer les "taxes de bienvenue"
- **Calculateur d'estimation des rénovations** - Pour budgétiser les travaux de rénovation

## Installation

### Prérequis

- Node.js 14 ou supérieur
- npm ou yarn

### Étapes d'installation

1. Clonez ce dépôt
   ```
   git clone https://github.com/yoprobotics/immobilier-api.git
   cd immobilier-api
   ```

2. Installez les dépendances
   ```
   npm install
   ```
   ou
   ```
   yarn install
   ```

3. Lancez l'application
   ```
   npm start
   ```
   ou en mode développement
   ```
   npm run dev
   ```

4. Accédez à l'interface utilisateur via votre navigateur à l'adresse :
   ```
   http://localhost:3000
   ```

## Utilisation de l'API

### Point de terminaison : `/api/calculators/napkin-flip`

Calcule le profit estimé d'un projet FLIP selon la méthode FIP10.

**Requête :**
```json
{
  "finalPrice": 425000,
  "initialPrice": 359000,
  "renovationPrice": 10000
}
```

**Réponse :**
```json
{
  "status": "success",
  "data": {
    "finalPrice": 425000,
    "initialPrice": 359000,
    "renovationPrice": 10000,
    "tenPercentFees": 42500,
    "profit": 13500,
    "roi": 18.75,
    "isViable": false,
    "message": "Ce projet ne semble pas viable (profit < 25 000$)"
  }
}
```

### Point de terminaison : `/api/calculators/napkin-multi`

Calcule la liquidité (cashflow) estimée d'un immeuble à revenus selon la méthode PAR.

**Requête :**
```json
{
  "purchasePrice": 600000,
  "apartmentCount": 6,
  "grossRevenue": 80000
}
```

**Réponse :**
```json
{
  "status": "success",
  "data": {
    "purchasePrice": 600000,
    "apartmentCount": 6,
    "grossRevenue": 80000,
    "expenseRatio": 45,
    "operatingExpenses": 36000,
    "netOperatingIncome": 44000,
    "mortgagePayment": 36000,
    "cashflow": 8000,
    "cashflowPerUnitPerMonth": 111.11,
    "roi": 6.67,
    "targetCashflowPerMonth": 450,
    "targetCashflowPerYear": 5400,
    "isViable": true,
    "message": "Ce projet semble viable avec 111.11$ de cashflow par porte par mois"
  }
}
```

## Structure du projet

```
immobilier-api/
├── app.js                       # Point d'entrée de l'application
├── controllers/                 # Contrôleurs pour les routes API
│   └── calculatorController.js  # Logique des calculateurs
├── public/                      # Fichiers statiques
│   └── index.html               # Interface utilisateur
├── routes/                      # Configuration des routes
│   └── calculatorRoutes.js      # Routes pour les calculateurs
├── utils/                       # Utilitaires
│   └── calculators/             # Classes de calcul
│       ├── NapkinFlipCalculator.js
│       ├── NapkinMultiCalculator.js
│       └── ...
└── package.json                 # Dépendances et scripts
```

## Formules utilisées

### Calculateur Napkin FLIP (FIP10)

```
Prix Final - Prix Initial - Prix des Rénovations - 10% de la valeur de revente = Profit
```

### Calculateur Napkin MULTI (PAR)

```
Revenus bruts - Dépenses d'opération = Revenus nets d'opération (RNO)
RNO - Financement = Liquidité (cashflow)
```

Où :
- Dépenses d'opération = Revenus bruts * Ratio (30% pour 1-2 logements, 35% pour 3-4, 45% pour 5-6, 50% pour 7+)
- Financement = Prix d'achat * 0.005 * 12 (méthode HIGH-5)

## Licence

MIT