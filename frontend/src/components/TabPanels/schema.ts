import { ComposeMessage } from "./types";
import Joi from "joi";

export const ComposeMessageSchema = Joi.object<ComposeMessage>({
	message: Joi.string().min(10).max(1000).required().messages({
		"string.required": `You cannot send an empty message`,
		"string.empty": `You cannot send an empty message`,
		"string.min": `Your message must be at least {#limit} characters long`,
		"string.max": `Your message cannot be more than {#limit} characters long`
	})
});
