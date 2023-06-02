import { useToast, Box } from "@chakra-ui/react";
import { AnonifyResponse } from "../TabPanels/types";

export const useNotification = () => {
	const responseNotification = useToast();
	const getBackgroundColour = (status: number | string) => {
		if (typeof status === "string") {
			return status === "error" ? "red" : "primary.blue";
		}

		return status === 200 ? "primary.blue" : "red";
	};

	const renderNotification = (anonifyResponse: AnonifyResponse) => {
		const { message, status } = anonifyResponse;

		return responseNotification({
			position: "top-left",
			isClosable: true,
			duration: 5000,
			render: () => (
				<Box
					color="primary.white"
					p={3}
					borderRadius={10}
					bg={getBackgroundColour(status)}
					border="2px solid white"
					display="flex"
					justifyContent="center"
				>
					{typeof status === "number"
						? status === 200
							? "Success!"
							: "Error"
						: message}
				</Box>
			)
		});
	};

	return {
		renderNotification
	};
};
