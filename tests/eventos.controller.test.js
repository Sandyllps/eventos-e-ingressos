import { describe, it, expect, beforeEach, vi } from "vitest";

import {
    geteventos,
    postEvento,
    deleteEvento,
    eventos
} from "../controllers/eventos.controller.js";


// Limpa a lista de eventos antes de cada teste.
beforeEach(() => {
    eventos.length = 0;
});


// Cria uma resposta simulada para os testes do controller.
const criarResponse = () => {

    const res = {};

    res.status = vi.fn().mockReturnThis();
    res.json = vi.fn().mockReturnThis();
    res.send = vi.fn().mockReturnThis();

    return res;
};


describe("Controller de eventos", () => {

    it("deve retornar a lista de eventos", () => {

        const req = {};
        const res = criarResponse();

        geteventos(req, res);

        expect(res.json).toHaveBeenCalledWith(eventos);

    });


    it("deve cadastrar um evento", () => {

        const req = {
            body: {
                nome: "Evento unitário",
                local: "IFPE Garanhuns",
                data: "2026-09-20"
            }
        };

        const res = criarResponse();

        postEvento(req, res);

        expect(res.status).toHaveBeenCalledWith(201);

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                nome: "Evento unitário",
                local: "IFPE Garanhuns",
                data: "2026-09-20"
            })
        );

        expect(eventos).toHaveLength(1);

    });


    it("deve excluir um evento existente", () => {

        const reqPost = {
            body: {
                nome: "Evento para exclusão",
                local: "IFPE Garanhuns",
                data: "2026-09-20"
            }
        };

        const resPost = criarResponse();

        // Cria um evento para depois testarmos sua exclusão.
        postEvento(reqPost, resPost);

        // Obtém o evento criado pela resposta do controller.
        const eventoCriado = resPost.json.mock.calls[0][0];

        const reqDelete = {
            params: {
                id: String(eventoCriado.id)
            }
        };

        const resDelete = criarResponse();

        deleteEvento(reqDelete, resDelete);

        expect(resDelete.status).toHaveBeenCalledWith(204);
        expect(resDelete.send).toHaveBeenCalled();

        // Confirma que o evento foi removido da lista.
        expect(eventos).toHaveLength(0);

    });


    it("deve retornar 404 ao tentar excluir um evento inexistente", () => {

        const req = {
            params: {
                id: "999999"
            }
        };

        const res = criarResponse();

        deleteEvento(req, res);

        expect(res.status).toHaveBeenCalledWith(404);

        expect(res.json).toHaveBeenCalledWith({
            mensagem: "Evento não encontrado."
        });

    });

});
