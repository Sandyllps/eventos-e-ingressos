//Lista que armazena os eventos enquanto o servidor estiver em execução.
const eventos = [];

//Define o número que será usado no próximo evento cadastrado.
let proximoId = 1;


//Criando função geteventos
//O req (request) representa a requisição enviada pelo usuário
//O res (response) é usado para enviar a resposta do servidor de volta

const geteventos = (req, res) => {

    //O res.json envia uma resposta no formato JSON
    //Retorna a lista atual de eventos cadastrados
    res.json(eventos);

};


//Função responsável por cadastrar um novo evento.
const postEvento = (req, res) => {

    //O req.body contém os dados enviados pelo usuário
    const evento = req.body;

    //Cria um novo evento com um ID e os campos definidos pela API
    const novoEvento = {
        id: proximoId++,
        nome: evento.nome,
        local: evento.local,
        data: evento.data
    };

    //Adiciona o novo evento à lista
    eventos.push(novoEvento);

    //Retorna o evento cadastrado com o status 201
    res.status(201).json(novoEvento);

};


//Função responsável por excluir um evento
const deleteEvento = (req, res) => {

    //O ID é recebido como parâmetro na URL
    //Como os parâmetros da URL chegam como texto, uso Number() para transformar o ID em número.
    const id = Number(req.params.id);

    // Procura na lista a posição do evento que possui o ID informado
    const indice = eventos.findIndex((evento) => evento.id === id);

    //Se o evento não for encontrado, retorna 404
    if (indice === -1) {
        return res.status(404).json({
            mensagem: "Evento não encontrado."
        });
    }

    //Remove o evento encontrado da lista
    eventos.splice(indice, 1);

    //O status 204 indica que a operação foi realizada com sucesso e não há conteúdo para retornar na resposta
    res.status(204).send();

};


export { geteventos, postEvento, deleteEvento, eventos };