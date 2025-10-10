# PRIV Celebrations - Private Theatre Booking Platform

This repository contains the complete source code for the PRIV Celebrations web application, a full-stack platform for booking and managing private theatre experiences. The application is built with a modern tech stack, featuring a React frontend, a Node.js/Express backend API, and a PostgreSQL database.

## Table of Contents

1.  [**Features**](#features)
    *   [Customer-Facing Website](#customer-facing-website)
    *   [Admin Dashboard](#admin-dashboard)
2.  [**Tech Stack**](#tech-stack)
3.  [**Project Structure**](#project-structure)
4.  [**Setup and Installation**](#setup-and-installation)
    *   [Prerequisites](#prerequisites)
    *   [Step 1: Database Setup](#step-1-database-setup)
    *   [Step 2: Backend Server Setup](#step-2-backend-server-setup)
    *   [Step 3: Frontend Client Setup](#step-3-frontend-client-setup)
5.  [**Running the Application**](#running-the-application)
    *   [Development Mode](#development-mode)
    *   [Production Mode](#production-mode)
6.  [**Admin Credentials**](#admin-credentials)
7.  [**Environment Variables**](#environment-variables)
8.  [**API Endpoints**](#api-endpoints)

## Features

### Customer-Facing Website
-   **Elegant Single-Page Experience:** A smooth, immersive user interface with a dark, luxurious theme.
-   **Dynamic Content:** All content, including theatres, packages, addons, and gallery images, is managed dynamically from the admin dashboard.
-   **Real-Time Availability Checker:** A "Quick View" section on the homepage shows real-time slot availability for each theatre for the current day, using smart business logic.
-   **Multi-Step Booking Form:** A user-friendly, guided form for reserving a theatre, selecting packages, and choosing optional add-ons.
-   **Contact Form:** A "Quick Inquiry" form for customers to send messages.
-   **Custom Animated Cursor:** A stylish, high-performance custom cursor for a unique user experience.
-   **Google Analytics & Ads Integration:** Tracks user behavior and form submission conversions for marketing campaigns.

### Admin Dashboard
-   **Secure Login:** The admin portal is protected by a JWT-based authentication system.
-   **Visual Analytics Dashboard:** Displays key business metrics with interactive charts for booking trends and package popularity.
-   **Booking Management:** View all customer bookings in a detailed table. Admins can update the status of each booking (`Pending`, `Confirmed`, `In Progress`, `Completed`, `Cancelled`) via a simple dropdown.
-   **Phone Booking Creation:** A dedicated form for admins to manually create new bookings for offline customers.
-   **Content Management:** Full CRUD (Create, Read, Update, Delete) functionality for:
    -   **Theatres:** Update names, descriptions, prices, and upload multiple images.
    -   **Packages (Combos):** Add or edit main booking packages.
    -   **Addons:** Manage individual add-on items.
    -   **Gallery:** Upload and delete images for the main website's gallery.
-   **Data Export:** Export all bookings and contact inquiries to a CSV file with one click.

## Tech Stack

-   **Frontend:** React, React Router, Axios, Flatpickr (for date/time selection), Chart.js
-   **Backend:** Node.js, Express.js
-   **Database:** PostgreSQL
-   **Authentication:** JSON Web Tokens (JWT)
-   **File Uploads:** Multer

## Project Structure

The project is a monorepo containing two main sub-projects: `client` and `server`.

```
/priv-celebrations-app/
|
├── /client/              # React Frontend Application
|   ├── /src/
|   |   ├── /assets/        # CSS, Images
|   |   ├── /components/    # Reusable UI Components (main & admin)
|   |   ├── /pages/         # Page-level components
|   |   └── ...
|   ├── .env              # Environment variables for client (API URL)
|   └── package.json
|
└── /server/              # Node.js/Express Backend API
    ├── /db/
    |   └── index.js      # PostgreSQL connection setup
    |   └── db.sql        # The complete database schema
    ├── /middleware/      # Express middleware (auth, file uploads)
    ├── /routes/          # API route definitions
    ├── /controllers/     # Business logic for each route
    ├── /uploads/         # Folder where uploaded images are stored
    ├── .env              # Environment variables for server (DB credentials, JWT Secret)
    └── package.json
```

## Setup and Installation

### Prerequisites
-   **Node.js** (v16 or newer) & **npm**
-   **PostgreSQL** (v12 or newer) installed and running on your machine.

### Step 1: Database Setup
1.  **Create the User and Database:**
    -   Connect to PostgreSQL using `psql` or another SQL client.
    -   Run the following commands, replacing `'your_password'` with a secure password:
        ```sql
        CREATE USER priv_app_user WITH PASSWORD 'your_password';
        CREATE DATABASE priv_db OWNER priv_app_user;
        ```

2.  **Create the Tables:**
    -   Connect to your newly created `priv_db` as the `priv_app_user`.
    -   Copy the entire contents of the `/server/db/db.sql` file.
    -   Paste and run the script in your SQL client. This will create all tables and insert default data.

### Step 2: Backend Server Setup
1.  **Navigate to the `/server` directory:**
    ```bash
    cd server
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create and configure the environment file:**
    -   Copy the example file: `cp .env.example .env` (or create `.env` manually).
    -   Open the `.env` file and fill in your database credentials from Step 1.
        ```
        DB_USER=priv_app_user
        DB_HOST=localhost
        DB_DATABASE=priv_db
        DB_PASSWORD=your_password
        DB_PORT=5432
        JWT_SECRET=a_very_long_and_random_secret_string_for_security
        ```
4.  **Generate a new Admin Password (Optional but Recommended):**
    -   The default password is not secure. To create your own, run:
        ```bash
        node hashPassword.js YourNewSecurePassword
        ```
    -   Copy the generated `INSERT` command and run it in your SQL client to replace the default admin user.

### Step 3: Frontend Client Setup
1.  **Navigate to the `/client` directory:**
    ```bash
    cd client
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create the environment file:**
    -   The `client` directory should have a `.env` file with the following line for local development:
        ```
        REACT_APP_API_URL=http://localhost:5000/api
        ```

## Running the Application

### Development Mode
You need to run both the backend and frontend servers simultaneously in two separate terminals.

-   **Terminal 1 (Backend):**
    ```bash
    cd server
    npm run dev
    ```
    *Server will be running at `http://localhost:5000`.*

-   **Terminal 2 (Frontend):**
    ```bash
    cd client
    npm start
    ```
    *Your browser will automatically open to `http://localhost:3000`.*

### Production Mode
When deploying to a server (like Ubuntu with Nginx):
1.  **Build the React App:**
    ```bash
    cd client
    npm run build
    ```
    This creates a static, optimized version of your site in the `/client/build` folder.
2.  **Run the Node Server:**
    ```bash
    cd server
    npm start
    ```
    The server will run using `node server.js` and is configured to automatically serve the built frontend files. Your reverse proxy (Nginx) should be configured to direct traffic to the Node.js server's port (e.g., 5000).

## Admin Credentials

-   **URL:** `http://localhost:3000/admin`
-   **Default Username:** `admin`
-   **Default Password:** The password you set during the `hashPassword.js` step.

## Environment Variables

-   **`/server/.env`**: Contains database credentials and the JWT secret key.
-   **`/client/.env`**: Contains the URL of the backend API so the frontend knows where to send requests.

## API Endpoints

-   **Public:** `/api/data`, `/api/bookings`, `/api/contacts`, `/api/slots/availability`
-   **Auth:** `/api/auth/login`
-   **Admin (Protected):** All routes under `/api/admin/*` require a valid JWT token.
