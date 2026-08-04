import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    exercises: [
      {
        name: { type: String, default: '' },
        youtubeLink: { type: String, default: '' },
        description: { type: String, default: '' },
        time: { type: Number, default: 0 },
      },
    ],
    totalKcal: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
    },
    intensity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    createdBy: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

const Workout = mongoose.model('Workout', workoutSchema);
export default Workout;
