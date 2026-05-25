# ConversionIQ - AI-Powered E-commerce Conversion Intelligence

ConversionIQ is a high-performance, full-stack SaaS platform designed to help e-commerce businesses understand and optimize their visitor-to-customer conversion rates.

## 🚀 Tech Stack
- **Frontend**: Next.js 16 (React 19), TypeScript, Tailwind CSS, Recharts
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Real-time**: Socket.IO
- **AI**: OpenAI API (GPT-4o) for insights & recommendations
- **SDK**: Vanilla TypeScript (Rollup for bundling)

## 📁 Project Structure
```text
conversioniq/
├── backend/          # Express API server
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/    # MongoDB Schemas
│   │   ├── routes/
│   │   └── server.ts
├── frontend/         # Next.js Dashboard
│   └── src/
│       ├── app/       # Dashboard & Analytics pages
│       ├── components/
│       └── services/
└── sdk/              # Client-side tracking script
    └── src/          # Event collection & frustration detection
```

## 🛠 Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
# Create a .env file with:
# MONGO_URI=your_mongodb_uri
# JWT_SECRET=your_secret
# OPENAI_API_KEY=your_key
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# Create a .env.local file with:
# NEXT_PUBLIC_API_URL=http://localhost:5001/api
npm run dev
```

### 3. SDK Build
```bash
cd sdk
npm install
npm run build
# This generates dist/sdk.min.js
```

## 📊 Core Features
- **Intelligent Tracking**: Captured page views, clicks, rage clicks, and session metadata.
- **Analytics Dashboard**: Real-time stats, visitor trends, and conversion funnels.
- **AI Insights**: Natural language analysis of why customers are dropping off.
- **Session Analysis**: High-level session summaries and frustration scoring.
- **Multi-tenancy**: Organization-based data isolation.

## 🛡 Security
- JWT with Refresh Token strategy.
- Organization-level data partitioning.
- CORS protection for SDK endpoints.

---
Built with ❤️ by ConversionIQ Team.
