import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URL;
if (!uri) {
    throw new Error("❌ MONGODB_URL não está definida no ambiente.");
}

const options = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
};

let client: MongoClient;

declare global {
    // Garante que o tipo seja reconhecido no ambiente dev
    var _mongoClient: MongoClient | undefined;
}

if (process.env.NODE_ENV === "development") {
    if (!global._mongoClient) {
        global._mongoClient = new MongoClient(uri, options);
    }
    client = global._mongoClient;
} else {
    client = new MongoClient(uri, options);
}

export default client;
