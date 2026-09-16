import express from "express";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import createError from "./utils/createError.js";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import orderRouter from "./routes/order.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";

const app = express();

app.use(cors());

//Parses incoming JSON data sent from the frontend
app.use(express.json());

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/orders' ,orderRouter ) 
app.use("/wishlist", wishlistRouter);
app.get('/', (req, res) => {res.send("Ecommerce API Endpoint")});

// معالجة أي مسار غير معروف (404)
app.use((req, res, next) => {
  next(createError(`The URL is not found: ${req.originalUrl}`, 404));
});

//Error Handling
app.use(errorHandler);


export default app;