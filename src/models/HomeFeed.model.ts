import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

const HomeFeedSchema = new mongoose.Schema({
  user: { type: ObjectId, ref: 'User', required: true },
  workouts: { type: [{ type: ObjectId, ref: 'Workout' }], default: [] },
});

const HomeFeed = mongoose.model('HomeFeed', HomeFeedSchema);

export default HomeFeed;
