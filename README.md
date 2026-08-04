# 🏋️‍♂️ APEX Performance — Fitness Challenge & Tracking Platform

Welcome to **APEX Performance**, a modern full-stack Web Application designed to manage athletic performance, multi-day fitness challenges, workout routines, trainer-member assignments, and live athlete leaderboards.

---

## 🌟 Key Highlights & Features

### 👑 System Administration (`/admin`)
- **Add & Assign Trainer / Member**: Unified side-by-side management cards for adding new accounts and assigning performance trainers to athletes.
- **Role Filtering**: User management tables filter out administrative accounts (`role !== 'admin'`) for clean user auditing.
- **Safety First**: Deleting user accounts requires explicit confirmation via a custom glassmorphic warning modal.
- **Create Fitness Challenge**: Multi-field modal enabling administrators to set challenge title, description, cover image URL, category (`ENDURANCE`, `HYPERTROPHY`, `HIIT`, `FLEXIBILITY`), rewards (APEX Pts), and duration dates.
- **Add Workout Routine**: Quick creation of workout templates complete with name, estimated calories (Kcal), duration (minutes), intensity level (`low`, `medium`, `high`), and cover image URL.

### 🏋️‍♂️ Performance Trainer Hub (`/trainer`)
- **Athlete Roster**: Track assigned member athletes, view total logged workouts, and monitor completed calories.
- **Custom Plan Dispatching**: Write and update personalized workout routines, custom diet plans, and direct guidance notes for each athlete.
- **Challenge & Workout Authoring**: Create fitness challenges and workout templates directly from the trainer dashboard.

### 🏃 Member Athlete Dashboard (`/dashboard` & `/workouts`)
- **Recent Workout Tracking**: Displays high-impact workout cards with 90% full-grid image previews and exercise counts.
- **Interactive Workouts Grid**: Filter workout routines by intensity and calorie metrics.
- **Challenge Participation**: Join active fitness challenges, track progress, and log completed sessions.

### 🏆 Global Athlete Leaderboard (`/leaderboard`)
- **Fair Competition**: Leaderboard automatically filters out `admin` accounts at both API and frontend levels to present true rankings among members and performance trainers.
- **Dynamic Metrics**: Top 3 podded showcase with real-time rank badges, APEX points, and completed workout tallies.

### 🎨 Global UI / UX Modernization
- **Smooth Sidebar Drawer**: Mobile drawer menu equipped with smooth CSS transitions (`transform 0.3s ease-in-out`).
- **Global API Loading Bar**: Top indeterminate progress bar triggered automatically on every backend request (`subscribeAPILoading`).
- **Dark Mode Glassmorphic Theme**: Dark mode design system built with custom Material 3 HSL color tokens.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript |
| **Build Tool & Bundler** | Vite 6 |
| **State Management** | Redux Toolkit (`userSlice`, `workoutSlice`, `challengeSlice`) |
| **Styling & Icons** | Tailwind CSS v4 + Google Material Symbols Outlined |
| **Backend Runtime** | Node.js |
| **Server Framework** | Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT) stored in HTTP-Only Cookies |

---

## 📁 Repository Architecture

```text
Fitness Challenge Tracking Platform/
├── backend/
│   ├── controller/         # Express Controllers (auth, admin, user, workout, challenge, progress, trainer, leaderboard)
│   ├── db/                 # MongoDB database connection setup (db.js)
│   ├── middleware/         # Auth verification & role authorization (authMiddleware.js)
│   ├── model/              # Mongoose Data Models (User, Challenge, Progress, Workout, Activity)
│   ├── router/             # Express Router Modules
│   ├── index.js            # Server entry point & CORS configuration
│   └── package.json        # Backend dependencies & scripts
│
├── frontend/
│   ├── public/             # Static favicon & icons
│   ├── src/
│   │   ├── components/     # Reusable UI (Header, Sidebar, WorkoutModal, SessionModal, etc.)
│   │   ├── pages/          # Application views (Dashboard, AdminPage, TrainerPage, WorkoutsPage, ChallengesPage, LeaderboardPage, Login, Register)
│   │   ├── services/       # Centralized API service methods (`api.ts` with global loading listener)
│   │   ├── store/          # Redux Toolkit slices
│   │   ├── App.css         # Animations & custom global utilities
│   │   ├── index.css       # Tailwind v4 import & color token definitions
│   │   └── main.tsx        # React entry point
│   ├── vite.config.ts      # Vite configuration & build settings
│   └── package.json        # Frontend dependencies & build scripts
│
└── README.md               # Project documentation
```

---

## 📡 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user (`member`, `trainer`, `admin`) |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive HTTP-Only cookie |
| `POST` | `/api/auth/logout` | Public | Clear authentication cookie |
| `GET` | `/api/auth/me` | Authenticated | Fetch current logged-in user profile |

### 👤 User Management (`/api/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/profile` | Authenticated | Get current user profile details |
| `PUT` | `/api/users/profile` | Authenticated | Update user profile details |
| `GET` | `/api/users` | Admin | Get list of all users |
| `PUT` | `/api/users/assign-trainer` | Admin | Assign performance trainer to member athlete |

### 🏋️ Workouts (`/api/workouts`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/workouts` | Authenticated | Fetch all workout routines |
| `GET` | `/api/workouts/:id` | Authenticated | Fetch single workout details |
| `POST` | `/api/workouts` | Trainer / Admin | Create a new workout routine |
| `POST` | `/api/workouts/:id/assign` | Trainer / Admin | Assign workout routine to user |
| `POST` | `/api/workouts/:id/complete` | Member | Log workout completion & add points |

### 🎯 Fitness Challenges (`/api/challenges`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/challenges` | Authenticated | List all active challenges |
| `GET` | `/api/challenges/:id` | Authenticated | Get detailed challenge metadata |
| `POST` | `/api/challenges` | Trainer / Admin | Create a multi-day fitness challenge |
| `POST` | `/api/challenges/:id/join` | Member | Enroll in a fitness challenge |
| `PUT` | `/api/challenges/:id` | Admin | Update challenge details |
| `DELETE` | `/api/challenges/:id` | Admin | Delete a challenge |

### 🏆 Leaderboard (`/api/leaderboard`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/leaderboard` | Authenticated | Fetch athlete rankings (excludes `admin` role) |

### 👨‍🏫 Trainer (`/api/trainers`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/trainers/members` | Trainer | Fetch list of assigned member athletes |
| `POST` | `/api/trainers/workout-plan` | Trainer | Update member's workout plan |
| `POST` | `/api/trainers/diet-plan` | Trainer | Update member's diet plan |
| `POST` | `/api/trainers/feedback` | Trainer | Send trainer guidance note |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **Package Manager**: `pnpm` or `npm`
- **Database**: Local or Cloud MongoDB Instance

### 1. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitness-tracker
JWT_SECRET=apex_performance_jwt_secret_key_2026
CORS_ORIGIN=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
```

### 2. Frontend Setup
Open a new terminal window:
```bash
cd frontend
pnpm install
pnpm run dev
```

The application will be running at **`http://localhost:5173`**.

---

## 📦 Production Build

To test or verify production compilation:
```bash
cd frontend
pnpm run build
```

This compiles TypeScript using `tsc -b` and bundles assets with Vite into `frontend/dist`.

---
