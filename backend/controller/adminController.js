import User from '../model/User.js';
import Challenge from '../model/Challenge.js';
import Workout from '../model/Workout.js';

export const getAdminDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalMembers = await User.countDocuments({ role: 'member' });
    const totalTrainers = await User.countDocuments({ role: 'trainer' });
    const totalChallenges = await Challenge.countDocuments({});
    const totalWorkouts = await Workout.countDocuments({});

    return res.status(200).json({
      totalUsers,
      totalMembers,
      totalTrainers,
      totalChallenges,
      totalWorkouts,
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
