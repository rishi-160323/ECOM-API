import { MongoClient } from "mongodb";

let client;
export const connectToMongoDB = () => {
    // "MongoClient.connect" returns a promise.
    MongoClient.connect(process.env.DB_URL)
        .then(clientInstance => {
            client = clientInstance
            console.log("MongoDB is connected!");
            createCounter(client.db());
            createIndexes(client.db());
        })
        .catch(err => {
            console.log(err);
        })
}

export const getClient = () => {
    return client;
}

export const getDB = () => {
    // This will return only specific database instead of entire server.
    return client.db();
}

// To assign the human readable id to each documents insted of 12 bytes object_id.
const createCounter = async (db) => {
    const existingCounter = await db.collection("counters").findOne({ _id: "cartItemID" });
    if (!existingCounter) {
        await db.collection("counters").insertOne({ _id: "cartItemID", value: 0 });
    }
}

const createIndexes = async (db) => {
    try {
        // 1 for ascending order and -1 for descending.
        await db.collection("products").createIndex({ price: 1 });
        await db.collection("products").createIndex({ name: 1, category: -1 })
        await db.collection("products").createIndex({ desc: 'text' });
        console.log("Index has been created.");
    } catch (error) {
        console.log(error);
    }

}