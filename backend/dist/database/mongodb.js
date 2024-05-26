"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mongodb_1 = require("mongodb");
require("dotenv/config");
// Replace the following with your Atlas connection string                                                                                                                                        
const url = "mongodb+srv://adil5679:adil5679@cluster0.00tt7hd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Connect to your Atlas cluster
const client = new mongodb_1.MongoClient(url);
async function run() {
    try {
        await client.connect();
        console.log("Successfully connected to Atlas");
    }
    catch (err) {
        console.log(err);
        await client.close();
        process.exit(1);
    }
}
run().catch(console.dir);
process.on('SIGINT', async function () {
    console.log('SIGINT signal received. Exiting gracefully...');
    await client.close();
});
exports.default = client;
function db(arg0) {
    throw new Error('Function not implemented.');
}
exports.db = db;
