import { RequestHandler } from 'express';
import createError from 'http-errors';
import HomeFeed from '../models/HomeFeed.model';

export const getHomeFeed: RequestHandler = async (req, res, next) => {
  try {
    // @ts-ignore TODO add data {uid: string} to req type
    const { uid } = req.data!;
    if (!uid) throw new createError.BadRequest('no uid provided.');

    const homeFeed = await HomeFeed.findOne({ user: uid })
      .populate({ path: 'user.workouts' })
      .populate({ path: 'user.likes' })
      .populate({
        path: 'workouts',
        options: { sort: { createdAt: -1 } },
        populate: { path: 'user', select: 'id username' },
      })
      .populate({ path: 'user', select: 'likes workouts' }); // this populate will allow us to determine if user has liked posts in feed as well as if user has permission to delete post
    res.status(200).json(homeFeed);
  } catch (error) {
    next(error);
  }
};
