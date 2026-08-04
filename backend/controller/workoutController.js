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
      message: 'Workout created successfully!',
      workoutId: workout._id,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};

export const getAllWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({});
    const formatted = workouts.map((w) => ({
      id: w._id,
      name: w.name,
      title: w.name,
      description: w.description,
      image: w.image,
      totalKcal: w.totalKcal || 680,
      calories: w.totalKcal ? `${w.totalKcal} KCAL` : '680 KCAL',
      duration: typeof w.duration === 'number' ? `${w.duration} MIN` : (w.duration || '45 MIN'),
      intensity: w.intensity || 'ADVANCED',
      level: w.intensity ? w.intensity.toUpperCase() : 'ADVANCED',
    }));
    return res.status(200).json(formatted);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};

export const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found.' });
    }

    return res.status(200).json({
      id: workout._id,
      name: workout.name,
      title: workout.name,
      description: workout.description,
      image: workout.image,
      totalKcal: workout.totalKcal || 680,
      calories: workout.totalKcal ? `${workout.totalKcal} KCAL` : '680 KCAL',
      duration: typeof workout.duration === 'number' ? `${workout.duration} MIN` : (workout.duration || '45 MIN'),
      intensity: workout.intensity || 'ADVANCED',
      level: workout.intensity ? workout.intensity.toUpperCase() : 'ADVANCED',
      exercises: workout.exercises.map((e) => ({
        name: e.name,
        youtubeLink: e.youtubeLink,
        description: e.description,
        time: e.time,
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};

export const assignWorkoutToUser = async (req, res) => {
  try {
    const workoutId = req.params.id;
    const targetUserId = req.body.userId || req.user._id;

    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found.' });
    }

    const user = await User.findById(targetUserId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found.' });
    }

    if (!user.completedWorkouts.includes(workoutId)) {
      user.completedWorkouts.push(workoutId);
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Workout assigned successfully!',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};

export const completeWorkout = async (req, res) => {
  try {
    const workoutId = req.params.id;
    const workout = await Workout.findById(workoutId).catch(() => null);
    const kcalToAdd = workout && workout.totalKcal ? workout.totalKcal : 680;
    const workoutTitle = workout ? (workout.name || workout.title) : 'Completed Workout';

    let user = req.user ? await User.findById(req.user._id) : await User.findOne({});

    if (user) {
      if (!user.completedWorkouts) user.completedWorkouts = [];
      if (!user.joinedChallenges) user.joinedChallenges = [];

      user.completedWorkouts.push(workoutId);
      if (!user.joinedChallenges.includes(workoutId) && !user.joinedChallenges.includes(workoutTitle)) {
        user.joinedChallenges.push(workoutTitle);
      }

      user.recentWorkout = workout ? {
        id: workout._id,
        title: workout.name,
        description: workout.description,
        image: workout.image,
        duration: typeof workout.duration === 'number' ? `${workout.duration} MIN` : (workout.duration || '45 MIN'),
        calories: workout.totalKcal ? `${workout.totalKcal} KCAL` : '680 KCAL',
      } : {
        id: workoutId,
        title: workoutTitle,
        duration: '45 MIN',
        calories: `${kcalToAdd} KCAL`,
      };

      user.completedCalories = (user.completedCalories || 0) + kcalToAdd;
      user.completedWorkoutsCount = (user.completedWorkoutsCount || 0) + 1;
      user.completedChallengesCount = (user.completedChallengesCount || user.joinedChallenges.length) + 1;
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Workout completed!',
        completedCalories: user.completedCalories,
        completedWorkoutsCount: user.completedWorkoutsCount,
        completedChallengesCount: user.completedChallengesCount,
        recentWorkout: user.recentWorkout,
        joinedChallenges: user.joinedChallenges,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Workout completed!',
      completedCalories: 680,
      completedWorkoutsCount: 1,
      completedChallengesCount: 1,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};
