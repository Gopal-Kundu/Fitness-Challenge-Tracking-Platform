import User from '../model/User.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      id: user._id,
      name: user.name,
      image: user.userImage || '',
      email: user.email,
      role: user.role,
      trainerId: user.trainerId || null,
      weight: user.weight || null,
      height: user.height || null,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
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
      message: 'Profile updated',
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('name role email userImage age gender height weight trainerId');

    const formattedUsers = users.map((u) => ({
      id: u._id,
      name: u.name,
      role: u.role,
      email: u.email,
      image: u.userImage || '',
      weight: u.weight,
      height: u.height,
      trainerId: u.trainerId,
    }));

    return res.status(200).json(formattedUsers);
  } catch (error) {
    console.error('Get all users error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const assignTrainer = async (req, res) => {
  try {
    const { memberId, trainerId } = req.body;

    if (!memberId || !trainerId) {
      return res.status(400).json({ success: false, message: 'memberId and trainerId are required' });
    }

    const member = await User.findById(memberId);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    const trainer = await User.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    member.trainerId = trainerId;
    await member.save();

    return res.status(200).json({
      success: true,
      message: 'Trainer assigned',
    });
  } catch (error) {
    console.error('Assign trainer error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
