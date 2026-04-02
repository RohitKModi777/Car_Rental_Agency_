# Car Rental Agency - Deployment Guide

This document outlines the best practices for deploying the Car Rental Agency project, which consists of a React/Vite Frontend, a Node.js/Express Backend, and a MySQL Database.

## 1. Database Deployment (MySQL)

Since your backend connects to a MySQL database, you need to host the database on the cloud before deploying the backend.

**Recommended Free/Affordable Providers:**
*   **Aiven:** Offers a free tier for MySQL which is excellent for hobby projects.
*   **Railway:** Provides easy MySQL database provisioning (usage-based, but generous starting tier).
*   **Clever Cloud:** Offers a free small MySQL tier.

**Steps:**
1. Create an account on your chosen provider and start a new MySQL service.
2. Obtain the database connection credentials: `Host`, `Port`, `User`, `Password`, and `Database Name`.
3. Connect to this remote database using a tool like DBeaver or MySQL Workbench locally.
4. Run your `Backend/schema.sql` script into the remote database to create the necessary tables.

## 2. Backend Deployment (Node.js/Express)

Your backend needs a cloud provider that can run Node.js applications continuously.

**Recommended Provider: Render (Free tier available)**

**Steps:**
1. Go to [Render](https://render.com/) and connect your GitHub account.
2. Click **New +** > **Web Service**.
3. Select your `Car_Rental_Agency_` repository.
4. **Configuration:**
    *   **Name:** `car-rental-backend`
    *   **Root Directory:** `Backend` (❗️ This is critical since your backend is in a subfolder).
    *   **Environment:** `Node`
    *   **Build Command:** `npm install`
    *   **Start Command:** `npm start`
5. **Environment Variables:** In the Render settings, add the variables exactly as they were in your `.env` file, but use the remote database credentials:
    *   `DB_HOST` = (Your remote DB host)
    *   `DB_USER` = (Your remote DB user)
    *   `DB_PASSWORD` = (Your remote DB password)
    *   `DB_NAME` = (Your remote DB name)
    *   `PORT` = `3000` (Render will automatically assign a port, but you can define it here)
    *   *Add any other secrets like JWT keys here.*
6. Click **Create Web Service**. Render will build and deploy the backend. Copy the generated URL (e.g., `https://car-rental-backend.onrender.com`).

## 3. Frontend Deployment (React/Vite)

You already have a `vercel.json` file in your `Frontend` folder, which means the project is perfectly prepared for Vercel deployment!

**Recommended Provider: Vercel (Free tier & excellent for React)**

**Steps:**
1. **Update API URLs:** Before deploying, make sure your React frontend is pointing to your *new backend URL* from Render instead of `http://localhost:3000`. It's best to configure this dynamically using environment variables (`import.meta.env.VITE_API_URL`) or update the base URLs in your frontend code (like `carService.js`). Push this change to GitHub!
2. Go to [Vercel](https://vercel.com/) and log in with GitHub.
3. Click **Add New** > **Project** and import your `Car_Rental_Agency_` repository.
4. **Configuration:**
    *   **Framework Preset:** `Vite` (Vercel usually auto-detects this).
    *   **Root Directory:** `Frontend` (❗️ Critical).
    *   **Build Command:** `npm run build`
    *   **Output Directory:** `dist`
5. Click **Deploy**. Vercel will build your app and give you a live URL.

---
### Checklist
- [ ] Database hosted remotely and `schema.sql` applied.
- [ ] Backend deployed on Render (with correctly configured remote DB Environment Variables).
- [ ] Frontend API calls updated to point to the new Render URL.
- [ ] Frontend deployed on Vercel.
