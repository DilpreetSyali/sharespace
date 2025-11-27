const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://dilpreetsyali:DeCeMbEr201203@project-2.jgwr6.mongodb.net/?appName=Project-2';


const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
