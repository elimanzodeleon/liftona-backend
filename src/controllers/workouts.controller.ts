import mongoose from 'mongoose';
import { RequestHandler } from 'express';
import createError from 'http-errors';
import Workout from '../models/Workout.model';
import User from '../models/User.model';
import HomeFeed from '../models/HomeFeed.model';
import { workoutSchema } from '../utils/schema_validation';

const { ObjectId } = mongoose.Types;

export const addWorkout: RequestHandler = async (req, res, next) => {
  try {
    const {
      error,
      value: { uid, title, details, exercises },
    } = workoutSchema.validate(req.body);

    if (error) throw new createError.BadRequest(error.message);

    // 1. create new workout doc in Workout collection
    const post = await Workout.create({
      user: uid,
      title,
      details,
      exercises,
    });
    // 2. add workout to users workout array field
    const user = await User.findByIdAndUpdate(
      uid,
      { $addToSet: { workouts: post._id } },
      { new: true }
    );
    // 3. add workout to users HomeFeed document
    await HomeFeed.findOneAndUpdate(
      { user: uid },
      { $addToSet: { workouts: post.id } }
    );

    res.status(201).json(post);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const deleteWorkout: RequestHandler = (req, res, next) => {
  try {
    res
      .status(200)
      .json({ message: `deleted workout: ${req.params.workoutId}` });
  } catch (error) {
    next(error);
  }
};
