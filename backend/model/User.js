import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    userImage: {
      type: String,
      default: 'https://shorturl.at/FmV3K',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'member', 'trainer'],
      default: 'member',
    },
    status: {
      type: String,
      enum: ['active', 'blocked', 'pending', 'rejected'],
      default: 'active',
    },
    membership: {
      type: String,
      enum: ['Basic', 'Premium', 'Elite'],
      default: 'Basic',
    },
    goal: {
      type: String,
      default: 'Overall Fitness',
    },
    dietPlan: {
      type: String,
      default: '',
    },
    workoutPlan: {
      type: String,
      default: '',
    },
    age: {
      type: Number,
      default: 26,
    },
    gender: {
      type: String,
      default: 'Not specified',
    },
    height: {
      type: Number,
      default: 180,
    },
    weight: {
      type: Number,
      default: 75,
    },
    completedCalories: {
      type: Number,
      default: 0,
    },
    completedWorkoutsCount: {
      type: Number,
      default: 0,
    },
    completedChallengesCount: {
      type: Number,
      default: 0,
    },
    trainerId: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    trainerName: {
      type: String,
      default: '',
    },
    recentWorkout: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    likedWorkouts: [
      {
        type: mongoose.Schema.Types.Mixed,
      },
    ],
    completedWorkouts: [
      {
        type: mongoose.Schema.Types.Mixed,
      },
    ],
    joinedChallenges: [
      {
        type: mongoose.Schema.Types.Mixed,
      },
    ],
    createdChallenges: [
      {
        type: mongoose.Schema.Types.Mixed,
      },
    ],
    weightLogs: [
      {
        weight: Number,
        date: { type: Date, default: Date.now },
      },
    ],
    bodyMeasurements: {
      chest: { type: Number, default: 40 },
      waist: { type: Number, default: 32 },
      hips: { type: Number, default: 38 },
      arms: { type: Number, default: 15 },
    },
    feedback: [
      {
        trainerName: String,
        text: String,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
