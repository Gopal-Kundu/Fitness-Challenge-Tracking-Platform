import Workout from '../model/Workout.js';
import User from '../model/User.js';

export const createWorkout = async (req, res) => {
  try {
    const { name, description, image, exercises, totalKcal, duration, intensity } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Workout name is required' });
    }

    const workout = await Workout.create({
      name,
      description: description || '',
      image: image || '',
      exercises: exercises || [],
      totalKcal: totalKcal || 0,
      duration: duration || 0,
      intensity: intensity || 'medium',
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Workout created',
      workoutId: workout._id,
    });
  } catch (error) {
    console.error('Create workout error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getAllWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({});
    const formatted = workouts.map((w) => ({
      id: w._id,
      name: w.name,
      description: w.description,
      image: w.image,
      totalKcal: w.totalKcal,
      duration: w.duration,
      intensity: w.intensity,
    }));
    return res.status(200).json(formatted);
  } catch (error) {
    console.error('Get all workouts error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }

    return res.status(200).json({
      id: workout._id,
      name: workout.name,
      description: workout.description,
      image: workout.image,
      totalKcal: workout.totalKcal,
      duration: workout.duration,
      intensity: workout.intensity,
      exercises: workout.exercises.map((e) => ({
        name: e.name,
        youtubeLink: e.youtubeLink,
        description: e.description,
        time: e.time,
      })),
    });
  } catch (error) {
    console.error('Get single workout error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const assignWorkoutToUser = async (req, res) => {
  try {
    const workoutId = req.params.id;
    const targetUserId = req.body.userId || req.user._id;

    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }

    const user = await User.findById(targetUserId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.completedWorkouts.includes(workoutId)) {
      user.completedWorkouts.push(workoutId);
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Workout assigned',
    });
  } catch (error) {
    console.error('Assign workout error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
