import startServer from './server';
import mongoose from 'mongoose';

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(process.env.MONGODB_URI, mongooseOptions)
  .then(res => {
    console.log(`Connected to Mongo! Database name: "${res.connection.name}"`);
  })
  .catch(err => {
    console.error('Error connecting to mongo:', err);
  });

startServer();
