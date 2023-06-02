import { Request, Response } from "express";

export interface AnonifyResponse {
	status: number;
	id?: string;
	error?: string;
}

export interface IAnonifyService {
	createMessage: (message: string) => Promise<AnonifyResponse>;
	retrieveAndDeleteMessage: (key: string) => Promise<AnonifyResponse>;
}

export interface IAnonifyController {
	createMessage: (
		req: Request,
		res: Response
	) => Promise<Response<any, Record<string, any>>>;
	retrieveAndDeleteMessage: (
		req: Request,
		res: Response
	) => Promise<Response<any, Record<string, any>> | null>;
}
