# TacCards Vault

CardLadder italiano — portfolio tracker per carte sportive collezionabili.

## Stack

- **Mobile:** Expo (React Native) + TypeScript
- **Backend:** Node.js + Fastify + TypeScript
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Prezzi:** Card Hedge API + eBay Browse API
- **Scanner:** CardSight AI

## Setup iniziale

### 1. Prerequisiti

```bash
node >= 18
npm >= 9
```

### 2. Clona e installa

```bash
git clone [repo]
cd taccards-vault
npm install
```

### 3. Backend

```bash
cd apps/backend
cp .env.example .env
# Compila le variabili in .env

npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

### 4. Mobile

```bash
cd apps/mobile
cp .env.example .env
# Compila le variabili in .env

npm install
npx expo start
```

## Struttura monorepo

```
taccards-vault/
├── apps/
│   ├── backend/
│   │   ├── prisma/schema.prisma   ← Domain model completo
│   │   └── src/
│   │       ├── index.ts           ← Entry point Fastify
│   │       ├── lib/               ← Prisma client, utilities
│   │       ├── middleware/        ← Auth JWT + Supabase
│   │       ├── routes/            ← API endpoints
│   │       └── services/          ← CardHedge, CardSight, eBay
│   └── mobile/
│       └── src/
│           ├── app/               ← Expo Router (screens)
│           ├── components/        ← UI components riusabili
│           ├── stores/            ← Zustand state management
│           └── lib/               ← Supabase client, API axios
└── README.md
```

## API Endpoints

| Metodo | Path | Descrizione |
|--------|------|-------------|
| GET | /api/v1/cards/search | Cerca carte nel catalogo |
| GET | /api/v1/cards/:id | Dettaglio carta |
| GET | /api/v1/cards/:id/price-chart | Grafico prezzi |
| GET | /api/v1/collection | Collezione utente + ROI |
| POST | /api/v1/collection | Aggiungi carta |
| DELETE | /api/v1/collection/:id | Rimuovi carta |
| GET | /api/v1/collection/portfolio-history | Storico valore portfolio |
| POST | /api/v1/scan | Scansiona carta da immagine |
| POST | /api/v1/scan/confirm | Conferma match scansione |
| GET | /api/v1/sealed | Prodotti sigillati + ROI |
| POST | /api/v1/sealed | Aggiungi sealed product |
| GET | /api/v1/watchlist | Watchlist prezzi |
| POST | /api/v1/watchlist | Aggiungi a watchlist |
| GET | /health | Health check |

## Prossimi passi

- [ ] Collection screen completa
- [ ] Market screen (ricerca prezzi)
- [ ] Seed database script (catalogo carte EU)
- [ ] Price sync job schedulato
- [ ] Push notifications watchlist
- [ ] RevenueCat subscription
