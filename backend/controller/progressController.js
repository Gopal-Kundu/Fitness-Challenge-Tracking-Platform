import Progress from '../model/Progress.js';
import Challenge from '../model/Challenge.js';
import User from '../model/User.js';

export const createProgress = async (req, res) => {
  try {
    const { challengeId, name } = req.body;

    if (!challengeId) {
      return res.status(400).json({ success: false, message: 'Challenge ID is required.' });
    }

    const challenge = await Challenge.findById(challengeId).catch(() => null);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found.' });
    }

    const initialParticipants = challenge.participants.map((uId) => ({
      userId: uId,
      points: 0,
    }));

    const progress = await Progress.create({
      challengeId,
      name: name || `${challenge.title} Progress`,
      participants: initialParticipants,
    });

    challenge.progress.push(progress._id);
    await challenge.save();

    return res.status(201).json({
      success: true,
      message: 'Progress tracked successfully!',
      progressId: progress._id,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};

export const addPointsToUser = async (req, res) => {
  try {
    const progressId = req.params.id;
    const { userId, points } = req.body;

    if (!userId || points === undefined) {
      return res.status(400).json({ success: false, message: 'User ID and points are required.' });
    }

    let progress = await Progress.findById(progressId).catch(() => null);
    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progress record not found.' });
    }

    const participantIndex = progress.participants.findIndex(
      (p) => p.userId && p.userId.toString() === userId.toString()
    );

    if (participantIndex > -1) {
      progress.participants[participantIndex].points += Number(points);
    } else {
      progress.participants.push({
        userId,
        points: Number(points),
      });
    }

    await progress.save();

    return res.status(200).json({
      success: true,
      message: 'Points updated successfully!',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};

export const getChallengeProgress = async (req, res) => {
  try {
    const { challengeId } = req.params;

    const challenge = await Challenge.findById(challengeId).catch(() => null);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found.' });
    }

    const progressList = await Progress.find({ challengeId }).populate('participants.userId', 'name email userImage');

    const participantMap = {};

    progressList.forEach((prog) => {
      prog.participants.forEach((p) => {
        if (p.userId) {
          const uId = p.userId._id.toString();
          const name = p.userId.name || 'User';
          if (!participantMap[uId]) {
            participantMap[uId] = {
              name,
              points: 0,
            };
          }
          participantMap[uId].points += p.points || 0;
        }
      });
    });

    const participants = Object.values(participantMap).sort((a, b) => b.points - a.points);

    return res.status(200).json({
      challenge: challenge.title,
      participants,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};
