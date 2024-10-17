// Definição da classe Estudante com seu construtor
class Estudante {
    constructor(nomeAluno, Av1 = 0, Av2 = 0, Av3 = 0, Media = 0, Recuperacao = 0, Situacao = "Reprovado") {
        this.Nome = nomeAluno; // Nome do aluno
        this.Avaliacao1 = Av1; // Nota da Avaliação 1
        this.Avaliacao2 = Av2; // Nota da Avaliação 2
        this.Avaliacao3 = Av3; // Nota da Avaliação 3
        this.Media = Media; // Média do aluno
        this.Recuperacao = Recuperacao; // Nota da recuperação
        this.Situacao = Situacao; // Situação do aluno (Aprovado ou Reprovado)
    }
}


// Seleciona os elementos do formulário e inicializa a lista de alunos
const NovoAlunoForm = document.getElementById("CadastrarAlunos");
const FormGroup = document.getElementById("FormGrupo");
const FormRecuperacao = document.getElementById("FormRecuperacao");
const defMedia = document.querySelector("#Predefinição")

// Selecionando os botões e modais
const btnTurma = document.getElementById('btnTurma');
const btnPontuar = document.getElementById('btnPontuar');
const btnRecuperacao = document.getElementById('btnRecuperacao');

const popupTurma = document.getElementById('popupTurma');
const popupPontuar = document.getElementById('popupPontuar');
const popupRecuperacao = document.getElementById('popupRecuperacao');

const btnDefinirMedia = document.getElementById('btnDefinirMedia');
const btnDefinirRecuperacao = document.getElementById('btnDefinirRecuperacao');
const popupMedia = document.getElementById('popupMedia');
const popupRecuperacaoNota = document.getElementById('popupRecuperacaoNota');

// Função para abrir o pop-up
function abrirPopup(popup) {
    popup.style.display = 'block';
}

// Função para fechar o pop-up
function fecharPopup(popup) {
    popup.style.display = 'none';
}

// Botões de fechar dentro dos pop-ups (selecionando pelo botão "X")
const fecharBtns = document.querySelectorAll('.fechar');

// Adicionando evento de clique em cada botão de fechar
fecharBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const popup = btn.closest('.popup');
        fecharPopup(popup);
    });
});

// Evento de clique para abrir os pop-ups
btnTurma.addEventListener('click', () => abrirPopup(popupTurma));
btnPontuar.addEventListener('click', () => abrirPopup(popupPontuar));
btnRecuperacao.addEventListener('click', () => abrirPopup(popupRecuperacao));

// Fecha o pop-up se clicar fora do conteúdo
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('popup')) {
        fecharPopup(e.target);
    }
});

// Função para abrir o pop-up
function abrirPopup(popup) {
    popup.style.display = 'block';
}

// Função para fechar o pop-up
function fecharPopup(popup) {
    popup.style.display = 'none';
}

// Fechar pop-ups ao clicar no "X"
document.querySelectorAll('.fechar').forEach(btn => {
    btn.addEventListener('click', () => {
        fecharPopup(btn.closest('.popup'));
    });
});

// Abertura dos pop-ups ao clicar nos botões
btnDefinirMedia.addEventListener('click', () => abrirPopup(popupMedia));
btnDefinirRecuperacao.addEventListener('click', () => abrirPopup(popupRecuperacaoNota));

// Evento de submissão do formulário de média
const formMedia = document.getElementById('formMedia');
formMedia.addEventListener('submit', (e) => {
    e.preventDefault();
    const media = parseFloat(document.getElementById('inputMedia').value);
    MediaDefinida = media; // Define a média globalmente
    alert(`Média definida como: ${media}`);
    fecharPopup(popupMedia);
});

// Evento de submissão do formulário de nota de recuperação
const formRecuperacao = document.getElementById('formRecuperacao');
formRecuperacao.addEventListener('submit', (e) => {
    e.preventDefault();
    const notaRecuperacao = parseFloat(document.getElementById('inputRecuperacao').value);
    NotaRecuperacao = notaRecuperacao; // Define a nota de recuperação globalmente
    alert(`Nota de recuperação definida como: ${notaRecuperacao}`);
    fecharPopup(popupRecuperacaoNota);
});

// Fecha o pop-up se clicar fora do conteúdo
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('popup')) {
        fecharPopup(e.target);
    }
});

let MediaDefinida = 0;
let ListaDeAlunos = [];

// Evento de clique para o botão de salvar no pop-up de Turma
const salvarTurmaBtn = document.getElementById('salvarTurma');

salvarTurmaBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // Captura os valores do pop-up
    const nomesAlunos = document.getElementById('inputNomesTurma').value.trim(); // ID do campo de nomes no pop-up

    // Chama a função que já existe para processar esses dados
    const nomesTratados = TratamentoDeDados(nomesAlunos);

    if (nomesTratados.length === 0) {
        alert("Por favor, informe pelo menos um nome de aluno.");
        return;
    }

    // Itera sobre cada nome de aluno informado
    nomesTratados.forEach(nome => {
        // Cria um novo aluno e adiciona à lista
        const aluno = new Estudante(nome);
        ListaDeAlunos.push(aluno);
    });

    // Classifica os alunos por nome em ordem alfabética
    ListaDeAlunos.sort((a, b) => a.Nome.localeCompare(b.Nome));

    // Atualiza a tabela de alunos
    gerarTabelaAlunos();

    // Limpa o campo de texto após a submissão do formulário
    document.getElementById('inputNomesTurma').value = '';

    // Fecha o pop-up após o sucesso
    fecharPopup(popupTurma);
});



const salvarPontuacaoBtn = document.getElementById('salvarPontuacao');

salvarPontuacaoBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // Captura os valores do pop-up
    const nomesAlunos = document.getElementById('inputNomesPontuar').value.trim(); // Campo de nomes
    const nota = parseFloat(document.getElementById('inputNotaPontuar').value.replace(',', '.')); // Campo de nota
    const avaliacaoSelecionada = document.querySelector('input[name="LocalAvPontuar"]:checked').value; // Radio button da avaliação

    // Validação
    if (!nomesAlunos || isNaN(nota)) {
        alert("Por favor, insira os nomes e uma nota válida.");
        return;
    }

    // Trata os dados dos alunos
    const nomesTratados = TratamentoDeDados(nomesAlunos);

    if (nomesTratados.length === 0) {
        alert("Por favor, informe pelo menos um nome de aluno.");
        return;
    }

    // Atualiza as notas dos alunos
    nomesTratados.forEach(nomeAluno => {
        const aluno = ListaDeAlunos.find(a => a.Nome === nomeAluno);

        if (aluno) {
            switch (avaliacaoSelecionada) {
                case "Avaliação1":
                    aluno.Avaliacao1 = nota;
                    break;
                case "Avaliação2":
                    aluno.Avaliacao2 = nota;
                    break;
                case "Avaliação3":
                    aluno.Avaliacao3 = nota;
                    break;
            }
            aluno.Media = ((aluno.Avaliacao1 + aluno.Avaliacao2 + aluno.Avaliacao3) / 3).toFixed(2);

            aluno.Situacao = aluno.Media >= MediaDefinida ? "Aprovado" : "Reprovado";
        }
    });

    // Atualiza a tabela
    gerarTabelaAlunos();

    // Fecha o pop-up após o sucesso
    fecharPopup(popupPontuar);
});

const salvarRecuperacaoBtn = document.getElementById('salvarRecuperacao');

salvarRecuperacaoBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // Captura os valores do pop-up
    const nomesAlunos = document.getElementById('inputNomesRecuperacao').value.trim(); // Campo de nomes
    const notaRecuperacao = parseFloat(document.getElementById('inputNotaRecuperacao').value);
    const mediaRecu = parseFloat(document.getElementById('mediaRecuperacao').value);

    // Validação
    if (!nomesAlunos || isNaN(notaRecuperacao) || isNaN(mediaRecu)) {
        alert("Por favor, insira os dados corretamente.");
        return;
    }

    // Trata os dados dos alunos
    const nomesTratados = TratamentoDeDados(nomesAlunos);

    if (nomesTratados.length === 0) {
        alert("Por favor, informe pelo menos um nome de aluno.");
        return;
    }

    // Atualiza a recuperação dos alunos
    nomesTratados.forEach(nomeAluno => {
        const aluno = ListaDeAlunos.find(a => a.Nome === nomeAluno);

        if (aluno) {
            aluno.Recuperacao = notaRecuperacao;

            aluno.Situacao = notaRecuperacao >= mediaRecu ? "Aprovado" : (aluno.Situacao === "Aprovado" ? "Aprovado" : "Reprovado");
        }
    });

    // Atualiza a tabela
    gerarTabelaAlunos();

    // Fecha o pop-up após o sucesso
    fecharPopup(popupRecuperacao);
});



// Função para tratar os dados dos alunos

