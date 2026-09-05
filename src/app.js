import express from "express";

import cors from "cors"
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors());

//Parses incoming JSON data sent from the frontend
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {res.send("Ecommerce API Endpoint")});

export default app;