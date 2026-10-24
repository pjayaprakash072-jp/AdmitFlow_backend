# AdmitFlow — MERN University Admission Manager

A runnable starter application built with React + Vite, Tailwind CSS v4, Node.js, Express, MongoDB/Mongoose, JWT authentication, and Cloudinary document storage.

## Requirements
- Node.js 20.19+ (or a compatible current LTS)
- MongoDB local instance or MongoDB Atlas
- Cloudinary account (for real document uploads; optional until you upload a file)

## Setup

### 1) Backend
```bash
cd backend
cp .env.example .env
```
Edit `.env` and set `MONGODB_URI`, `JWT_SECRET`, and Cloudinary credentials. Then:
```bash
npm install
npm run dev
```
API defaults to `http://localhost:5000`.

### 2) Frontend (new terminal)
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Open the URL printed by Vite (usually `http://localhost:5173`).

## Demo mode
You can explore the comparison, cost calculator, deadlines, and dashboard without logging in. Register a student account to save applications and use document uploads. Parent access is controlled by the backend role and the student’s parent-sharing setting. Sample university data is clearly labelled as demo data and should not be treated as verified admissions information.

## Cloudinary
Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in `backend/.env`. Uploaded files are stored in Cloudinary, not on the application server. Do not commit `.env` files.

## Features
- Persistent navbar on public and authenticated screens; login/register links when signed out.
- Light/dark theme toggle, saved in browser local storage.
- University comparison and explainable weighted ranking.
- Tuition + living + other fees − scholarship calculator with budget fit indicator.
- Application status and deadline tracker.
- Cloudinary document upload with file-type and target-university validation.
- Parent dashboard that only exposes permitted financial/application summaries.
- JWT auth, protected API routes, MongoDB models, and notification records.

## Notes
This is a hackathon starter, not a production security audit. Before production, add email verification, password reset, rate limiting, virus scanning, stricter document access policies, and audit logging. Configure Cloudinary access policies appropriately. Demo universities and figures are fictional sample data.
