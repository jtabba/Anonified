import { useAxios } from "../utils/fetchData";
import { AnonifyEndpoints } from "../utils/endpoints";
import { AxiosResponse } from "axios";
import { AnonifyResponse } from "../components/TabPanels/types";

const anonifyChatService = () => {
	const { fetchData } = useAxios();

	const createChatroom = async (): Promise<AxiosResponse | null> => {
		const response: AxiosResponse = await fetchData(
			AnonifyEndpoints.CreateChatroom,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				}
			}
		);

		if (!response) {
			throw new Error(
				"An unexpected error has occured while creating the chatroom"
			);
		}

		await new Promise((resolve) => setTimeout(resolve, 350));

		return response;
	};

	const closeChatroom = async () => {};

	const sendMessage = async (message: string, id: string) => {
		const response: AxiosResponse = await fetchData(
			AnonifyEndpoints.SendMessage,
			{
				method: "POST",
				body: JSON.stringify({
					message: message,
					id: id
				}),
				headers: {
					"Content-Type": "application/json"
				}
			}
		);

		if (!response) {
			throw new Error(
				"An unexpected error has occured while creating the chatroom"
			);
		}

		await new Promise((resolve) => setTimeout(resolve, 350));

		return response;
	};

	return {
		createChatroom,
		closeChatroom,
		sendMessage
	};
};

export default anonifyChatService;
