import Progress from '../model/Progress.js';
import User from '../model/User.js';

export const getLeaderboard = async (req, res) => {
  try {
    const allProgress = await Progress.find({}).populate('participants.userId', 'name email userImage role');

    const userPointsMap = {};

    allProgress.forEach((prog) => {
      prog.participants.forEach((p) => {
        if (p.userId) {
          const uId = p.userId._id.toString();
          const name = p.userId.name || 'Anonymous';
          if (!userPointsMap[uId]) {
            userPointsMap[uId] = {
              name,
              points: 0,
            };
          }
          userPointsMap[uId].points += p.points || 0;
        }
      });
    });

    const allUsers = await User.find({}).select('name');
    allUsers.forEach((u) => {
      const uId = u._id.toString();
      if (!userPointsMap[uId]) {
        userPointsMap[uId] = {
          name: u.name,
          points: 0,
        };
      }
    });

    const sortedLeaderboard = Object.values(userPointsMap)
      .sort((a, b) => b.points - a.points)
      .map((entry, index) => ({
        rank: index + 1,
        name: entry.name,
        points: entry.points,
      }));

    return res.status(200).json(sortedLeaderboard);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