function TratamentoDeDados(nomes) {
    if (!nomes) {
        alert("A lista de nomes está vazia.");
        return [];
    }

    // Separa os nomes por vírgula e remove espaços extras
    const nomesTratados = nomes.split(",").map(nome => nome.trim());

    // Função para converter a primeira letra de cada palavra em maiúscula
    const capitalizarNome = nome => 
        nome.split(" ").map(parte => parte.charAt(0).toUpperCase() + parte.slice(1).toLowerCase()).join(" ");

    // Encontra os nomes sem sobrenome
    const nomesIncompletos = nomesTratados.filter(nome => nome.split(" ").length === 1);

    if (nomesIncompletos.length > 0) {
        // Lista quais nomes estão incompletos
        alert(`Por favor, informe o nome completo dos seguintes alunos: ${nomesIncompletos.join(", ")}`);
        return []; // Retorna uma lista vazia se houver algum problema com os nomes
    }

    // Capitaliza e retorna os nomes válidos
    const nomesValidos = nomesTratados.map(capitalizarNome);
    return nomesValidos;
}



defMedia.addEventListener("submit", (e) =>{
    e.preventDefault()
    MediaDefinida = parseFloat(defMedia.valorMedia.value)
    alert("Média " + MediaDefinida + " definida com sucesso!")
    atualizarSituacaoDosAlunos()
})

// Função para atualizar a situação dos alunos com base na nova média de aprovação
function atualizarSituacaoDosAlunos() {
    ListaDeAlunos.forEach(aluno => {
        if (aluno.Media >= MediaDefinida) {
            aluno.Situacao = "Aprovado";
        } else {
            aluno.Situacao = "Reprovado";
        }
    });

    // Atualiza a tabela de alunos
    gerarTabelaAlunos();
}

// Adiciona um evento de submissão ao formulário de cadastro de novos alunos
NovoAlunoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Obtém o valor do campo de texto do formulário de cadastro de novos alunos
    const nomesAlunos = NovoAlunoForm.RecebeNomeAluno.value;

    // Trata os dados dos alunos
    const nomesTratados = TratamentoDeDados(nomesAlunos);

    if (nomesTratados.length === 0) {
        alert("Por favor, informe pelo menos um nome de aluno.");
        return;
    }

    // Adiciona os alunos à lista
    for (let i = 0; i < nomesTratados.length; i++) {
        const aluno = new Estudante(nomesTratados[i]);
        ListaDeAlunos.push(aluno);
        // Classifica o conjunto de nomes em ordem alfabética
        ListaDeAlunos.sort();
    }

    // Limpa o campo de texto após a submissão do formulário
    NovoAlunoForm.RecebeNomeAluno.value = "";

    // Atualiza a tabela de alunos
    gerarTabelaAlunos();
});

// Função para adicionar notas em grupo aos alunos
FormGroup.addEventListener("submit", (e) => {
    e.preventDefault();

    // Obtém o nome dos alunos e a nota do formulário
    const nomesAlunos = FormGroup.NomesAlunosGrup.value.trim();
    const nota = parseFloat(FormGroup.NotaAlunoGrup.value.replace(',', '.'));

    // Obtém o valor do radio button selecionado
    const avaliacaoSelecionada = document.querySelector('input[name="LocalAv"]:checked').value;

    // Trata os dados dos alunos
    const nomesTratados = TratamentoDeDados(nomesAlunos);

    if (nomesTratados.length === 0) {
        alert("Por favor, informe pelo menos um nome de aluno.");
        return;
    }

    // Itera sobre cada nome de aluno informado
    for (let i = 0; i < nomesTratados.length; i++) {
        const nomeAluno = nomesTratados[i];

        // Procura o aluno correspondente na lista de alunos
        const aluno = ListaDeAlunos.find(aluno => aluno.Nome === nomeAluno);

        if (!aluno) {
            alert(`Aluno ${nomeAluno} não encontrado.`);
            return;
        }

        // Atribui a nota à avaliação correspondente
        switch (avaliacaoSelecionada) {
            case "Avaliação1":
                aluno.Avaliacao1 = nota;
                break;
            case "Avaliação2":
                aluno.Avaliacao2 = nota;
                break;
            case "Avaliação3":
                aluno.Avaliacao3 = nota;
                break;
            default:
                alert("Selecione uma avaliação válida.");
                return;
        }

        // Calcula a média do aluno
        aluno.Media = ((aluno.Avaliacao1 + aluno.Avaliacao2 + aluno.Avaliacao3) / 3).toFixed(2);

        // Atualiza a situação do aluno com base na média
        if (aluno.Media >= MediaDefinida) {
            aluno.Situacao = "Aprovado";
        } else {
            aluno.Situacao = "Reprovado";
        }
    }

    // Atualiza a tabela de alunos
    gerarTabelaAlunos();

    // Limpa os campos do formulário
    FormGroup.reset();
});

