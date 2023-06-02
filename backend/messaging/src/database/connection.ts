import * as dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";
dotenv.config();

const uri = process.env.ATLAS_URI || "";

const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true
	},
	maxPoolSize: 1
});

const connectToDb = async (collectionName: string) => {
	try {
		const connection = await client.connect();
		const anonifyDb = connection.db("Anonify");
		const collection = anonifyDb.collection(collectionName);

		console.log("Successfully connected to MongoDb");

		return collection;
	} catch (err: Error | unknown) {
		console.error(err);
	}
};

export default connectToDb;
