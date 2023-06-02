import { useAxios } from "../utils/fetchData";
import { AnonifyEndpoints } from "../utils/endpoints";
import { AxiosResponse } from "axios";
import { AnonifyResponse } from "../components/TabPanels/types";

const anonifyService = () => {
	const { fetchData } = useAxios();

	const postMessage = async (
		encryptedMessage: string
	): Promise<AxiosResponse | null> => {
		const response: AxiosResponse | null = await fetchData(
			AnonifyEndpoints.Send,
			{
				method: "POST",
				body: JSON.stringify({
					message: encryptedMessage
				}),
				headers: {
					"Content-Type": "application/json"
				}
			}
		);

		if (!response) {
			throw new Error(
				"An unexpected error has occured while sending your message"
			);
		}

		await new Promise((resolve) => setTimeout(resolve, 350)); // set timeout for submission

		return response;
	};

	const getMessage = async (messageId: string): Promise<AnonifyResponse> => {
		const response: AxiosResponse | null = await fetchData(
			AnonifyEndpoints.Get,
			{
				method: "POST",
				body: JSON.stringify({
					id: messageId
				}),
				headers: {
					"Content-Type": "application/json"
				}
			}
		);

		if (!response || !response.data) {
			throw new Error(
				"An unexpected error has occured while getting your message"
			);
		}

		await new Promise((resolve) => setTimeout(resolve, 350)); // set timeout for submission

		return response.data;
	};

	return {
		postMessage,
		getMessage
	};
};

export default anonifyService;
