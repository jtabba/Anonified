import { Box, Button, Input, Spinner, Text } from "@chakra-ui/react";
import { StyledTabPanel } from "./styles";
import { CreateOrJoin } from "../CreateOrJoinChat";
import { useLiveChat } from "../../hooks/useLiveChatSocket";
import { useEffect } from "react";
import { useNotification } from "../../components/Notification";
const ENCRYPTION_PASSWORD = process.env.ENCRYPTION_PASSWORD || "";

// use names to distinguish chat bubble colours
// assign colours randomly
// notification for when a user joins the chat

export const AnonifyChatTabPanel = () => {
	const {
		chatRoomInfo,
		isCreatingOrJoining,
		createOrJoinView,
		setIsCreatingOrJoining,
		setCreateOrJoinView,
		chatValues,
		handleSendMessage,
		chatRef,
		chat,
		message,
		setMessage,
		isLoading
	} = useLiveChat();

	console.log(chatValues, chatRoomInfo);

	if (isLoading) {
		return (
			<StyledTabPanel justifyContent={"center"} alignItems={"center"}>
				<Spinner size={"md"} color="primary.white" />
				<Text>
					{createOrJoinView === "create"
						? "Creating chat room..."
						: "Joining chat room..."}
				</Text>
			</StyledTabPanel>
		);
	}

	return (
		<StyledTabPanel justifyContent={"space-evenly"}>
			{!chatRoomInfo.connected ? (
				<Box display={"flex"} flexDirection={"column"} rowGap={5}>
					{isCreatingOrJoining ? (
						<CreateOrJoin />
					) : (
						<>
							<Button
								onClick={() => {
									setIsCreatingOrJoining(true);
									setCreateOrJoinView("create");
								}}
							>
								Create new chat room
							</Button>
							<Button
								onClick={() => {
									setIsCreatingOrJoining(true);
									setCreateOrJoinView("join");
								}}
							>
								Join an existing chat room
							</Button>
						</>
					)}
				</Box>
			) : (
				<Box
					width={"90%"}
					display={"flex"}
					flexDirection={"column"}
					rowGap={5}
					justifyContent={"left"}
					alignItems={"left"}
				>
					<Text textStyle={"body"} margin={"5px 0px 5px 5px"}>
						ChatRoom ID: {chatRoomInfo.chatRoom!.id}
					</Text>
					<Text textStyle={"body"} margin={"5px 0px 5px 5px"}>
						Your alias is {chatValues.alias}
					</Text>
					<Box
						width={"100%"}
						height={"25rem"}
						overflow={"scroll"}
						backgroundColor={"primary.darkBlue"}
						borderRadius={5}
						border={"1px solid black"}
						ref={chatRef}
					>
						{chat.map((message, index) => (
							<Box display={"grid"} key={index}>
								<Text
									padding={2.5}
									margin={"10px 10px 0px 10px"}
									marginBottom={
										index === chat.length - 1
											? "10px"
											: "0px"
									}
									borderRadius={5}
									display={"inline-block"}
									maxWidth={"65%"}
									backgroundColor={
										chatRoomInfo.chatRoom?.userColours[
											message.sentBy
										]
									}
									color={"primary.white"}
									key={index}
									justifySelf={
										message.sentBy === chatValues.alias
											? "end"
											: "start"
									}
								>
									{message.text}
								</Text>
							</Box>
						))}
					</Box>
					<Box
						display={"flex"}
						flexDirection={"row"}
						width={"100%"}
						justifyContent={"center"}
						alignItems={"center"}
					>
						<form
							style={{ width: "100%" }}
							onSubmit={(event) => handleSendMessage(event)}
						>
							<Input
								value={message.text}
								onChange={(event) =>
									setMessage({
										text: event.currentTarget.value,
										dateString: new Date().toISOString(),
										sentBy: chatValues.alias
									})
								}
							/>
						</form>
					</Box>
				</Box>
			)}
		</StyledTabPanel>
	);
};
