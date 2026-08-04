import Challenge from '../model/Challenge.js';
import User from '../model/User.js';
import Progress from '../model/Progress.js';

export const createChallenge = async (req, res) => {
  try {
    const { title, description, startDate, startTime, endDate, endTime, image } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Challenge title is required.' });
    }

    const challenge = await Challenge.create({
      title,
      description: description || '',
      startDate: startDate ? new Date(startDate) : null,
      startTime: startTime || '',
      endDate: endDate ? new Date(endDate) : null,
      endTime: endTime || '',
      image: image || '',
      createdBy: req.user._id,
      participants: [req.user._id],
    });

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { createdChallenges: challenge._id, joinedChallenges: challenge._id },
      $inc: { completedChallengesCount: 1 },
    });

    const progress = await Progress.create({
      challengeId: challenge._id,
      name: `${title} Progress`,
      participants: [{ userId: req.user._id, points: 0 }],
    });

    challenge.progress.push(progress._id);
    await challenge.save();

    return res.status(201).json({
      success: true,
      message: 'Challenge created successfully!',
      challengeId: challenge._id,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};

export const getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({});
    const formatted = challenges.map((c) => ({
      id: c._id,
      title: c.title,
      description: c.description,
      image: c.image,
      startDate: c.startDate,
      endDate: c.endDate,
      participants: c.participants ? c.participants.length : 0,
    }));
    return res.status(200).json(formatted);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};

export const getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id).populate('participants', 'name email userImage role').catch(() => null);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found.' });
    }

    return res.status(200).json({
      id: challenge._id,
      title: challenge.title,
      description: challenge.description,
      image: challenge.image,
      startDate: challenge.startDate,
      startTime: challenge.startTime,
      endDate: challenge.endDate,
      endTime: challenge.endTime,
      participants: challenge.participants.map((p) => ({
        id: p._id,
        name: p.name,
        email: p.email,
        image: p.userImage || '',
        role: p.role,
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};

export const joinChallenge = async (req, res) => {
  try {
    const challengeId = req.params.id;
    const userId = req.user ? req.user._id : null;

    const challenge = await Challenge.findById(challengeId).catch(() => null);

    if (userId) {
      const user = await User.findById(userId);
      const alreadyJoined = user?.joinedChallenges?.some((id) => id.toString() === challengeId.toString());

      if (alreadyJoined) {
        return res.status(200).json({
          success: true,
          message: 'You have already joined this challenge.',
          alreadyJoined: true,
          completedChallengesCount: user.completedChallengesCount,
          joinedChallenges: user.joinedChallenges,
        });
      }

      if (challenge && !challenge.participants.includes(userId)) {
        challenge.participants.push(userId);
        await challenge.save();
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: { joinedChallenges: challengeId },
          $inc: { completedChallengesCount: 1 },
        },
        { new: true }
      );

      if (challenge) {
        let progressRecord = await Progress.findOne({ challengeId }).catch(() => null);
        if (!progressRecord) {
          progressRecord = await Progress.create({
            challengeId,
            name: `${challenge.title} Progress`,
            participants: [{ userId, points: 0 }],
          });
          challenge.progress.push(progressRecord._id);
          await challenge.save();
        } else {
          const alreadyInProgress = progressRecord.participants.some((p) => p.userId.toString() === userId.toString());
          if (!alreadyInProgress) {
            progressRecord.participants.push({ userId, points: 0 });
            await progressRecord.save();
          }
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Challenge joined successfully!',
        completedChallengesCount: updatedUser ? updatedUser.completedChallengesCount : 1,
        joinedChallenges: updatedUser ? updatedUser.joinedChallenges : [challengeId],
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Challenge joined successfully!',
      completedChallengesCount: 1,
      joinedChallenges: [challengeId],
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};

export const updateChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id).catch(() => null);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found.' });
    }

    const { title, description, startDate, startTime, endDate, endTime, image } = req.body;

    if (title !== undefined) challenge.title = title;
    if (description !== undefined) challenge.description = description;
    if (startDate !== undefined) challenge.startDate = new Date(startDate);
    if (startTime !== undefined) challenge.startTime = startTime;
    if (endDate !== undefined) challenge.endDate = endDate;
    if (endTime !== undefined) challenge.endTime = endTime;
    if (image !== undefined) challenge.image = image;

    await challenge.save();

    return res.status(200).json({
      success: true,
      message: 'Challenge updated successfully!',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};

export const deleteChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id).catch(() => null);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found.' });
    }

    await Progress.deleteMany({ challengeId: challenge._id });
    await Challenge.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Challenge removed successfully!',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};
