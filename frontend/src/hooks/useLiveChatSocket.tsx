import {
	FC,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState
} from "react";
import { io } from "socket.io-client";
import { LiveChat, WithChildren } from "./types";
import {
	ChatRoom,
	ChatRoomInfo,
	ChatValues,
	Message
} from "../components/TabPanels/types";
import { useNotification } from "../components/Notification";
const URL = "http://localhost:4000";

const LiveChatContext = createContext<LiveChat | undefined>(undefined);

export const LiveChatProvider: FC<WithChildren> = ({ children }) => {
	const socket = io(URL, {
		autoConnect: false,
		reconnection: false
	});
	const chatRef = useRef<HTMLDivElement | null>(null);
	const { renderNotification } = useNotification();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const messageTemplate = {
		text: "",
		dateString: "",
		sentBy: ""
	};
	const [message, setMessage] = useState<Message>(messageTemplate);
	const [chat, setChat] = useState<Message[]>([]);

	const [chatValues, setChatValues] = useState<ChatValues>({
		password: "test",
		participantsCapacity: 2,
		alias: "test",
		chatroomId: "",
		participantId: ""
	});
	const [chatRoomInfo, setChatRoomInfo] = useState<ChatRoomInfo>({
		connected: false,
		chatRoom: null
	});

	const [isCreatingOrJoining, setIsCreatingOrJoining] =
		useState<boolean>(false);
	const [createOrJoinView, setCreateOrJoinView] = useState<
		"create" | "join" | null
	>(null);

	const handleCreate = (event: any) => {
		event.preventDefault();

		setIsLoading(true);
		socket.connect();

		const timeout = setTimeout(() => {
			socket
				.timeout(10000)
				.emit(
					"createChat",
					chatValues.participantsCapacity,
					chatValues.password,
					chatValues.alias
				);

			setIsCreatingOrJoining(false);
			setIsLoading(false);
		}, 2000);

		return () => clearTimeout(timeout);
	};

	const handleJoin = (event: any) => {
		event.preventDefault();

		setIsLoading(true);
		socket.connect();

		const timeout = setTimeout(() => {
			socket
				.timeout(10000)
				.emit(
					"joinChat",
					chatValues.chatroomId,
					chatValues.alias,
					chatValues.password
				);

			setIsCreatingOrJoining(false);
			setIsLoading(false);
		}, 2000);

		return () => clearTimeout(timeout);
	};

	const handleSendMessage = (event: any) => {
		event.preventDefault();

		socket.connect();
		socket
			.timeout(10000)
			.emit("sendMessage", chatRoomInfo.chatRoom!.id, message);

		setMessage(messageTemplate);
	};

	// add dependencies
	useEffect(() => {
		socket.on(
			"chatRoomInfo",
			(chatRoom: ChatRoom, participantId: string) => {
				setChatRoomInfo({
					connected: true,
					chatRoom: chatRoom
				});
				setChatValues({
					...chatValues,
					participantId: participantId
				});
			}
		);

		console.log(chatRoomInfo);
		console.log(chatValues);

		return () => {
			socket.off(
				"chatRoomInfo",
				(chatRoom: ChatRoom, participantId: string) => {
					setChatRoomInfo({
						connected: true,
						chatRoom: chatRoom
					});
					setChatValues({
						...chatValues,
						participantId: participantId
					});
				}
			);
		};
	}, [socket]);

	useEffect(() => {
		socket.on("recieveMessage", (message: Message) => {
			setChat((currentChat: Message[]) => [...currentChat, message]);
		});

		if (chatRef && chatRef.current) {
			const element = chatRef.current;

			element.scroll({
				top: element.scrollHeight,
				left: 0,
				behavior: "smooth"
			});
		}

		return () => {
			socket.off("recieveMessage", (message: Message) => {
				setChat((currentChat: Message[]) => [...currentChat, message]);
			});
		};
	}, [socket]);

	useEffect(() => {
		const notificationEvent = (message: any) => {
			renderNotification({
				status: "join",
				message: message
			});
		};

		socket.on("newChatMember", (message: string, alias: string) => {
			if (alias !== chatValues.alias) {
				notificationEvent(message);
			}
		});

		return () => {
			socket.off("newChatMember", (message: string, alias: string) => {
				if (alias !== chatValues.alias) {
					notificationEvent(message);
				}
			});
		};
	}, [socket]);

	// create connnected notification

	useEffect(() => {
		socket.on("error", (error: any) => {
			renderNotification({ status: "error", message: error });
		});

		return () => {
			socket.off("error", (error: any) => {
				renderNotification({ status: "error", message: error });
			});
		};
	}, [socket]);

	// useEffect(() => {
	// 	window.onbeforeunload = (event) => {
	// 		const e = event || window.event;
	// 		e.preventDefault();

	// 		socket.connect();
	// 		socket.emit(
	// 			"disconnectUser",
	// 			chatRoomInfo.chatRoom?.id,
	// 			chatValues.alias
	// 		);

	// 		// if (e) {
	// 		// 	e.returnValue = ""; // Legacy method for cross browser support
	// 		// }
	// 		// return "";
	// 	};
	// }, [socket]);

	useEffect(() => {
		window.addEventListener("beforeunload", () => {
			socket.emit(
				"disconnectUser",
				chatRoomInfo.chatRoom?.id,
				chatValues.alias
			);
		});

		return () => {
			window.removeEventListener("beforeunload", () => {
				socket.emit(
					"disconnectUser",
					chatRoomInfo.chatRoom?.id,
					chatValues.alias
				);
			});
		};
	}, []);

	const liveChatContextValue = {
		socket,
		chatValues,
		createOrJoinView,
		isCreatingOrJoining,
		setCreateOrJoinView,
		setIsCreatingOrJoining,
		setChatValues,
		handleCreate,
		handleJoin,
		handleSendMessage,
		chatRoomInfo,
		chat,
		chatRef,
		message,
		setMessage,
		isLoading
	};

	return (
		<LiveChatContext.Provider value={liveChatContextValue}>
			{children}
		</LiveChatContext.Provider>
	);
};

export const useLiveChat = () => {
	const context = useContext(LiveChatContext);

	if (!context) {
		throw new Error("LiveChatProvider must be used");
	}

	return context;
};
