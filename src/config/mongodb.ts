import mongoose from 'mongoose';

const dbURI = process.env.DB_URI!;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log('connected to mongoDB.');
  } catch (error) {
    console.log(error);
  }
};

mongoose.connection.on('connected', () => {
  console.log('mongoose connected to db');
});

mongoose.connection.on('error', error => {
  console.log(error.message);
});

mongoose.connection.on('disconnect', () => {
  console.log('mongoose disconnected from db');
});

// ctrl-c pressed
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

export default connectDB;
