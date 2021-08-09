import Redis from 'redis';

const client = Redis.createClient({
  port: 6379,
  host: '127.0.0.1',
});

client.on('connect', () => {
  console.log('client conncted to redis.');
});

client.on('ready', () => {
  console.log('client conncted to redis and ready to use.');
});

client.on('error', (err: any) => {
  console.log(err);
});

client.on('end', () => {
  console.log('client disconnected from redis');
});

process.on('SIGINT', () => {
  // disconnect from redis
  client.quit();
  // exit program
  process.exit(0);
});

export default client;
