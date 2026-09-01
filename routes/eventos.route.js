import express from "express";
import { geteventos } from "../controllers/eventos.controller.js";

//Criando um objeto de rotas gerenciado pelo express
const eventosRouter = express.Router();

//Definindo que, quando o usuário fizer uma requisição do tipo get, o servidor deve executar a função geteventos
eventosRouter.get("/", geteventos);

export { eventosRouter };