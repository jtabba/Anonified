import { Controller, useForm } from "react-hook-form";
import {
	Textarea,
	Text,
	Box,
	Button,
	useClipboard,
	IconButton,
	Tooltip,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	useDisclosure,
	useToast
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { StyledTabPanel } from "./styles";
import { joiResolver } from "@hookform/resolvers/joi";
import { ErrorMessage } from "@hookform/error-message";
import { FC, useRef, useState } from "react";
import { ComposeMessageSchema } from "./schema";
import { ComposeMessage } from "./types";
import { themeWhite } from "../../assets/theme";
import { useMutation } from "react-query";
import anonifyService from "../../services/anonifyService";
import CryptoJS from "crypto-js";
import { useNotification } from "../Notification";
const ENCRYPTION_PASSWORD = process.env.ENCRYPTION_PASSWORD || "";

export const ComposeTabPanel = () => {
	const { postMessage } = anonifyService();
	const { renderNotification } = useNotification();

	const [messageIdCopied, setMessageIdCopied] = useState<boolean>(false);
	const { onCopy, setValue, hasCopied } = useClipboard("", 3000);

	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef(null);

	const [showMessageId, setShowMessageId] = useState<{
		isShowing: boolean;
		message: string;
	}>({ isShowing: false, message: "" });
	const {
		control,
		formState: { errors, isDirty, isValid },
		handleSubmit,
		reset
	} = useForm<ComposeMessage>({
		defaultValues: {
			message: ""
		},
		resolver: joiResolver(ComposeMessageSchema),
		mode: "onBlur",
		reValidateMode: "onBlur"
	});
	const encryptMessage = (message: string) => {
		const encryptedMessage = CryptoJS.AES.encrypt(
			message,
			ENCRYPTION_PASSWORD
		).toString();

		return encryptedMessage;
	};

	const createAnonifyPostMutation = useMutation(
		async (encryptedMessage: string) => postMessage(encryptedMessage),
		{
			onSuccess: (response: any) => {
				reset();

				setShowMessageId({
					isShowing: true,
					message: response.data.id
				});
				setValue(response.data.id);

				renderNotification(response.data);

				return response;
			},
			onError: (error: any) => {
				console.error("error: ", error);
				renderNotification(error);
				return error;
			},
			retry: 2
		}
	);

	const isLoading = createAnonifyPostMutation.isLoading;

	const useAnonifyMutation = async (encryptedMessage: string) =>
		createAnonifyPostMutation.mutateAsync(encryptedMessage);

	const handleOnClick = async (hookFormValues: ComposeMessage) => {
		const { message } = hookFormValues;
		const encryptedMessage = encryptMessage(message);
		const anonifyMutation = await useAnonifyMutation(encryptedMessage);

		return anonifyMutation?.data.message;
	};

	const handleComposeNew = () => {
		if (!messageIdCopied) {
			onOpen();
		} else {
			setShowMessageId({ isShowing: false, message: "" });
		}
	};

	const handleCopyId = () => {
		onCopy();

		if (!messageIdCopied) {
			setMessageIdCopied(true);
		}
	};

	return (
		<StyledTabPanel>
			{showMessageId.isShowing ? (
				<Box
					display={"flex"}
					height={"calc(25vh)"}
					justifyContent={"center"}
					alignItems={"center"}
					flexDirection={"column"}
					rowGap={10}
					margin={10}
				>
					<Box display={"flex"} flexDirection={"row"}>
						<Text textStyle={"body"} margin={"5px 0px 5px 5px"}>
							Your message ID is&nbsp;
						</Text>
						<Text
							textStyle={"body"}
							color={"green.400"}
							margin={"5px 5px 5px 0"}
							fontWeight={"semibold"}
						>
							{showMessageId.message}
						</Text>
						<Tooltip
							hasArrow
							isOpen={hasCopied}
							placement="top"
							label="ID Copied!"
							backgroundColor={"primary.black"}
							color={"primary.white"}
							opacity={"0.8 !important"}
							padding={2}
							borderRadius={5}
						>
							<IconButton
								margin={0}
								variant={"unstyled"}
								alignSelf={"center"}
								aria-label="copy ID"
								icon={
									<CopyIcon
										fontSize={["sm", "md", "lg", "xl"]}
										color={
											hasCopied
												? "green.400"
												: "primary.white"
										}
										_hover={{ color: "green.400" }}
									/>
								}
								onClick={handleCopyId}
								size={["md"]}
							/>
						</Tooltip>
					</Box>
					<Text textStyle={"caption"}>
						Share this ID with someone you want to view the message
						- it will be deleted once they have seen it
					</Text>
					<Button colorScheme={"primary"} onClick={handleComposeNew}>
						Compose a new message
					</Button>
					<AlertDialog
						isOpen={isOpen}
						leastDestructiveRef={cancelRef}
						onClose={onClose}
					>
						<AlertDialogOverlay>
							<AlertDialogContent
								position={"absolute"}
								top={"25%"}
								width={"calc(50vw)"}
								backgroundColor={"primary.black"}
								boxShadow={" 0 0 2px darkgrey"}
							>
								<AlertDialogHeader
									fontSize="lg"
									fontWeight="bold"
									color={"primary.blue"}
								>
									Uncopied message ID
								</AlertDialogHeader>

								<AlertDialogBody color={"primary.white"}>
									The message ID has not been copied - neither
									you or anyone else will ever be able to
									retrieve it without its unique identifier.
									<br />
									<br />
									You will need to copy and send the ID to
									someone if you want them to see it.
								</AlertDialogBody>

								<AlertDialogFooter margin={"5px 0 5px 0"}>
									<Button
										colorScheme="linkedin"
										ref={cancelRef}
										onClick={onClose}
									>
										Cancel, I want to copy it
									</Button>
									<Button
										colorScheme="red"
										onClick={() => {
											onClose();
											setShowMessageId({
												isShowing: false,
												message: ""
											});
										}}
										ml={3}
									>
										Continue, I don't want it
									</Button>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialogOverlay>
					</AlertDialog>
				</Box>
			) : (
				<>
					<Text textStyle={"body"}>
						Create an encrypted message that can only be seen once
						before it is destroyed
					</Text>
					<Controller
						name="message"
						control={control}
						render={({ field }) => (
							<>
								<Textarea
									height={"calc(25vh)"}
									width={"90%"}
									bg={"primary.darkBlue"}
									borderColor={"primary.black"}
									focusBorderColor={"primary.darkBlue"}
									_focus={{ bg: "primary.black" }}
									color={"primary.white"}
									isDisabled={isLoading}
									{...field}
									placeholder={"Write your message here"}
									value={field.value}
									onChange={({ currentTarget: { value } }) =>
										field.onChange(value)
									}
								/>
								<Box
									height={10}
									display={"flex"}
									alignItems={"center"}
								>
									<ErrorMessage
										name="message"
										errors={errors}
										render={({ message }) => (
											<Text textStyle={"error"}>
												{message ?? ""}
											</Text>
										)}
									/>
								</Box>
							</>
						)}
					/>
					<Button
						size={["xs", "sm", "md"]}
						width={"90%"}
						isDisabled={!isDirty || !isValid}
						colorScheme={"primary"}
						border={`1px solid ${themeWhite}`}
						onClick={handleSubmit(handleOnClick)}
						isLoading={isLoading}
						loadingText={"Submitting..."}
					>
						Submit
					</Button>
				</>
			)}
		</StyledTabPanel>
	);
};
