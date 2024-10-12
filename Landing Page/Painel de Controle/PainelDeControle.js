// Definição da classe Estudante com seu construtor
class Estudante {
    constructor(nomeAluno, Av1, Av2, Av3, Media, Situacao) {
        this.Nome = nomeAluno; // Nome do aluno
        this.Avaliacao1 = Av1; // Nota da Avaliação 1
        this.Avaliacao2 = Av2; // Nota da Avaliação 2
        this.Avaliacao3 = Av3; // Nota da Avaliação 3
        this.Media = Media; // Média do aluno
        this.Situacao = Situacao; // Situação do aluno (Aprovado ou Reprovado)
    }
}

// Seleciona os elementos do formulário e inicializa a lista de alunos
const NovoAlunoForm = document.getElementById("CadastrarAlunos");
const FormIndividual = document.getElementById("FormIndividual");
const FormGroup = document.getElementById("FormGrupo");
const defMedia = document.querySelector("#Predefinição")
let MediaDefinida = 0
let ListaDeAlunos = [];

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

            // Atualiza a tabela com o novo nome
            gerarTabelaAlunos();
        } else {
            alert("O nome do aluno não pode ser vazio.");
            gerarTabelaAlunos(); // Reverte a edição se o nome estiver vazio
        }
    });

    // Automaticamente foca no campo de input
    input.focus();
}



document.getElementById("login-btn").addEventListener("click", function() {
    window.location.href = "Painel.html";
});