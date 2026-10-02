//express é um framework que simplifica o tratamento de requisições,
//rotas, e facilita a troca de info. entre a página e o servidor

import express from "express";

import { eventosRouter } from "./routes/eventos.route.js";


const app = express(); //inicializando o framework express e armazenando todas as funcionalidades dele dentro de app
app.disable("x-powered-by"); //Desabilita o cabeçalho que identifica o Express

const port = 8080;

app.use(express.json()); //indicando pro meu servidor que vou trabalhar com JSON

//Disponibiliza os arquivos HTML, CSS e JavaScript que estão na raiz do projeto
app.use(express.static("."));

app.use("/eventos", eventosRouter);

//Incializando o servidor
//Aqui o servidor começa de fato a ouvir as chamadas que a página faz na porta definida
const server = app.listen(port, function () {

    console.log("Servidor rodando com sucesso!");

    console.log(`API HTTP rodando em http://localhost:${port}`);

});

//Escutando eventos de erro na instância do servidor
server.on("error",

    //Essa função será executada quando acontecer um erro:
    (erro) => {

        console.error("Erro: " + erro);

    }

);