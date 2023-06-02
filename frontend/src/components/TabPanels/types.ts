export interface ComposeMessage {
	message: string;
}

export interface AnonifyResponse {
	status: number | string;
	message: any;
}

export interface DecryptedMessageData {
	retrieved: boolean;
	message: string;
}

export interface participant {
	name: string;
	id: string;
	colour: string;
}

export interface ChatRoom {
	id: string;
	participants: participant[];
	participantCapacity: number;
	password: string;
	createdOn: string;
	userColours: Record<string, string>;
}

export interface ChatRoomInfo {
	connected: boolean;
	chatRoom: ChatRoom | null;
}

export interface Message {
	text: string;
	dateString: string;
	sentBy: string;
}

export interface ChatValues {
	password: string;
	participantsCapacity: number;
	alias: string;
	chatroomId: string;
	participantId: string;
}
