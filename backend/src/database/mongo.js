import { MongoClient } from "mongodb";

export const Mongo = {
    client: null,
    db: null,

    async connect({ mongoConnectionString, mongoDbName }) {
        try {
            const client = new MongoClient(mongoConnectionString);
            await client.connect();

            this.client = client;
            this.db = client.db(mongoDbName);

            return "Connected to mongoDB!";
        } catch (err) {
            console.error("Error during mongo connection", err);
        }
    },
};
