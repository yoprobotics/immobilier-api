# Immobilier API

API de calculs pour l'investissement immobilier, permettant d'évaluer la rentabilité des projets FLIP et MULTI ainsi que d'autres aspects financiers liés à l'immobilier.

## Fonctionnalités

L'API offre plusieurs calculateurs spécialisés pour l'investissement immobilier :

- Calculateur Napkin FLIP : évaluation rapide de la rentabilité d'un projet de flip immobilier
- Calculateur d'offre FLIP : détermination du montant à offrir pour atteindre un profit cible
- Calculateur Napkin MULTI : évaluation rapide de la rentabilité d'un immeuble à revenus
- Calculateur de taxes de mutation : calcul des taxes de bienvenue au Québec
- Calculateur d'hypothèque : calcul des paiements et des intérêts
- Calculateur de coûts de rénovation : estimation des coûts de rénovation selon la méthode des 500$

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/yoprobotics/immobilier-api.git

# Accéder au répertoire
cd immobilier-api

# Installer les dépendances
npm install

# Démarrer le serveur en mode développement
npm run dev
```

## Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```
NODE_ENV=development
PORT=5000
```

## Utilisation des endpoints

### Calculateur Napkin FLIP

**POST** `/api/calculators/flip-napkin`

Permet d'évaluer rapidement la rentabilité d'un projet de flip immobilier.

Exemple de requête :
```json
{
  "finalPrice": 425000,
  "initialPrice": 359000,
  "renovationCost": 10000
}
```

Réponse :
```json
{
  "success": true,
  "data": {
    "finalPrice": 425000,
    "initialPrice": 359000,
    "renovationCost": 10000,
    "expenses": 42500,
    "profit": 13500
  }
}
```

### Calculateur d'offre FLIP

**POST** `/api/calculators/flip-offer`

Calcule le montant à offrir pour atteindre un profit cible dans un projet de flip.

Exemple de requête :
```json
{
  "finalPrice": 425000,
  "renovationCost": 10000,
  "targetProfit": 25000
}
```

Réponse :
```json
{
  "success": true,
  "data": {
    "finalPrice": 425000,
    "renovationCost": 10000,
    "expenses": 42500,
    "targetProfit": 25000,
    "offerAmount": 347500
  }
}
```

### Calculateur Napkin MULTI

**POST** `/api/calculators/multi-napkin`

Permet d'évaluer rapidement la rentabilité d'un immeuble à revenus.

Exemple de requête :
```json
{
  "purchasePrice": 500000,
  "unitCount": 6,
  "grossRevenue": 46800
}
```

Réponse :
```json
{
  "success": true,
  "data": {
    "purchasePrice": 500000,
    "unitCount": 6,
    "grossRevenue": 46800,
    "operatingExpenses": 21060,
    "noi": 25740,
    "financing": 30000,
    "cashflow": -4260,
    "cashflowPerDoor": -59.17
  }
}
```

### Calculateur de taxes de mutation

**POST** `/api/calculators/mutation-tax`

Calcule les taxes de bienvenue (taxes de mutation) au Québec.

Exemple de requête :
```json
{
  "purchasePrice": 350000
}
```

Réponse :
```json
{
  "success": true,
  "data": {
    "purchasePrice": 350000,
    "mutationTax": 3665
  }
}
```

### Calculateur d'hypothèque

**POST** `/api/calculators/mortgage`

Calcule les paiements et les intérêts d'un prêt hypothécaire.

Exemple de requête :
```json
{
  "principal": 300000,
  "interestRate": 4.5,
  "amortizationPeriod": 25,
  "paymentFrequency": "monthly"
}
```

Réponse :
```json
{
  "success": true,
  "data": {
    "principal": 300000,
    "interestRate": 4.5,
    "amortizationPeriod": 25,
    "paymentFrequency": "monthly",
    "payment": 1667.38,
    "totalPayments": 300,
    "totalPaymentAmount": 500214,
    "totalInterest": 200214
  }
}
```

### Calculateur de coûts de rénovation

**POST** `/api/calculators/renovation-cost`

Estime les coûts de rénovation selon la méthode des 500$.

Exemple de requête :
```json
{
  "items": [
    {
      "type": "kitchen",
      "description": "Cuisine complète",
      "luxury": false
    },
    {
      "type": "bathroom",
      "description": "Salle de bain principale"
    },
    {
      "type": "window",
      "subtype": "livingroom",
      "quantity": 2,
      "description": "Fenêtres du salon"
    },
    {
      "type": "flooring",
      "squareFeet": 1200,
      "description": "Planchers en bois franc"
    },
    {
      "type": "paint",
      "gallons": 5,
      "description": "Peinture intérieure"
    }
  ]
}
```

Réponse :
```json
{
  "success": true,
  "data": {
    "detailedCosts": [
      {
        "description": "Cuisine complète",
        "cost": 10000
      },
      {
        "description": "Salle de bain principale",
        "cost": 5000
      },
      {
        "description": "Fenêtres du salon",
        "cost": 3000
      },
      {
        "description": "Planchers en bois franc",
        "cost": 6000
      },
      {
        "description": "Peinture intérieure",
        "cost": 2500
      }
    ],
    "subtotal": 26500,
    "contingency": 2650,
    "total": 29150
  }
}
```

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue pour signaler un bug ou proposer une nouvelle fonctionnalité.

## Licence

MIT