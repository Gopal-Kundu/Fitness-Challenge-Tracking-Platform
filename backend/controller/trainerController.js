import User from '../model/User.js';
import Workout from '../model/Workout.js';

export const getTrainerMembers = async (req, res) => {
  try {
    const trainerId = req.user._id;

    // Strict filter: ONLY fetch users with role 'member'
    let members = await User.find({ trainerId, role: 'member' }).select('-password');
    if (!members || members.length === 0) {
      members = await User.find({ role: 'member' }).select('-password');
    }

    const result = members.map((m) => ({
      id: m._id,
      name: m.name,
      email: m.email,
      role: m.role,
      age: m.age,
      weight: m.weight || 0,
      height: m.height || 0,
      goal: m.goal,
      workoutPlan: m.workoutPlan,
      dietPlan: m.dietPlan,
      feedback: m.feedback,
      bodyMeasurements: m.bodyMeasurements,
      completedWorkoutsCount: m.completedWorkoutsCount || 0,
      completedCalories: m.completedCalories || 0,
      completedChallengesCount: m.completedChallengesCount || 0,
    }));

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};

export const createWorkoutPlan = async (req, res) => {
  try {
    const { userId, workoutPlan } = req.body;

    if (!userId || !workoutPlan) {
      return res.status(400).json({ success: false, message: 'User ID and workout plan details are required.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    if (user.role !== 'member') {
      return res.status(400).json({ success: false, message: 'Workout plans can only be assigned to members.' });
    }

    user.workoutPlan = workoutPlan;
    if (req.user) {
      user.trainerId = req.user._id;
      user.trainerName = req.user.name || 'Coach Marcus';
    }
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Workout plan assigned successfully!',
      workoutPlan: user.workoutPlan,
      trainerName: user.trainerName,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};

export const createDietPlan = async (req, res) => {
  try {
    const { userId, dietPlan } = req.body;

    if (!userId || !dietPlan) {
      return res.status(400).json({ success: false, message: 'User ID and diet plan details are required.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    if (user.role !== 'member') {
      return res.status(400).json({ success: false, message: 'Diet plans can only be assigned to members.' });
    }

    user.dietPlan = dietPlan;
    if (req.user) {
      user.trainerId = req.user._id;
      user.trainerName = req.user.name || 'Coach Marcus';
    }
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Diet plan assigned successfully!',
      dietPlan: user.dietPlan,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};

export const addTrainerFeedback = async (req, res) => {
  try {
    const { userId, text } = req.body;

    if (!userId || !text) {
      return res.status(400).json({ success: false, message: 'User ID and feedback message are required.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    if (user.role !== 'member') {
      return res.status(400).json({ success: false, message: 'Trainer feedback can only be sent to members.' });
    }

    user.feedback.push({
      trainerName: req.user ? req.user.name : 'Performance Trainer',
      text,
      date: new Date(),
    });
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Trainer feedback sent successfully!',
      feedback: user.feedback,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};

export const markMemberWorkoutComplete = async (req, res) => {
  try {
    const { userId, calories } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    if (user.role !== 'member') {
      return res.status(400).json({ success: false, message: 'Workout completion can only be logged for members.' });
    }

    const addedKcal = Number(calories) || 680;
    user.completedWorkoutsCount = (user.completedWorkoutsCount || 0) + 1;
    user.completedCalories = (user.completedCalories || 0) + addedKcal;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Workout marked as completed for member!',
      completedWorkoutsCount: user.completedWorkoutsCount,
      completedCalories: user.completedCalories,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};
