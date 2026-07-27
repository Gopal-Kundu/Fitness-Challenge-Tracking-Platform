# 🏋️‍♂️ Fitness Challenge Tracking Platform

Welcome to the **Fitness Challenge Tracking Platform**! This is a full-stack web application designed to help users join fitness challenges, track their workouts, log progress, and connect with trainers and fitness enthusiasts.

---

## 🚀 Features

- **User Authentication**: Secure sign-up/login with HTTP-only cookie session management.
- **Role-Based Access Control**: Support for `admin`, `member`, and `trainer` roles.
- **Fitness Challenges**: Create, join, and track multi-day fitness challenges.
- **Workouts Management**: Create custom workout routines with video exercise links, calorie metrics, and difficulty levels.
- **Progress & Leaderboard**: Log user points per challenge and display global rankings.
- **Trainer Tools**: Trainer-member assignment and customized workout plan dispatching.
- **Admin Dashboard**: Real-time platform statistics for user counts, active challenges, and total workouts.

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
- **Security**: JWT & HTTP-only Cookies

---

## 📁 Folder Structure

```text
├── backend/
│   ├── controller/      # Route handler controllers (auth, user, workout, challenge, progress, etc.)
│   ├── db/              # Database connection setup (db.js)
│   ├── middleware/      # Authentication & role authorization middleware
│   ├── model/           # Mongoose schemas (User, Challenge, Progress, Workout)
│   ├── router/          # Express route definitions
│   ├── .env             # Environment variables configuration
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

## 📡 REST API Documentation

### 🔑 Auth APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login user & set HTTP cookie |
| `POST` | `/api/auth/logout` | Clear auth cookie |
| `GET` | `/api/auth/me` | Get current authenticated user |

### 👤 User APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/users/profile` | Get user profile details |
| `PUT` | `/api/users/profile` | Update profile information |
| `GET` | `/api/users` | Get all users list (Admin) |
| `PUT` | `/api/users/assign-trainer` | Assign trainer to member (Admin) |

### 🏋️ Workout APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/workouts` | Create workout (Trainer/Admin) |
| `GET` | `/api/workouts` | Get all workouts |
| `GET` | `/api/workouts/:id` | Get single workout details |
| `POST` | `/api/workouts/:id/assign` | Assign workout to user |

### 🎯 Challenge APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/challenges` | Create challenge (Trainer/Admin) |
| `GET` | `/api/challenges` | Get all challenges |
| `GET` | `/api/challenges/:id` | Get challenge details |
| `POST` | `/api/challenges/:id/join` | Join challenge (Member) |
| `PUT` | `/api/challenges/:id` | Update challenge details |
| `DELETE` | `/api/challenges/:id` | Delete challenge |

### 📈 Progress & Leaderboard APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/progress` | Create challenge progress record |
| `PUT` | `/api/progress/:id/points` | Add points to participant |
| `GET` | `/api/progress/:challengeId` | Get progress for a challenge |
| `GET` | `/api/leaderboard` | Get global leaderboard rankings |

### 👨‍🏫 Trainer & Admin APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/trainers/members` | Get trainer's assigned members |
| `POST` | `/api/trainers/workout-plan` | Assign workout plan to member |
| `GET` | `/api/admin/dashboard` | Get platform metrics stats (Admin) |

---

## ⚡ Installation & Getting Started

### 1. Clone & Configure Backend
```bash
cd backend
npm install
```
Set `.env` parameters:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitness-tracker
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=super_secret_jwt_key
```
Run backend server:
```bash
npm run dev
```

### 2. Configure Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🤝 Contributing
Feel free to open issues or pull requests to improve the platform! 💪
