# <div align="center">🏛️ GREECE HIEROGLYPHS</div>

<div align="center">
  <h3>Egyptian & Hellenic Streetwear E-Commerce Platform</h3>
  <p>An elegant, premium full-stack storefront celebrating ancient Egyptian & Greek hieroglyphic culture and modern urban streetwear aesthetics. Built with Dark Pyramid.</p>
</div>

<div align="center">

[![React](https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Expo](https://img.shields.io/badge/Expo-v54.x-black?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey?style=for-the-badge&logo=express)](https://expressjs.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-cyan?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![Stripe](https://img.shields.io/badge/Stripe-v3-purple?style=for-the-badge&logo=stripe)](https://stripe.com)

</div>

---

## 🎨 The Brand Vision

Greece Hieroglyphs blends ancient Egyptian & Greek geometry, iconography, and styling with modern urban streetwear aesthetics. The digital store showcases high-quality drops: heavyweight embroidered hoodies, minimalist cropped tops, custom embossed metal chains, and typography tees in both English and Arabic. Built with Dark Pyramid.

---

## 🏛️ System Architecture

Greece Hieroglyphs is structured around a decoupled multi-workspace topology. Clients talk to the Express API; OpenAPI is documented in-process.

```mermaid
graph TD
    Client[greece/ <br/> React + Vite Client]
    Mobile[greece-mobile/ <br/> Expo Mobile Client]
    API[api-server/ <br/> Express.js + TS Engine]
    Docs[api-server swagger <br/> OpenAPI at /api-docs]
    
    Docs -->|Documents contracts| API
    Client -->|HTTP API Requests| API
    Mobile -->|HTTP API Requests| API
```

---

## 🧭 Developer Guides Portal

Detailed logs, instructions, and schemas are separated into high-fidelity manuals inside the `/docs` directory. Select a target directory below to explore:

<div align="center">

| Destination | Scope | Highlights |
| :--- | :--- | :--- |
| [🛠️ Setup & Run](./docs/SETUP.md) | Local development | Backend, Web, and Expo Mobile setups, CLI scripts, ENV tables, and troubleshooting logs. |
| [📐 System Architecture](./docs/ARCHITECTURE.md) | Design patterns | Repository mappings, mobile/web layout schemas, data flows, security details, and optimization benchmarks. |
| [🔌 API Reference](./docs/API.md) | Endpoint schemas | Input validation rules, sample payloads, curl scripts, and Swagger UI coordinates. |
| [🚀 Operations & Deploy](./docs/DEPLOYMENT.md) | Production infrastructure | Docker configs, PM2 scripts, cloud hosting rules (Vercel), Expo EAS builds, Stripe webhooks, and backup strategies. |

</div>

---

## 📊 Project Status & Roadmap

### Core Foundation (Completed) ✅
- **React Frontend**: Fully responsive, dark mode-supported storefront (`greece`).
- **Express Backend**: Modular TypeScript API controller (`api-server`).
- **Mobile Storefront**: Native iOS/Android storefront app (`greece-mobile`) using Expo Router.
- **Payment Pipeline**: Stripe API integration with mock-session fallback logic (dev only).
- **OpenAPI Schema**: Served as JSON from `api-server` at `/api-docs` (no separate `api-spec/` package).
- **Type-safe API**: Shared Zod schemas and TypeScript types in `api-server` (codegen package optional/future).

---

## 🎨 Visual Identity Tokens

* **Primary Gold Accent**: `#C89D29` (reflecting warm desert horizons & ancient pharaonic gold)
* **Dark Background Canvas**: `#1A1A1A` (representing basalt stoneworks)
* **Light Card Backgrounds**: `#FFFFFF` (representing polished limestone)

---

**Made with ❤️ for Egyptian & Hellenic Culture. Built with Dark Pyramid (darkpyramid-org).**
