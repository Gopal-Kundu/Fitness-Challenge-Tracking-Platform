# 🏋️‍♂️ Fitness Challenge Tracking Platform

Welcome to the **Fitness Challenge Tracking Platform**! This is a full-stack web application designed to help users join fitness challenges, track their workouts, log progress, and connect with other fitness enthusiasts.

---

## 🚀 Features
- **User Authentication**: Secure sign-up/login with cookie-based session management.
- **Fitness Challenges**: Join existing challenges or create your own daily/weekly workout challenges.
- **Progress Tracking**: Log your daily workouts, steps, active calories, and weight over time.
- **Dynamic Frontend**: Modern UI styled using **Tailwind CSS v4** with fast builds powered by **Vite** and **React**.
- **Robust Backend**: Node.js & Express REST API with MongoDB integration using Mongoose.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB (via Mongoose)

---

## 📁 Folder Structure

```text
├── backend/
│   ├── controller/      # API Route controller logic
│   ├── db/              # Database connection setup (db.js)
│   ├── model/           # Mongoose schemas & database models
│   ├── router/          # Express route definitions
│   ├── .env             # Environment variables configurations
│   ├── index.js         # Main server initialization file
│   └── package.json     # Backend package manifest
│
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── assets/      # Logo and images
│   │   ├── App.css      # Component/global CSS imports
│   │   ├── App.tsx      # Main application component
│   │   ├── index.css    # Tailwind directives
│   │   └── main.tsx     # React DOM entry point
│   ├── index.html       # Single Page Application template
│   ├── vite.config.ts   # Vite configuration with Tailwind CSS plugin
│   └── package.json     # Frontend package manifest
```

---

## ⚡ Installation & Getting Started

Make sure you have Node.js and `pnpm` installed on your machine.

### 1. Clone the repository and open the workspace
```bash
cd "Fitness Challenge Tracking Platform"
```

### 2. Configure Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/fitness-tracker
   CORS_ORIGIN=http://localhost:5173
   ```
4. Start the backend development server:
   ```bash
   pnpm run dev
   ```

### 3. Configure Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the frontend Vite development server:
   ```bash
   pnpm run dev
   ```

---

## 📡 API Endpoints (Quick Reference)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API status check |

---

## 🤝 Contributing
Feel free to open issues or pull requests to improve the application! Enjoy your fitness journey! 💪
