import { app } from "./app.js";

const port = 8080;

const server = app.listen(port, function () {
    console.log("Servidor rodando com sucesso!");
    console.log(`API HTTP rodando em http://localhost:${port}`);
});

server.on("error", (erro) => {
    console.error("Erro: " + erro);
});