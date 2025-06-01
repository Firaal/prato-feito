import fastify from "fastify";
import cors from "cors";

const app = fastify();

app.get("/", async (request, reply) => {
    reply.send({ success: true, statuscode: 200, body: "Welcome to MyGastronomy" });
});

app.listen({ port: 3000 })
    .then(() => {
        console.log("Server is running on http://localhost:3000");
    })
    .catch((err) => {
        console.error("Error starting server:", err);
        process.exit(1);
    });
