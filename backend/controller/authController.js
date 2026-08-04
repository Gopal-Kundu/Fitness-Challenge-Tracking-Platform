import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../model/User.js';

const generateToken = (id) => {
  const jwtSecret = process.env.JWT_SECRET || 'fitness_jwt_secret_key_12345';
  return jwt.sign({ id }, jwtSecret, { expiresIn: '7d' });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role, age, gender, height, weight, userImage } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'member',
      age: age || null,
      gender: gender || '',
      height: height || null,
      weight: weight || null,
      userImage: userImage || 'https://shorturl.at/FmV3K',
    });

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.userImage || 'https://shorturl.at/FmV3K',
        workoutPlan: user.workoutPlan || '',
        dietPlan: user.dietPlan || '',
        trainerName: 'Coach Marcus',
        completedCalories: user.completedCalories || 0,
        completedWorkoutsCount: user.completedWorkoutsCount || 0,
        completedChallengesCount: user.completedChallengesCount || 0,
        joinedChallenges: user.joinedChallenges || [],
        completedWorkouts: user.completedWorkouts || [],
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter your email and password.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    let trainerName = 'Coach Marcus';
    if (user.trainerId) {
      const tUser = await User.findById(user.trainerId).select('name').catch(() => null);
      if (tUser && tUser.name) trainerName = tUser.name;
    }

    return res.status(200).json({
      success: true,
      token,
      message: 'Logged in successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.userImage || 'https://shorturl.at/FmV3K',
        workoutPlan: user.workoutPlan || '',
        dietPlan: user.dietPlan || '',
        trainerName,
        completedCalories: user.completedCalories || 0,
        completedWorkoutsCount: user.completedWorkoutsCount || 0,
        completedChallengesCount: user.completedChallengesCount || 0,
        joinedChallenges: user.joinedChallenges || [],
        completedWorkouts: user.completedWorkouts || [],
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};

export const logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  return res.status(200).json({ success: true, message: 'Logged out successfully!' });
};

export const getMe = async (req, res) => {
  let trainerName = req.user.trainerName || '';
  if (!trainerName && req.user.trainerId) {
    const tUser = await User.findById(req.user.trainerId).select('name').catch(() => null);
    if (tUser && tUser.name) trainerName = tUser.name;
  }
  if (!trainerName) trainerName = 'Coach Marcus';

  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      image: req.user.userImage || 'https://shorturl.at/FmV3K',
      trainerId: req.user.trainerId || null,
      trainerName,
      workoutPlan: req.user.workoutPlan || '',
      dietPlan: req.user.dietPlan || '',
      weight: req.user.weight || null,
      height: req.user.height || null,
      completedCalories: req.user.completedCalories || 0,
      completedWorkoutsCount: req.user.completedWorkoutsCount || 0,
      completedChallengesCount: req.user.completedChallengesCount || 0,
      recentWorkout: req.user.recentWorkout || null,
      joinedChallenges: req.user.joinedChallenges || [],
      completedWorkouts: req.user.completedWorkouts || [],
    },
  });
};
