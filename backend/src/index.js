import express from "express";
import cors from "cors";
import { Mongo } from "./database/mongo.js";
import dotenv from "dotenv";
import authRouter from "./auth/auth.js";

dotenv.config();

const port = 3000;

const app = express();

const mongoConnection = await Mongo.connect({
    mongoConnectionString: process.env.MONGO_CONNECTION_STRING,
    mongoDbName: process.env.MONGO_DB_NAME,
});

console.log(mongoConnection);

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send({
        success: true,
        statusCode: 200,
        body: "Olá mundo! Essa é a rota GET!",
    });
});

app.use("/auth", authRouter);

app.listen(port, () => {
    console.log(`Server running on: http://localhost:${port}`);
});
