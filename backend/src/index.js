import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send({
        success: true,
        statusCode: 200,
        body: "Olá mundo, essa é a rota GET!",
    });
});

app.listen(port, () => {
    console.log(`Server running on: http://localhost:${port}`);
});
