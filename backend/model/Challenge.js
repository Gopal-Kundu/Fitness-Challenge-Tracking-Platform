import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'ENDURANCE',
    },
    reward: {
      type: String,
      default: '500 APEX Pts',
    },
    startDate: {
      type: Date,
    },
    startTime: {
      type: String,
    },
    endDate: {
      type: Date,
    },
    endTime: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.Mixed,
    },
    participants: [
      {
        type: mongoose.Schema.Types.Mixed,
      },
    ],
    progress: [
      {
        type: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Challenge = mongoose.model('Challenge', challengeSchema);
export default Challenge;
