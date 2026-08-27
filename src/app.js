import express from "express";
import connectDB from "./db/dbConnection.js";
import cors from "cors"

const app = express();

app.use(cors());

//Parses incoming JSON data sent from the frontend
app.use(express.json());

//Connect to database
connectDB();

app.get('/', (req, res) => {res.send("Ecommerce API Endpoint")});

export default app;