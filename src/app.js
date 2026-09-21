import express from "express";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import createError from "./utils/createError.js";
import cors from "cors";
import cookieParser from 'cookie-parser';
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";
import orderRouter from "./routes/order.routes.js";
import stripeRouter from "./routes/stripe.webhook.routes.js";
import adminRouter from "./routes/admin.routes.js";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger.json" with { type: "json" };

const CDN = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14";

const app = express();

app.use(cors());

app.use('/stripe/webhook', stripeRouter)

//Parses incoming JSON data sent from the frontend
app.use(express.json());

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCssUrl: `${CDN}/swagger-ui.min.css`,
    customJs: [
      `${CDN}/swagger-ui-bundle.min.js`,
      `${CDN}/swagger-ui-standalone-preset.min.js`,
    ],
  })
);

app.use(cookieParser());


app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/carts', cartRouter);
app.use('/wishlists',wishlistRouter);
app.use('/orders', orderRouter);
app.use('/admin', adminRouter);

app.get('/', (req, res) => {res.send("Ecommerce API Endpoint")});


app.use((req, res, next) => {
  next(createError(`The URL is not found: ${req.originalUrl}`, 404));
});

//Error Handling
app.use(errorHandler);


export default app;
