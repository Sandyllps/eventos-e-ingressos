//Criando função geteventos
//O req (request) traz os dados que o usuário enviou
//O res (response) é o que usamos para enviar a resposta do servidor de volta
const geteventos = (req, res) => {
    //O res.Json envia uma resposta no formato JSON
    //Ele está devolvendo uma lista vazia por enquanto
    res.json([]);
};

export { geteventos };