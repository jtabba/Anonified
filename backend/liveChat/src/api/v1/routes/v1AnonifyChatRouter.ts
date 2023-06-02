import express from "express";
import * as dotenv from "dotenv";
import { randomUUID } from "crypto";
dotenv.config();

interface Chatroom {
	participants?: number;
	id: string;
	messages?: string[];
}
let chatrooms: Chatroom[] = [
	// { id: "Test1", participants: 2, messages: ["This is a test"] },
	// { id: "Test2", participants: 2, messages: [] },
	// { id: "Test3", participants: 2, messages: ["This is a test"] }
];

const v1AnonifyChatRouter = express.Router();

v1AnonifyChatRouter.post("/createChatroom", (req, res) => {
	// console.log("create before: ", chatrooms);

	if (chatrooms.length > 20) {
		return res.send({
			status: 401,
			message:
				"There are too many active chatrooms at the moment - Please try again later."
		});
	}

	const createChatroom = (participants: number = 2) => {
		const chatroomId = randomUUID();
		const chatroom: Chatroom = {
			id: chatroomId,
			participants: participants,
			messages: []
		};

		chatrooms.push(chatroom);

		return chatroom.id;
	};

	const newChatroom = createChatroom();

	console.log("create after: ", chatrooms);

	return res.send({
		status: 200,
		chatroom: newChatroom
	});
});

v1AnonifyChatRouter.post("/sendMessage", (req, res) => {
	console.log("send before: ", chatrooms);
	const targetChatroom = chatrooms.find(
		(chatroom) => chatroom.id === req.body.id
	);

	if (!targetChatroom) {
		return res.send({
			status: 404,
			message: "This chatroom has closed"
		});
	}

	targetChatroom?.messages?.push(req.body.message);

	console.log("send after: ", chatrooms);

	return res.send({
		status: 200,
		message: req.body.message
	});
});

v1AnonifyChatRouter.post("/closeChatroom", (req, res) => {
	console.log("close before: ", chatrooms);
	let index = 0;

	for (const chatroom of chatrooms) {
		if (req.body.chatroom.id === chatroom.id) {
			chatrooms.splice(index, 1);

			break;
		}

		index++;
	}

	console.log("close after: ", chatrooms);

	return res.send({
		status: 200,
		message: `Chatroom ${req.body.chatroom.id} closed`
	});
});

export default v1AnonifyChatRouter;
