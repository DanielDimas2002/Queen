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

// Função para criar um card de turma com link
function addClassCard(disciplina, turma, turno, dataInicial, dataFinal, turmaId) {
    // Criar o link que envolverá o card
    const cardLink = document.createElement("a");
    cardLink.href = `../Painel de Controle/Painel.html?id=${turmaId}`;
 // Inclui o ID da turma na URL
    cardLink.classList.add("card-link");
    cardLink.style.textDecoration = "none"; // Remover a decoração padrão de links

    // Criar o card
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

    const dataInicialP = document.createElement("p");
    dataInicialP.textContent = `Data Inicial: ${formatDate(dataInicial)}`;

    const dataFinalP = document.createElement("p");
    dataFinalP.textContent = `Data Final: ${formatDate(dataFinal)}`;

    cardBody.appendChild(turnoP);
    cardBody.appendChild(dataInicialP);
    cardBody.appendChild(dataFinalP);

    card.appendChild(cardHeader);
    card.appendChild(cardBody);

    // Anexar o card dentro do link
    cardLink.appendChild(card);

    // Adicionar o card linkado no container
    cardContainer.appendChild(cardLink);
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

//Criando Turmas
document.getElementById('createClassForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const disciplina = document.getElementById('disciplina').value;
    const turma = document.getElementById('turma').value;
    const turno = document.getElementById('turno').value;
    const dataInicial = document.getElementById('data_inicial').value;
    const dataFinal = document.getElementById('data_final').value;

    const token = localStorage.getItem('token'); // ou onde você estiver armazenando o token


    try {
        const response = await fetch('http://localhost:3000/criarTurma', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Certifique-se de incluir o token aqui
            },
            body: JSON.stringify({ disciplina, turma, turno, data_inicial: dataInicial, data_final: dataFinal }),
        });

        if (response.ok) {
            const novaTurma = await response.json();
            alert('Turma criada com sucesso!');
            addClassCard(disciplina, turma, turno, dataInicial, dataFinal); // Adicione o card aqui
        } else {
            const errorData = await response.json();
            alert('Erro ao criar turma: ' + errorData.message);
        }
    } catch (error) {
        console.error('Erro ao enviar dados!', error);
        alert('Erro ao criar turma, tente novamente mais tarde.');
    }
});

document.addEventListener('DOMContentLoaded', fectchAndDisplayTurmas);

async function fectchAndDisplayTurmas() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('http://localhost:3000/turmas', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const turmas = await response.json();
            turmas.forEach(turma => {
                if (!turma.id) {
                    console.error('Turma sem ID:', turma); // Log de erro
                    return; // Pula essa turma
                }
                addClassCard(turma.disciplina, turma.turma, turma.turno, turma.dataInicial, turma.dataFinal, turma.id);
            });
        } else {
            const errorData = await response.json();
            alert('Erro ao carregar turmas: ' + errorData.message);
        }
    } catch (error) {
        console.error('Erro ao buscar turmas!', error);
        alert('Erro ao carregar turmas, tente novamente mais tarde.');
    }
}


// Função para acessar dados protegidos
const fetchProtectedData = async () => {
    const token = localStorage.getItem('token'); // Recupera o token

    try {
        const response = await fetch('http://localhost:3000/protected-route', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Insere o token no cabeçalho
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Dados protegidos:', data);
        } else {
            console.error('Erro ao acessar dados protegidos:', response.status);
            alert('Você não está autorizado a acessar esses dados.');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
};