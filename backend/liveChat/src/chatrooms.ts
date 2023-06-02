import { randomUUID } from "crypto";

interface Participant {
	alias: string;
	id: string;
	colour: string;
}

interface Chatroom {
	id: string;
	participants: Participant[];
	participantCapacity: number;
	password: string;
	createdOn: string;
	userColours: Record<string, string>;
}

const chatColours = [
	"red",
	"yellow",
	"blue",
	"green",
	"orange",
	"purple",
	"pink",
	"teal",
	"cyan",
	"gray"
];

export const chatrooms: Chatroom[] = [];

export const createChatroom = (
	participantCapacity: number = 2,
	alias: string,
	password: string,
	socketId: string
) => {
	const participant = {
		alias: alias,
		id: socketId,
		colour: chatColours[Math.floor(Math.random() * chatColours.length)]
	};
	const chatroom: Chatroom = {
		id: randomUUID(),
		participants: [participant],
		participantCapacity: participantCapacity,
		password: password,
		createdOn: new Date().toISOString(),
		userColours: {
			[alias]: participant.colour
		}
	};

	chatrooms.push(chatroom);

	return chatroom;
};

const getUserColour = (chatroom: Chatroom) => {
	const userColour =
		chatColours[Math.floor(Math.random() * chatColours.length)];

	if (Object.values(chatroom.userColours).includes(userColour)) {
		getUserColour(chatroom);
	}

	return userColour;
};

export const joinChatroom = (
	chatroomId: string,
	alias: string,
	password: string,
	socketId: string
) => {
	const chatroomIndex = chatrooms.findIndex(
		(chatroom) => (chatroom.id = chatroomId)
	);
	const chatroom = chatrooms[chatroomIndex];

	if (chatroomIndex === -1) {
		throw new Error("This chat room does not exist anymore");
	}

	if (password !== chatroom.password) {
		throw new Error("The chat room password is incorrect");
	}

	// if (chatroom.participants.length === chatroom.participantCapacity) {
	// 	throw new Error("This chat room is full");
	// }

	const userColour = getUserColour(chatroom);
	const participant = {
		alias: alias,
		id: socketId,
		colour: userColour
	};
	chatroom.participants = [...chatroom.participants, participant];
	chatroom.userColours = { ...chatroom.userColours, [alias]: userColour };
	chatrooms[chatroomIndex] = chatroom;

	return chatroom;
};

export const disconnectOrCloseChatRoom = (
	chatroomId: string,
	alias: string
) => {
	console.log(chatroomId);
	const chatroomIndex = chatrooms.findIndex(
		(chatroom) => (chatroom.id = chatroomId)
	);
	const chatroom = chatrooms[chatroomIndex];

	if (chatroomIndex === -1) {
		throw new Error("This chat room does not exist anymore");
	}

	console.log("disconnect before: ", chatroom.participants);

	if (chatroom.participants.length === 1) {
		// chatrooms.splice(chatroomIndex, 1);
	} else {
		for (let i = 0; i < chatroom.participants.length; i++) {
			if (chatroom.participants[i].alias === alias) {
				chatroom.participants.splice(i, 1);
			}
		}

		chatrooms[chatroomIndex] = chatroom;
	}

	delete chatroom.userColours[alias];
	console.log("disconnect after: ", chatroom.participants);
};

export const getParticipantsChatroom = (chatroomId: string) => {
	const chatroom = chatrooms.find((chatroom) => chatroom.id === chatroomId);

	return chatroom;
};
