import express from "express";
import connectDB from "./db/dbConnection.js";
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import cors from "cors"

const app = express();

app.use(cors());

//Parses incoming JSON data sent from the frontend
app.use(express.json());
app.use(errorHandler);

//Connect to database
connectDB();

app.get('/', (req, res) => {res.send("Ecommerce API Endpoint")});

// معالجة أي مسار غير معروف (404)
app.all('*', (req, res, next) => {
  next(createError(`The URL is not found: ${req.originalUrl}`, 404));
});


export default app;