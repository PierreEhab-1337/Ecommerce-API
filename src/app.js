import express from "express";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import createError from "./utils/createError.js";
import cors from "cors";


const app = express();

app.use(cors());

//Parses incoming JSON data sent from the frontend
app.use(express.json());

app.get('/', (req, res) => {res.send("Ecommerce API Endpoint")});

// معالجة أي مسار غير معروف (404)
app.use((req, res, next) => {
  next(createError(`The URL is not found: ${req.originalUrl}`, 404));
});

//Error Handling
app.use(errorHandler);


export default app;