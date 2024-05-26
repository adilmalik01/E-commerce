import { MongoClient } from 'mongodb';
import 'dotenv/config'


// Replace the following with your Atlas connection string                                                                                                                                        
const url = process.env.MONGODB_URI;

// Connect to your Atlas cluster
const client = new MongoClient(url);

async function run() {
    try {
        await client.connect();
        console.log("Successfully connected to Atlas");
    } catch (err) {
        console.log(err.stack);
        await client.close();
        process.exit(1)
    }
}

run().catch(console.dir);
process.on('SIGINT', async function () {
    console.log('SIGINT signal received. Exiting gracefully...');
    await client.close();
})

export default client;