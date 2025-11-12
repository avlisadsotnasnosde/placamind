import { strict } from "assert";
import { MongoClient, ServerApiVersion } from "mongodb";
import { deprecate } from "util";

if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB Connection String not defined");
}

const url = process.env.MONGODB_URL;
const options = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
};

let client: MongoClient;

if (process.env.NODE_ENV === "development") {
    let globalWithMongo = global as typeof globalThis & {
        _mongoClient?: MongoClient;
    };

    if (!globalWithMongo._mongoClient) {
        globalWithMongo._mongoClient = new MongoClient(url, options);
    }
    client = globalWithMongo._mongoClient;
} else {
    client = new MongoClient(url, options);
}

export default client;
