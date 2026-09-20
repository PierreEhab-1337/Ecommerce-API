import dotenv from "dotenv";
dotenv.config();

import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import connectDB from "../src/db/dbConnection.js";
import app from "../src/app.js";

app.set("trust proxy", 1);

await connectDB();

export default app;