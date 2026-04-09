# VooGo

Calendário visual de preços de voos com agente IA.

## Stack

- **Backend:** Node.js + Express + Prisma + MySQL
- **Frontend:** React + Vite + Tailwind + PWA
- **IA:** Anthropic Claude (agente Voogo)
- **Voos:** Sky Scrapper / RapidAPI

## Setup

```bash
# Backend
cd backend
cp .env.example .env   # Preencha as variáveis
npm install
npx prisma migrate dev
npm run dev

# Frontend
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Produção

```bash
# Backend
cd backend && npm start  # ou pm2 start ecosystem.config.cjs --env production

# Frontend
cd frontend && npm run build  # Gera dist/ para servir via Nginx
```

## Domínio

- **Produção:** https://voogo.io
- **VPS:** 31.97.167.120 (Hostinger KVM4)
