import { Socket } from "socket.io-client";
import {
	ChatRoomInfo,
	ChatValues,
	Message
} from "../components/TabPanels/types";
import { Dispatch, MutableRefObject, SetStateAction } from "react";

export interface LiveChat {
	socket: Socket<any, any>;
	chatValues: ChatValues;
	chatRoomInfo: ChatRoomInfo;
	setChatValues: Dispatch<SetStateAction<ChatValues>>;
	setIsCreatingOrJoining: Dispatch<SetStateAction<boolean>>;
	setCreateOrJoinView: Dispatch<SetStateAction<"create" | "join" | null>>;
	createOrJoinView: "create" | "join" | null;
	isCreatingOrJoining: boolean;
	handleSendMessage: (event: any) => void;
	handleJoin: (event: any) => void;
	handleCreate: (event: any) => void;
	chatRef: MutableRefObject<HTMLDivElement | null>;
	chat: Message[];
	message: Message;
	setMessage: Dispatch<SetStateAction<Message>>;
	isLoading: boolean;
}

export interface WithChildren<T = React.ReactNode> {
	children?: T;
}
