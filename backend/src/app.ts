import createHttpError, { isHttpError } from "http-errors";
import express, { NextFunction, Request, Response } from "express";

import { InsightModel } from "./db";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import insightsRouter from './routes/insightsRoutes';
import morgan from "morgan";
import { validateEnv } from "./utils";

// App Variables
dotenv.config();
validateEnv();

// Initialize the Express app
const app = express();

// Use the dependencies
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

// App Configuration
// check for server running on localhost
// app.get("/", async (req, res) => {
//   try {
//     const data = await InsightModel.find({});
//     res.json(data);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// Routes
app.use('/api/insights', insightsRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(createHttpError(404, "Endpoint not found"));
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error fetching notes:", error);
  let errorMessage = "An unknown Error occurred";
  let statusCode = 500;
  if (isHttpError(error)) {
    errorMessage = error.message;
    statusCode = error.status;
  }
  res.status(statusCode).json(errorMessage);
});

export default app;
