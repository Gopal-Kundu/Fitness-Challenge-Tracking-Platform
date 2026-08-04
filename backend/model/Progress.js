import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    challengeId: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    name: {
      type: String,
      default: '',
    },
    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.Mixed,
        },
        points: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;
