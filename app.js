import express from "express";
import { eventosRouter } from "./routes/eventos.route.js";

const app = express();

app.use(express.json());

app.use("/eventos", eventosRouter);

export { app };