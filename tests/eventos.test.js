import express from "express";
import request from "supertest";
import { describe, it, expect } from "vitest";
import { eventosRouter } from "../routes/eventos.route.js";

const app = express();

app.use(express.json());
app.use("/eventos", eventosRouter);

describe("API de eventos", () => {

    it("deve retornar uma lista vazia ao buscar eventos", async () => {
        const response = await request(app)
            .get("/eventos");

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });


    it("deve cadastrar um evento e retornar os dados com ID", async () => {
        const evento = {
            nome: "Evento de teste",
            local: "IFPE Garanhuns",
            data: "2026-09-20"
        };

        const response = await request(app)
            .post("/eventos")
            .send(evento);

        expect(response.status).toBe(201);

        expect(response.body).toEqual({
            id: 1,
            nome: "Evento de teste",
            local: "IFPE Garanhuns",
            data: "2026-09-20"
        });
    });


    it("deve excluir um evento existente e retornar 204", async () => {
        const response = await request(app)
            .delete("/eventos/1");

        expect(response.status).toBe(204);
    });


    it("deve retornar 404 ao tentar excluir um evento que não existe", async () => {
        const response = await request(app)
            .delete("/eventos/1");

        expect(response.status).toBe(404);

        expect(response.body).toEqual({
            mensagem: "Evento não encontrado."
        });
    });


    it("deve retornar uma lista vazia depois que o evento for excluído", async () => {
        const response = await request(app)
            .get("/eventos");

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

});
