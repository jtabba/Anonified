import connectToDb from "../../../../database/connection";
import { ErrorMessages } from "../../../errorMessages";
import { IAnonifyService } from "../types";
import { ObjectId } from "mongodb";

class AnonifyService implements IAnonifyService {
	async createMessage(message: string) {
		const messagesCollection = await connectToDb("messages");
		const result = await messagesCollection?.insertOne({
			message: message
		});
		const newMessageId = result?.insertedId.toString();

		if (!newMessageId) {
			return {
				status: 400,
				error: ErrorMessages.Unknown
			};
		}

		return {
			status: 200,
			id: newMessageId
		};
	}

	async retrieveAndDeleteMessage(id: string) {
		const messagesCollection = await connectToDb("messages");
		const query = {
			_id: new ObjectId(id)
		};
		const result = await messagesCollection?.findOne(query);

		if (!result) {
			return {
				status: 400,
				message: ErrorMessages.NotFound
			};
		}

		const deleteResult = await messagesCollection?.deleteOne(query);

		if (!deleteResult || !deleteResult.acknowledged) {
			return {
				status: 400,
				message: ErrorMessages.Unknown
			};
		} else {
			return {
				status: 200,
				message: result.message
			};
		}
	}
}

export default AnonifyService;
