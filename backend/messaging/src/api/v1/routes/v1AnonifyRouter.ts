import AnonifyController from "../anonify/controllers/anonifyController";
import { requestLimiter } from "../anonify/middleware/requestLimiter";
import express from "express";
import * as dotenv from "dotenv";
dotenv.config();

const anonifyController = new AnonifyController();
const v1AnonifyRouter = express.Router();

v1AnonifyRouter.post(
	"/createmessage",
	requestLimiter,
	anonifyController.createMessage
);

v1AnonifyRouter.post(
	"/retrievemessage",
	requestLimiter,
	anonifyController.retrieveAndDeleteMessage
);

export default v1AnonifyRouter;
