import createHttpError, { isHttpError } from 'http-errors';
import express, { NextFunction, Request, Response } from 'express';

import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { validateEnv } from './utils';

// App Variables
dotenv.config();
validateEnv();

// Initialize the Express app
const App = express();

// Use the dependencies
App.use(morgan('dev'))
App.use(helmet());
App.use(cors());
App.use(express.json());

// App Configuration
// check for server running on localhost
App.get('/', (req: Request, res: Response) => {
	res.send('Server is running');
});

App.use((req: Request, res: Response, next: NextFunction) => {
	next(createHttpError(404,'Endpoint not found'));
});

App.use((error: Error, req: Request, res: Response, next: NextFunction) => {
	console.error('Error fetching notes:', error);
	let errorMessage = 'An unknown Error occurred';
	let statusCode = 500;
	if(isHttpError(error)){
		errorMessage = error.message;
		statusCode = error.status;
	}
	res.status(statusCode).json(errorMessage);
        
});

export default App;


