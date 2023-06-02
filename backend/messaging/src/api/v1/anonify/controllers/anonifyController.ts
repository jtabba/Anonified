import { Request, Response } from "express";
import { IAnonifyController } from "../types";
import AnonifyService from "../services/anonifyService";
import { ErrorMessages } from "../../../errorMessages";

const anonifyService = new AnonifyService();

class AnonifyController implements IAnonifyController {
	async createMessage(req: Request, res: Response) {
		try {
			const response = await anonifyService.createMessage(
				req.body.message
			);

			return res.send(response);
		} catch (err: Error | unknown) {
			res.send({
				status: 400,
				message: err
			});

			throw new Error(`Failed to create message: ${err}`);
		}
	}

	async retrieveAndDeleteMessage(req: Request, res: Response) {
		try {
			if (req.body.id === "" || req.body.id.split("").length < 24) {
				return res.send({
					status: 404,
					message: ErrorMessages.Invalid
				});
			}
			const response = await anonifyService.retrieveAndDeleteMessage(
				req.body.id
			);

			return res.send(response);
		} catch (err: Error | unknown) {
			res.send({
				status: 400,
				message: err
			});

			throw new Error(`Failed to retrieve message: ${err}`);
		}
	}
}

export default AnonifyController;
