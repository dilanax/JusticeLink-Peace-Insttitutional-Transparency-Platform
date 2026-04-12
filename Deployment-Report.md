# Deployment Report

## Project
JusticeLink Platform

## Backend Deployment
- Platform: Render
- Service Type: Node.js Express REST API
- Root Directory: `Backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Live URL: https://janaya360-web-development-project.onrender.com

### Backend Evidence Location
- docs/deployment/backend-render-overview.png
- docs/deployment/backend-live-url-response.png

## Frontend Deployment
- Platform: Vercel
- Service Type: React (Vite)
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Live URL: https://janaya360-web-development-project.vercel.app/

### Frontend Evidence Location
- docs/deployment/frontend-vercel-overview.png
- docs/deployment/frontend-live-url-view.png

## Environment Variables (No Secrets Exposed)

### Backend (`Backend/.env`)
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `FRONTEND_URL`
- `NEWS_API_KEY`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `EMAIL_USER`
- `EMAIL_PASS`

### Frontend (`frontend/.env`)
- `VITE_API_URL`

## Evidence Checklist
- [x] Screenshot: Render deployment success page
- [ ] Screenshot: Backend live URL response in browser/Postman
- [x] Screenshot: Vercel deployment success page
- [ ] Screenshot: Frontend live URL in browser

Store screenshots under docs/deployment/.
