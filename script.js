//Acessando as rotas da API de eventos nesse endereço
const API_URL = "/eventos";


//Busca os eventos cadastrados na API
const carregarEventos = async () => {

    const resposta = await fetch(API_URL);

    const eventos = await resposta.json();

    //Onde os eventos serão exibidos na página.
    const listaEventos = document.getElementById("listaEventos");

    //Limpa a lista antes de exibir os eventos novamente
    listaEventos.innerHTML = "";

    // Mostra a lista de eventos depois que a consulta for realizada.
    listaEventos.hidden = false;

    //Se não houver eventos, exibe uma mensagem
    if (eventos.length === 0) {
        listaEventos.innerHTML = "<p>Nenhum evento cadastrado.</p>";
        return;
    }

    //Cria a visualização de cada evento.
    eventos.forEach((evento) => {

        const divEvento = document.createElement("div");

        divEvento.className = "evento";

        divEvento.innerHTML =
            "<h3>" + evento.nome + "</h3>" +
            "<p><strong>ID:</strong> " + evento.id + "</p>" +
            "<p><strong>Local:</strong> " + evento.local + "</p>" +
            "<p><strong>Data:</strong> " + evento.data + "</p>" +
            "<button class='botao-excluir' data-id='" + evento.id + "'>Excluir</button>";

        listaEventos.appendChild(divEvento);

    });

    //Adiciona a função de exclusão aos botões criados
    const botoesExcluir = document.querySelectorAll(".botao-excluir");

    botoesExcluir.forEach((botao) => {

        botao.addEventListener("click", async () => {
            await excluirEvento(botao.dataset.id);
        });

    });

};


//Cadastra um novo evento na API.
const cadastrarEvento = async (evento) => {

    const resposta = await fetch(API_URL, {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(evento)
    });

    //Verifica se o cadastro foi realizado
    if (resposta.status === 201) {

        alert("Evento cadastrado com sucesso!");

        // Mantém a lista de eventos escondida após o cadastro
        const listaEventos = document.getElementById("listaEventos");
        listaEventos.hidden = true;

        // Mantém o botão indicando que a lista está fechada
        botaoVerEventos.textContent = "Ver eventos cadastrados";


        return;
    }

    // Mostra no console o status retornado pela API.
    console.log("Status retornado pelo POST:", resposta.status);

    alert("Não foi possível cadastrar o evento.");
};


//Exclui um evento pelo ID
const excluirEvento = async (id) => {

    //Confirma a exclusão antes de enviar a requisição.
    const confirmou = confirm(
        "Deseja realmente excluir o evento de ID " + id + "?"
    );

    if (!confirmou) {
        return;
    }

    const resposta = await fetch(API_URL + "/" + id, {
        method: "DELETE"
    });

    //Caso o evento não exista:
    if (resposta.status === 404) {

        alert("Evento não encontrado.");

        await carregarEventos();

        return;
    }

    //Caso a exclusão seja realizada:
    if (resposta.status === 204) {

        alert("Evento excluído com sucesso!");

        //Atualiza a lista depois da exclusão
        await carregarEventos();

        return;
    }

    alert("Não foi possível excluir o evento.");

};


//Captura o formulário de cadastro.
const formulario = document.getElementById("formEvento");

formulario.addEventListener("submit", async (event) => {

    //Impede que a página seja recarregada ao enviar o formulário.
    event.preventDefault();

    //Obtém os valores digitados pelo usuário.
    const nome = document.getElementById("nome").value;
    const local = document.getElementById("local").value;
    const data = document.getElementById("data").value;

    //Cria o objeto que será enviado para a API.
    const evento = {
        nome: nome,
        local: local,
        data: data
    };

    await cadastrarEvento(evento);

    //Limpa os campos do formulário.
    formulario.reset();

});

//NÃO abram o index.html pelo Live Server
//Captura o botão utilizado para visualizar os eventos
const botaoVerEventos = document.getElementById("botaoVerEventos");
botaoVerEventos.addEventListener("click", async () => {

    const listaEventos = document.getElementById("listaEventos");
    
    // Se a lista estiver escondida, consulta e exibe os eventos.
    if (listaEventos.hidden) {
        // Ao clicar no botão, realiza a consulta GET /eventos.
        await carregarEventos();
        
        botaoVerEventos.textContent = "Fechar";

    } else {
        // Esconde a lista de eventos.
        listaEventos.hidden = true;
        botaoVerEventos.textContent = "Ver eventos cadastrados";
    }

});