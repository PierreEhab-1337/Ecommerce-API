import express from "express";
import connectDB from "./db/dbConnection.js";
import cors from "cors"
import cookieParser from 'cookie-parser';
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import createError from "./utils/createError.js";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";


const app = express();

app.use(cors());

//Parses incoming JSON data sent from the frontend
app.use(express.json());
app.use(cookieParser());
//Connect to database
connectDB();

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/products', productRouter);

app.get('/', (req, res) => {res.send("Ecommerce API Endpoint")});


app.use((req, res, next) => {
  next(createError(`The URL is not found: ${req.originalUrl}`, 404));
});

//Error Handling
app.use(errorHandler);


export default app;