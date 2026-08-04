import User from '../model/User.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found.' });
    }

    return res.status(200).json({
      id: user._id,
      name: user.name,
      image: user.userImage || 'https://shorturl.at/FmV3K',
      email: user.email,
      role: user.role,
      trainerId: user.trainerId || null,
      weight: user.weight || null,
      height: user.height || null,
      completedCalories: user.completedCalories || 0,
      completedWorkoutsCount: user.completedWorkoutsCount || 0,
      completedChallengesCount: user.completedChallengesCount || 0,
      joinedChallenges: user.joinedChallenges || [],
      completedWorkouts: user.completedWorkouts || [],
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found.' });
    }

    const { weight, height, userImage, name, age, gender } = req.body;

    if (weight !== undefined) user.weight = weight;
    if (height !== undefined) user.height = height;
    if (userImage !== undefined) user.userImage = userImage;
    if (name !== undefined) user.name = name;
    if (age !== undefined) user.age = age;
    if (gender !== undefined) user.gender = gender;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('name role email userImage age gender height weight trainerId completedCalories completedWorkoutsCount completedChallengesCount joinedChallenges completedWorkouts');

    const formattedUsers = users.map((u) => ({
      id: u._id,
      name: u.name,
      role: u.role,
      email: u.email,
      image: u.userImage || 'https://shorturl.at/FmV3K',
      weight: u.weight,
      height: u.height,
      trainerId: u.trainerId,
      completedCalories: u.completedCalories || 0,
      completedWorkoutsCount: u.completedWorkoutsCount || 0,
      completedChallengesCount: u.completedChallengesCount || 0,
      joinedChallenges: u.joinedChallenges || [],
      completedWorkouts: u.completedWorkouts || [],
    }));

    return res.status(200).json(formattedUsers);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};

export const assignTrainer = async (req, res) => {
  try {
    const { memberId, trainerId } = req.body;

    if (!memberId || !trainerId) {
      return res.status(400).json({ success: false, message: 'Member ID and Trainer ID are required.' });
    }

    const member = await User.findById(memberId);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    if (member.role !== 'member') {
      return res.status(400).json({ success: false, message: 'Trainers can only be assigned to members.' });
    }

    const trainer = await User.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found.' });
    }

    if (trainer.role !== 'trainer') {
      return res.status(400).json({ success: false, message: 'Assigned user must be a trainer.' });
    }

    member.trainerId = trainerId;
    await member.save();

    return res.status(200).json({
      success: true,
      message: 'Trainer assigned successfully!',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};
