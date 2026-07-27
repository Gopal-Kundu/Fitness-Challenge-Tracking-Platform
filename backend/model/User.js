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
      default: '',
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
    age: {
      type: Number,
    },
    gender: {
      type: String,
    },
    height: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    likedWorkouts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workout',
      },
    ],
    completedWorkouts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workout',
      },
    ],
    joinedChallenges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Challenge',
      },
    ],
    createdChallenges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Challenge',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
