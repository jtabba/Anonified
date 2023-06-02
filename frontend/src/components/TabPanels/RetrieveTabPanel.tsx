import { Box, Button, Input, Text, Textarea, useToast } from "@chakra-ui/react";
import { StyledTabPanel } from "./styles";
import { useNotification } from "../Notification";
import anonifyService from "../../services/anonifyService";
import { useQuery } from "react-query";
import { useState } from "react";
import CryptoJS from "crypto-js";
import { themeBlack, themeWhite } from "../../assets/theme";
import { AnonifyResponse } from "./types";
const ENCRYPTION_PASSWORD = process.env.ENCRYPTION_PASSWORD || "";

interface DecryptedMessageData {
	retrieved: boolean;
	message: string;
}

export const RetrieveTabPanel = () => {
	const { getMessage } = anonifyService();
	const [messageId, setMessageId] = useState<string>("");
	const [decryptedMessageData, setDecryptedMessageData] =
		useState<DecryptedMessageData>({ retrieved: false, message: "" });
	const { renderNotification } = useNotification();
	const anonifyQuery = useQuery(
		["anonify-message"],
		() => getMessage(messageId),
		{
			enabled: false,
			onSuccess: (data) => {
				if (data.status === 200) {
					const decryptedMessageBytes = CryptoJS.AES.decrypt(
						data!.message!,
						ENCRYPTION_PASSWORD
					);
					const _decryptedMessage = decryptedMessageBytes.toString(
						CryptoJS.enc.Utf8
					);

					setDecryptedMessageData({
						retrieved: true,
						message: _decryptedMessage
					});
				}

				renderNotification(data);
			}
		}
	);

	const isLoading = anonifyQuery.isLoading;

	const handleRetrieve = () => {
		anonifyQuery.refetch();
	};

	return (
		<StyledTabPanel justifyContent={"space-evenly"}>
			{decryptedMessageData.retrieved ? (
				<>
					<Text
						textStyle={"body"}
						border={`2px solid ${themeBlack}`}
						borderRadius={10}
						width={"90%"}
						height={"50%"}
						padding={5}
						backgroundColor={"primary.darkBlue"}
					>
						{decryptedMessageData.message}
					</Text>

					<Button
						size={["xs", "sm", "md"]}
						width={"90%"}
						colorScheme={"primary"}
						border={`1px solid ${themeWhite}`}
						onClick={() =>
							setDecryptedMessageData({
								retrieved: false,
								message: ""
							})
						}
					>
						Retrieve another
					</Button>
				</>
			) : (
				<>
					<Text textStyle={"body"} margin={0}>
						Input a unique ID to retrieve and delete a message
					</Text>
					<Input
						onChange={(event) =>
							setMessageId(event.currentTarget.value)
						}
						width={"90%"}
					/>
					<Button
						size={["xs", "sm", "md"]}
						width={"90%"}
						colorScheme={"primary"}
						border={`1px solid ${themeWhite}`}
						onClick={handleRetrieve}
						isLoading={isLoading}
						loadingText={"Retrieving..."}
					>
						Retrieve message
					</Button>
				</>
			)}
		</StyledTabPanel>
	);
};
