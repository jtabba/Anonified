import { createServer } from "http";
import express, { Application } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import {
	chatrooms,
	createChatroom,
	disconnectOrCloseChatRoom,
	joinChatroom
} from "./chatrooms";
dotenv.config();

const PORT = process.env.PORT || 4000;
const app: Application = express();
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: `http://localhost:3000`
	}
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

io.on("connection", (socket) => {
	console.log(`A user connected`);

	socket.on("createChat", (participantsCapacity, password, alias) => {
		const chatroom = createChatroom(
			participantsCapacity,
			alias,
			password,
			socket.id
		);

		console.log(chatrooms);

		socket.join(chatroom.id);
		console.log("Chatroom created", chatroom);

		io.emit("chatRoomInfo", chatroom, socket.id);
	});

	socket.on("joinChat", async (chatroomId, alias, password) => {
		try {
			const chatroom = joinChatroom(
				chatroomId,
				alias,
				password,
				socket.id
			);

			await socket.join(chatroom!.id);

			console.log(chatroom);

			io.emit("chatRoomInfo", chatroom, socket.id);
			io.emit("newChatMember", `${alias} has joined the chat`, alias);
		} catch (err) {
			io.emit("error", err);
			console.log(err);
		}
	});

	socket.on("sendMessage", (chatroomId, message) => {
		const chatroom = chatrooms.find(
			(chatroom) => (chatroom.id = chatroomId)
		);

		if (chatroom === null) {
			io.emit("error", "Chatroom does not exist");
		}

		io.in(chatroom!.id).emit("recieveMessage", message);
	});

	socket.on("disconnectUser", (chatroomId, alias) => {
		console.log(chatroomId);
		disconnectOrCloseChatRoom(chatroomId, alias);
		socket.leave(chatroomId);
	});

	socket.on("disconnecting", () => {
		console.log(socket.rooms.values);
		// disconnectOrCloseChatRoom(chatroomId, socket.id);
		// socket.leave(chatroomId);
	});
});

server.listen(PORT, () => console.log(`Live chat listening on port ${PORT}`));
