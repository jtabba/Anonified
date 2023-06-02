import { Button, Input } from "@chakra-ui/react";
import { Dispatch, FC } from "react";
import { useLiveChat } from "../../hooks/useLiveChatSocket";
import { ChatValues } from "../TabPanels/types";

interface CreateOrJoin {
	chatValues: ChatValues;
	setChatValues: Dispatch<ChatValues>;
	setCreating: Dispatch<boolean>;
	createOrJoinView: "create" | "join" | null;
}

export const CreateOrJoin = () => {
	const {
		createOrJoinView,
		chatValues,
		setChatValues,
		handleCreate,
		handleJoin
	} = useLiveChat();

	if (createOrJoinView === "create") {
		return (
			<>
				<Input
					placeholder="Alias"
					value={chatValues.alias}
					onChange={(event) =>
						setChatValues({
							...chatValues,
							alias: event.currentTarget.value
						})
					}
				/>
				<Input
					placeholder="Chat room capacity"
					value={chatValues.participantsCapacity}
					onChange={(event) =>
						setChatValues({
							...chatValues,
							participantsCapacity: Number(
								event.currentTarget.value
							)
						})
					}
				/>
				<Input
					placeholder="Chat room password"
					value={chatValues.password}
					onChange={(event) =>
						setChatValues({
							...chatValues,
							password: event.currentTarget.value
						})
					}
				/>
				<Button onClick={(event) => handleCreate(event)}>Create</Button>
			</>
		);
	}

	if (createOrJoinView === "join") {
		return (
			<>
				<Input
					placeholder="Alias"
					value={chatValues.alias}
					onChange={(event) =>
						setChatValues({
							...chatValues,
							alias: event.currentTarget.value
						})
					}
				/>
				<Input
					placeholder="Chat room ID"
					onChange={(event) =>
						setChatValues({
							...chatValues,
							chatroomId: event.currentTarget.value
						})
					}
				/>
				<Input
					placeholder="Chat room password"
					value={chatValues.password}
					onChange={(event) =>
						setChatValues({
							...chatValues,
							password: event.currentTarget.value
						})
					}
				/>
				<Button onClick={(event) => handleJoin(event)}>Join</Button>
			</>
		);
	}

	return null;
};
