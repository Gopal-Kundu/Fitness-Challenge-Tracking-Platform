import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './db/db.js';

import authRouter from './router/authRouter.js';
import userRouter from './router/userRouter.js';
import workoutRouter from './router/workoutRouter.js';
import challengeRouter from './router/challengeRouter.js';
import progressRouter from './router/progressRouter.js';
import leaderboardRouter from './router/leaderboardRouter.js';
import trainerRouter from './router/trainerRouter.js';
import adminRouter from './router/adminRouter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/workouts', workoutRouter);
app.use('/api/challenges', challengeRouter);
app.use('/api/progress', progressRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/trainers', trainerRouter);
app.use('/api/admin', adminRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Fitness Challenge Tracking Platform API is running' });
});


const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