// Função para gerar o HTML da tabela com os dados dos alunos
function gerarTabelaAlunos() {
    const tabela = document.querySelector("table");

    // Limpa o conteúdo atual da tabela
    tabela.innerHTML = "";

    // Cria o cabeçalho da tabela
    const cabecalho = document.createElement("tr");
    cabecalho.innerHTML = `
        <th>Nome do Aluno</th>
        <th>Avaliação 1</th>
        <th>Avaliação 2</th>
        <th>Avaliação 3</th>
        <th>Média</th>
        <th>Recuperação</th>
        <th>Situação</th>
        <th>Ações</th> <!-- Nova coluna para ações -->
    `;
    tabela.appendChild(cabecalho);

    // Ordena a lista de alunos em ordem alfabética pelo nome
    ListaDeAlunos.sort((a, b) => a.Nome.localeCompare(b.Nome));

    // Adiciona cada aluno na tabela
    ListaDeAlunos.forEach((aluno, index) => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td><span class="nome-aluno">${aluno.Nome}</span></td> <!-- Nome do aluno -->
            <td>${aluno.Avaliacao1}</td>
            <td>${aluno.Avaliacao2}</td>
            <td>${aluno.Avaliacao3}</td>
            <td>${aluno.Media}</td>
            <td>${aluno.Recuperacao}</td>
            <td>${aluno.Situacao}</td>
            <td>
                <button class="btn-editar" data-index="${index}">Editar</button>
            </td> <!-- Botão de editar -->
        `;
        tabela.appendChild(linha);
    });

    // Adiciona evento de clique para editar o nome do aluno
    document.querySelectorAll('.btn-editar').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            editarNomeAluno(index);
        });
    });
}

function editarNomeAluno(index) {
    const aluno = ListaDeAlunos[index];
    const nomeSpan = document.querySelectorAll('.nome-aluno')[index];

    // Cria um campo de input para editar o nome
    const input = document.createElement('input');
    input.type = 'text';
    input.value = aluno.Nome;

    // Substitui o nome atual pelo campo de input
    nomeSpan.replaceWith(input);

    // Adiciona evento de 'blur' (perda de foco) para salvar a edição
    input.addEventListener('blur', () => {
        const novoNome = input.value.trim();

        // Verifica se o novo nome não está vazio
        if (novoNome !== '') {
            aluno.Nome = novoNome;
            gerarTabelaAlunos(); // Atualiza a tabela com o novo nome
        } else {
            // Pergunta ao professor se deseja excluir o aluno
            const confirmarExclusao = confirm("O nome do aluno não pode ser vazio. Deseja excluir o aluno " + aluno.Nome + "?");
            if (confirmarExclusao) {
                // Remove o aluno da lista
                ListaDeAlunos.splice(index, 1);
                gerarTabelaAlunos(); // Atualiza a tabela
            } else {
                // Reverte a edição, se o professor não confirmar a exclusão
                gerarTabelaAlunos(); 
            }
        }
    });

    // Automaticamente foca no campo de input
    input.focus();
}

FormRecuperacao.addEventListener("submit", (e) => {
    e.preventDefault();

    const nomesAlunos = FormRecuperacao.NomesAlunosRecup.value;
    const notaRecuperacao = parseFloat(FormRecuperacao.NotaAlunoRecup.value);
    const mediaRecu = parseFloat(FormRecuperacao.valorMediaRecup.value);

    // Validação da nota de recuperação
    if (isNaN(notaRecuperacao)) {
        alert("Por favor, insira uma nota de recuperação válida.");
        return;
    }

    if (isNaN(mediaRecu)) {
        alert("Por favor, insira uma média de recuperação válida.");
        return;
    }

    // Trata os dados dos alunos
    const nomesTratados = TratamentoDeDados(nomesAlunos);

    if (nomesTratados.length === 0) {
        alert("Por favor, informe pelo menos um nome de aluno.");
        return;
    }

    // Itera sobre cada nome de aluno informado
    nomesTratados.forEach(nomeAluno => {
        const aluno = ListaDeAlunos.find(a => a.Nome === nomeAluno);

        if (!aluno) {
            alert(`Aluno ${nomeAluno} não encontrado.`);
            return;
        }

        // Atualiza a nota de recuperação do aluno
        aluno.Recuperacao = notaRecuperacao;

        // Verifica se a nota de recuperação é suficiente para aprovação
        if (notaRecuperacao >= mediaRecu) {
            aluno.Situacao = "Aprovado"; // Aluno é aprovado se a nota de recuperação for igual ou maior que a média
        } else {
            // Mantenha a situação anterior se o aluno já estiver aprovado
            if (aluno.Situacao !== "Aprovado") {
                aluno.Situacao = "Reprovado"; // Caso contrário, continua reprovado
            }
        }
    });

    // Atualiza a tabela de alunos
    gerarTabelaAlunos();

    // Limpa os campos do formulário
    FormRecuperacao.reset();
});




//document.getElementById("login-btn").addEventListener("click", function() {
  //  window.location.href = "versao17.html";
//});