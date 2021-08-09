import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

const WorkoutSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: String,
      trim: true,
    },
    exercises: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        sets: {
          type: Number,
          min: 1,
          max: 15,
          required: true,
        },
        reps: {
          type: Number,
          min: 1,
          max: 100,
          required: true,
        },
        unilateral: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const Workout = mongoose.model('Workout', WorkoutSchema);

export default Workout;
