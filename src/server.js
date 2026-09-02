import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db/dbConnection.js";
import dns from "dns";
import app from "./app.js"

//Solves DNS failure when connecting to database
dns.setServers(["8.8.8.8", "8.8.4.4"]);
app.set("trust proxy", 1);

//Connect to database
connectDB();


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});