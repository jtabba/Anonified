import v1AnonifyRouter from "./api/v1/routes/v1AnonifyRouter";
import express, { Application } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const PORT: string = process.env.PORT || "3000";
const app: Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/api/v1/anonify", v1AnonifyRouter);

app.listen(PORT, (): void => console.log(`Listening on port: ${PORT}`));
