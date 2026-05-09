# 🍎 HarvestLink Platform

**HarvestLink** is a full-stack, data-driven marketplace designed to reduce post-harvest food waste. It combines a high-performance **Java Spoilage Engine**, a **Node.js API Gateway**, and **Cross-Platform Mobile/Web Apps** to track, predict, and trade harvests in real-time.

## 🚀 Key Features

- **Digital Twin Tracking**: Log harvests with precise location, storage type, and quantity.
- **Spoilage Intelligence**: Java-powered engine predicts shelf-life using real-time weather data.
- **Urgency Marketplace**: Matching engine prioritizes high-risk harvests to ensure they are sold before they spoil.
- **Live Map View**: Visualize local food security and harvest availability geographically.
- **QR Batch Scanner**: On-site verification for buyers to see live batch intelligence.
- **Social Impact Analytics**: Tracks CO2 offset and food waste prevented.

## 🏗️ Architecture

- **Mobile App**: React Native / Expo (with offline-first support)
- **Web Dashboard**: React / Vite (for admin and high-level analytics)
- **API Gateway**: Node.js / Fastify / PostgreSQL / Redis
- **Spoilage Engine**: Spring Boot (Java 21)
- **Infrastructure**: Docker Compose / Nginx / TimescaleDB

## 🛠️ Getting Started

1. **Infrastructure**: 
   ```bash
   cd infra && docker-compose up -d
   ```
2. **Backend**:
   ```bash
   npm run api
   npm run spoilage
   ```
3. **Frontend**:
   ```bash
   npm run mobile
   npm run dashboard
   ```

---
Built with ❤️ by HarvestLink Team.
