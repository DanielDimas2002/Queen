// JavaScript para abrir e fechar o pop-up
const modal = document.getElementById("turmaModal");
const btn = document.getElementById("openFormButton");
const span = document.getElementsByClassName("close")[0];
const form = document.getElementById("createClassForm");
const cardContainer = document.getElementById("cardContainer");

// Abrir o pop-up quando o botão for clicado
btn.onclick = function() {
    modal.style.display = "block";
}

// Fechar o pop-up quando o "X" for clicado
span.onclick = function() {
    modal.style.display = "none";
}

// Fechar o pop-up clicando fora da janela modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Função para formatar a data no formato DD/MM/AAAA
function formatDate(date) {
    const newDate = new Date(date);
    return newDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Função para criar um card de turma
function addClassCard(disciplina, turma, turno, dataInicial, dataFinal) {
    const card = document.createElement("div");
    card.classList.add("card");

    const cardHeader = document.createElement("div");
    cardHeader.classList.add("card-header", "blue");
    const h3 = document.createElement("h3");
    h3.textContent = disciplina;
    const p = document.createElement("p");
    p.textContent = turma;

    cardHeader.appendChild(h3);
    cardHeader.appendChild(p);

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const turnoP = document.createElement("p");
    turnoP.textContent = `Turno: ${turno}`;

    // Formatar as datas
    const dataInicialP = document.createElement("p");
    dataInicialP.textContent = `Data Inicial: ${formatDate(dataInicial)}`;

    const dataFinalP = document.createElement("p");
    dataFinalP.textContent = `Data Final: ${formatDate(dataFinal)}`;

    // Botão de edição
    const editButton = document.createElement("button");
    editButton.textContent = "Editar";
    editButton.classList.add("edit-button");

    // Adicionar evento ao botão de edição
    editButton.onclick = function() {
        openEditModal(card, disciplina, turma, turno, dataInicial, dataFinal);
    };

    // Botão de exclusão
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Excluir";
    deleteButton.classList.add("delete-button");

    // Adicionar evento ao botão de exclusão
    deleteButton.onclick = function() {
        cardContainer.removeChild(card); // Remove o card do container
    };

    // Anexar elementos ao card
    cardBody.appendChild(turnoP);
    cardBody.appendChild(dataInicialP);
    cardBody.appendChild(dataFinalP);
    cardBody.appendChild(editButton); // Adicionar o botão de edição
    cardBody.appendChild(deleteButton); // Adicionar o botão de exclusão

    card.appendChild(cardHeader);
    card.appendChild(cardBody);

    cardContainer.appendChild(card);
}

// Função para reabrir o pop-up com as informações da turma para edição
function openEditModal(card, disciplina, turma, turno, dataInicial, dataFinal) {
    // Preencher o formulário com os dados existentes
    document.getElementById("disciplina").value = disciplina;
    document.getElementById("turma").value = turma;
    document.getElementById("turno").value = turno;
    document.getElementById("data_inicial").value = dataInicial;
    document.getElementById("data_final").value = dataFinal;

    // Abrir o modal
    modal.style.display = "block";

    // Atualizar a função de envio do formulário para salvar as alterações
    form.onsubmit = function(event) {
        event.preventDefault(); // Evitar o recarregamento da página

        // Pegar os dados do formulário
        const updatedDisciplina = document.getElementById("disciplina").value;
        const updatedTurma = document.getElementById("turma").value;
        const updatedTurno = document.getElementById("turno").value;
        const updatedDataInicial = document.getElementById("data_inicial").value;
        const updatedDataFinal = document.getElementById("data_final").value;

        // Atualizar o conteúdo do card com os novos dados
        card.querySelector(".card-header h3").textContent = updatedDisciplina;
        card.querySelector(".card-header p").textContent = updatedTurma;
        const cardBodyP = card.querySelectorAll(".card-body p");
        cardBodyP[0].textContent = `Turno: ${updatedTurno}`;
        cardBodyP[1].textContent = `Data Inicial: ${formatDate(updatedDataInicial)}`;
        cardBodyP[2].textContent = `Data Final: ${formatDate(updatedDataFinal)}`;

        // Fechar o modal
        modal.style.display = "none";
    };
}

// Atualizar a lógica do formulário para criar um novo card ao enviar
form.onsubmit = function(event) {
    event.preventDefault(); // Evitar o recarregamento da página

    // Pegar os dados do formulário
    const disciplina = document.getElementById("disciplina").value;
    const turma = document.getElementById("turma").value;
    const turno = document.getElementById("turno").value;
    const dataInicial = document.getElementById("data_inicial").value;
    const dataFinal = document.getElementById("data_final").value;

    // Criar um novo card
    addClassCard(disciplina, turma, turno, dataInicial, dataFinal);

    // Limpar o formulário
    form.reset();

    // Fechar o modal
    modal.style.display = "none";
};
