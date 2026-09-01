import express from "express";
import { geteventos } from "../controllers/eventos.controller.js";
import { postEvento } from "../controllers/eventos.controller.js";

//Criando um objeto de rotas gerenciado pelo express
const eventosRouter = express.Router();

//Definindo que, quando o usuário fizer uma requisição do tipo POST, o servidor deve executar a função postEvento
eventosRouter.post("/", postEvento);
//Definindo que, quando o usuário fizer uma requisição do tipo GET, o servidor deve executar a função geteventos
eventosRouter.get("/", geteventos);

export { eventosRouter };