import User from '../model/User.js';
import Progress from '../model/Progress.js';

export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).lean();
    const allProgress = await Progress.find({}).lean();

    // Map additional points from Progress records if any
    const extraPointsMap = {};
    allProgress.forEach((prog) => {
      if (Array.isArray(prog.participants)) {
        prog.participants.forEach((p) => {
          if (p.userId) {
            const uId = String(p.userId._id || p.userId);
            extraPointsMap[uId] = (extraPointsMap[uId] || 0) + (p.points || 0);
          }
        });
      }
    });

    const leaderboard = users.map((user) => {
      const uId = String(user._id);
      const calories = Number(user.completedCalories) || 0;
      const workouts = Number(user.completedWorkoutsCount) || 0;
      const challenges = Array.isArray(user.joinedChallenges)
        ? user.joinedChallenges.length
        : Number(user.completedChallengesCount) || 0;
      const extraPts = extraPointsMap[uId] || 0;

      // Point calculation formula: Calories + (Workouts * 100) + (Challenges * 500) + Extra progress points
      const totalPoints = calories + (workouts * 100) + (challenges * 500) + extraPts;

      return {
        id: user._id,
        name: user.name || 'Athlete',
        email: user.email || '',
        role: user.role || 'member',
        avatar: user.userImage || 'https://shorturl.at/FmV3K',
        points: totalPoints,
        completedCalories: calories,
        completedWorkoutsCount: workouts,
        completedChallengesCount: challenges,
        membership: user.membership || 'Basic',
      };
    });

    // Sort descending by total points
    leaderboard.sort((a, b) => b.points - a.points);

    // Assign dynamic ranks
    const rankedLeaderboard = leaderboard.map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));

    return res.status(200).json({ success: true, leaderboard: rankedLeaderboard });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch leaderboard data.' });
  }
};
