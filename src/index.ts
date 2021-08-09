import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

import express, { Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/users.routes';
import workoutRoutes from './routes/workouts.routes';
import homeFeedRoutes from './routes/homeFeed.routes';
import connectDB from './config/mongodb';
import { IUserDataRequest } from './interfaces/requestHandler.interface';

import { nothingFoundHandler, errorHandler } from './middleware';

connectDB();

//@ts-ignore
const port = process.env.PORT || 3500;
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

/* TEST */
import { verifyAccessToken } from './utils/jwt';
import { verify } from 'jsonwebtoken';
app.get('/', verifyAccessToken, (req: IUserDataRequest, res: Response) => {
  res
    .status(200)
    .json({ message: 'private route, successfully verified accesstoken' });
});
/* END TEST */

app.use('/auth', authRoutes);
app.use('/users', verifyAccessToken, userRoutes);
app.use('/workouts', verifyAccessToken, workoutRoutes);
app.use('/home-feed', verifyAccessToken, homeFeedRoutes);

// 404
app.use(nothingFoundHandler);
// error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
