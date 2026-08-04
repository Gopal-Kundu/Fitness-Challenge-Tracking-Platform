import User from '../model/User.js';
import Challenge from '../model/Challenge.js';
import Workout from '../model/Workout.js';
import bcrypt from 'bcryptjs';

export const getAdminDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalMembers = await User.countDocuments({ role: 'member' });
    const totalTrainers = await User.countDocuments({ role: 'trainer' });
    const totalChallenges = await Challenge.countDocuments({});
    const totalWorkouts = await Workout.countDocuments({});
    const pendingApprovals = await User.countDocuments({ status: 'pending' });

    return res.status(200).json({
      success: true,
      totalUsers,
      totalMembers,
      totalTrainers,
      totalChallenges,
      totalWorkouts,
      pendingApprovals,
      revenue: 14850,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};

export const addUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, role, membership } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || 'password123', salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'member',
      membership: membership || 'Basic',
      status: 'active',
    });

    return res.status(201).json({
      success: true,
      message: `${(role || 'User').toUpperCase()} added successfully!`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        membership: user.membership,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};

export const updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, status, membership } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (role !== undefined) user.role = role;
    if (status !== undefined) user.status = status;
    if (membership !== undefined) user.membership = membership;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'User updated successfully!',
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};

export const deleteUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'User removed successfully!',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['active', 'blocked', 'pending', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Valid status is required.' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.status = status;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User status updated to ${status}!`,
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};

export const updateUserMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const { membership } = req.body;

    if (!membership || !['Basic', 'Premium', 'Elite'].includes(membership)) {
      return res.status(400).json({ success: false, message: 'Valid membership tier is required.' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.membership = membership;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Membership updated to ${membership}!`,
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};
