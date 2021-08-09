import { RequestHandler } from 'express';
import createError from 'http-errors';
import User from '../models/User.model';

export const getUsers: RequestHandler = (req, res, next) => {
  res.status(200).json({ data: { users: ['here', 'are', 'your', 'users'] } });
};

export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const { username } = req.params;

    // populate following (username, name), followers (username, name), workouts (everything) and likes (everything)
    // if first request we will  make a pre fetch for the current user,
    // axios.get(username)
    // then we will make request for whatever page we are on
    // axios.get(username/likes or username/following or username/follwers)
    const user = await User.findOne({ username: username })
      .select('followers following likes workouts username name _id')
      .populate({ path: 'following', select: 'username name' })
      .populate({ path: 'followers', select: 'username name' })
      .populate({
        path: 'workouts',
        options: { sort: { createdAt: -1 }, skip: 0 },
        populate: { path: 'user', select: 'id username' },
      })
      .populate({
        path: 'likes',
        options: { sort: { createdAt: -1 }, skip: 0 },
        populate: { path: 'user', select: 'id username' },
      });

    if (!user) throw new createError.NotFound('This user does not exist.');
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

// TODO -> replace with react-query

export const getUserLikes: RequestHandler = async (req, res, next) => {};

export const getUserFollowing: RequestHandler = async (req, res, next) => {};

export const getUserFollowers: RequestHandler = async (req, res, next) => {};
