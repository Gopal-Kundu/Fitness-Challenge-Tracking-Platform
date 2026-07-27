import User from '../model/User.js';
import Workout from '../model/Workout.js';
import Progress from '../model/Progress.js';

export const getTrainerMembers = async (req, res) => {
  try {
    const trainerId = req.user._id;

    const filter = req.user.role === 'admin' ? { role: 'member' } : { trainerId };
    const members = await User.find(filter);

    const allProgress = await Progress.find({});
    const memberPointsMap = {};

    allProgress.forEach((prog) => {
      prog.participants.forEach((p) => {
        if (p.userId) {
          const uId = p.userId.toString();
          memberPointsMap[uId] = (memberPointsMap[uId] || 0) + (p.points || 0);
        }
      });
    });

    const result = members.map((m) => ({
      id: m._id,
      name: m.name,
      weight: m.weight || 0,
      progress: memberPointsMap[m._id.toString()] || 0,
    }));

    return res.status(200).json(result);
  } catch (error) {
    console.error('Get trainer members error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const createWorkoutPlan = async (req, res) => {
  try {
    const { userId, workoutId } = req.body;

    if (!userId || !workoutId) {
      return res.status(400).json({ success: false, message: 'userId and workoutId are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }

    if (!user.completedWorkouts.includes(workoutId)) {
      user.completedWorkouts.push(workoutId);
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Workout plan assigned',
    });
  } catch (error) {
    console.error('Create workout plan error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
