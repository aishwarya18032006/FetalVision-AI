# FetalVision AI Platform

A production-ready end-to-end AI-powered medical web application built around the FetalCLIP model.

## Features
- Premium Medical SaaS UI with Tailwind CSS
- Real-time AI inference wrapping FetalCLIP
- Doctor Dashboard & Upload Interface
- Class Activation Maps (CAM) Heatmaps
- PDF Report Generation
- Role-based Access Control (Admin/Doctor)

## Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL 15+
- FetalCLIP Pre-trained Weights (`FetalCLIP_weights.pt`) placed in `FetalCLIP-main/`

## Installation

1. **Install Root Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   - Use docker-compose to start a local Postgres database:
     ```bash
     docker-compose up -d
     ```
   - Initialize Prisma (Backend):
     ```bash
     cd backend
     npx prisma generate
     npx prisma db push
     ```

3. **Install Frontend/Backend Dependencies**
   These should already be installed, but if not:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

## Running the Application
To start both the frontend and backend simultaneously:
```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## AI Inference Wrapper
The Python script located in `python_ai/inference.py` acts as a bridge between the Node.js Express server and the PyTorch FetalCLIP model. It accepts an image path via CLI arguments and prints JSON to `stdout`, which is then parsed by Node.js.
