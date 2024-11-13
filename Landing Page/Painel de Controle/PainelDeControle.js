// Definição da classe Estudante com seu construtor
class Estudante {
    constructor(nomeAluno, Av1 = "", Av2 = "", Av3 = "", Media = "", Recuperacao = "", Situacao = "") {
        this.Nome = nomeAluno; // Nome do aluno
        this.Avaliacao1 = Av1; // Nota da Avaliação 1
        this.Avaliacao2 = Av2; // Nota da Avaliação 2
        this.Avaliacao3 = Av3; // Nota da Avaliação 3
        this.Media = Media; // Média do aluno
        this.Recuperacao = Recuperacao; // Nota da recuperação
        this.Situacao = Situacao; // Situação do aluno (Aprovado ou Reprovado)
    }
}

//Definições iniciais
let MediaDefinida = null;
let ListaDeAlunos = [];
let NotaRecuperacaoDefinida = null;

// Funções para gerar e baixar a tabela em PDF e Excel
function baixarTabelaPDF() {
    const { jsPDF } = window.jspdf; // Acesse jsPDF
    const doc = new jsPDF();
    doc.text("Tabela de Alunos", 10, 10);

    // Obtém a tabela HTML
    const tabela = document.querySelector('table');
    // Converte a tabela HTML para PDF
    doc.autoTable({ html: tabela }); // Gera o PDF com base na tabela

    doc.save('Tabela_de_Alunos.pdf'); // Salva o PDF
    popupDownload.style.display = 'none'; // Fecha o pop-up de download
}


function baixarTabelaExcel() {
    const table = document.querySelector('table');
    let csvContent = '';

    table.querySelectorAll('tr').forEach(row => {
        const rowData = Array.from(row.querySelectorAll('th, td'))
            .map(cell => cell.innerText)
            .join(',');
        csvContent += rowData + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'Tabela_de_Alunos.csv';
    downloadLink.click();

    URL.revokeObjectURL(url); // Libera o objeto URL criado
    popupDownload.style.display = 'none';
}


// Seleciona os elementos do formulário e inicializa a lista de alunos
const FormGroup = document.getElementById("FormGrupo");
const FormRecuperacao = document.getElementById("FormRecuperacao");
const defMedia = document.querySelector("#Predefinição")

// Selecionando os botões de ativação do PopUp
const PopUpAddAluno = document.getElementById('PopUpAddAluno');
const PopUpDefMedia = document.getElementById('PopUpDefMedia');
const PopUpPontuar = document.getElementById('PopUpPontuar');
const PopUpNotaRecu = document.getElementById('PopUpNotaRecu');
const btnDownloadTabela = document.getElementById('PopUpDownloadTabela');

// Selecionando os próprios modais
const popupTurma = document.getElementById('popupTurma');
const popupMedia = document.getElementById('popupMedia');
const popupPontuar = document.getElementById('popupPontuar');
const popupRecuperacaoNota = document.getElementById('popupRecuperacaoNota');
const btnCloseDownload = document.getElementById('closeDownload');

// Selecionando os formulários de dentro dos PopUp
const FormPopUpAddAluno = document.getElementById("CadastrarAlunos");
const FormPopUpDefMedia = document.getElementById("formMedia");
const FormPopUpPontuar = document.getElementById("formPontuar");
const FormPopUpNotaRecu = document.getElementById("formNotaRecu")
const btnDownloadPDF = document.getElementById('downloadPDF');
const btnDownloadExcel = document.getElementById('downloadExcel');

// Funcionamento do PopUp

// Seleciona o overlay
const overlay = document.createElement('div');
overlay.classList.add('popup-overlay');
document.body.appendChild(overlay);

function abrirPopup(popup) { // Função para abrir o pop-up
    popup.style.display = 'block';
    overlay.style.display = 'block'; // Exibe o overlay com o desfoque
}

// Evento de clique para abrir os pop-ups
PopUpAddAluno.addEventListener('click', () => abrirPopup(popupTurma));
PopUpDefMedia.addEventListener('click', () => abrirPopup(popupMedia));

PopUpPontuar.addEventListener('click', () => {
    if (MediaDefinida === null || MediaDefinida === 0) {
        alert("É necessário definir uma média!");
    } else {
        abrirPopup(popupPontuar);
    }
});

PopUpNotaRecu.addEventListener('click', () => abrirPopup(popupRecuperacaoNota));
btnDownloadTabela.addEventListener('click', () => {
    popupDownload.style.display = 'block';
});

function fecharPopup(popup) { // Função para fechar o pop-up
    popup.style.display = 'none';
    overlay.style.display = 'none'; // Esconde o overlay
}

const FecharPopUp = document.querySelectorAll('.close, .fechar'); // Botões de fechar dentro dos pop-ups (selecionando pelo botão "X")

FecharPopUp.forEach(btn => { // Adicionando evento de clique em cada botão de fechar
    btn.addEventListener('click', () => {
        const popup = btn.closest('.popup');
        fecharPopup(popup);
    });
});

window.addEventListener('click', (e) => { // Fecha o pop-up se clicar fora do conteúdo
    if (e.target.classList.contains('popup')) {
        fecharPopup(e.target);
    }
});

// Função para fechar o pop-up de download
btnCloseDownload.addEventListener('click', () => {
    fecharPopup(popupDownload);
});

// Função para baixar a tabela em PDF
btnDownloadPDF.addEventListener('click', () => {
    baixarTabelaPDF();
});

// Função para baixar a tabela em Excel
btnDownloadExcel.addEventListener('click', () => {
    baixarTabelaExcel();
});

//Fim do Funcionamento do PopUp

//Funções gerais

function ativarEdicaoNota() { // Função de adição e edição de notas na célula com duplo click
    const tabela = document.querySelector('table');

    tabela.addEventListener('dblclick', (event) => {
        const celula = event.target;
        const linha = celula.closest('tr');

        // Verifica se a célula clicada está na linha abaixo do cabeçalho
        if (linha && linha.rowIndex > 0 && [0, 1, 2, 3, 5].includes(celula.cellIndex)) {
            const valorAtual = celula.textContent.trim();

            // Cria um campo de entrada dentro da célula
            const input = document.createElement('input');
            input.type = 'text';
            input.value = valorAtual;
            input.style.width = '100%';

            // Substitui o conteúdo da célula pelo campo de entrada
            celula.textContent = '';
            celula.appendChild(input);

            // Seleciona o texto atual para facilitar a edição
            input.select();

            // Manipula o término da edição
            input.addEventListener('blur', () => {
                const novoValor = input.value.trim();

                // Para as notas, valida apenas números entre 0 e 10
                if ([1, 2, 3, 5].includes(celula.cellIndex)) {
                    if (!isNaN(novoValor) && novoValor !== '' && novoValor >= 0 && novoValor <= 10) {
                        // Verifica se a nota já existe para o aluno nesta avaliação
                        const linhaAluno = celula.closest('tr');
                        const nomeAluno = linhaAluno.cells[0].textContent.trim();
                        const aluno = ListaDeAlunos.find(a => a.Nome === nomeAluno);
                        let notaExistente;

                        switch (celula.cellIndex) {
                            case 1: // Avaliação 1
                                notaExistente = aluno.Avaliacao1;
                                break;
                            case 2: // Avaliação 2
                                notaExistente = aluno.Avaliacao2;
                                break;
                            case 3: // Avaliação 3
                                notaExistente = aluno.Avaliacao3;
                                break;
                            case 5: // Recuperação
                                notaExistente = aluno.Recuperacao;
                                break;
                        }

                        // Exibe o alerta de confirmação de substituição de nota se a nota já existir
                        if (notaExistente !== "" && notaExistente !== null && notaExistente !== undefined) {
                            const confirmacao = confirm(`O aluno ${nomeAluno} já possui uma nota para essa avaliação (${notaExistente}). Deseja substituir?`);
                            if (!confirmacao) {
                                celula.textContent = valorAtual; // Retorna o valor anterior se o usuário cancelar
                                return;
                            }
                        }

                        // Atualiza a célula com a nova nota
                        celula.textContent = novoValor;

                        // Atualiza a propriedade do aluno com a nova nota
                        switch (celula.cellIndex) {
                            case 1:
                                aluno.Avaliacao1 = parseFloat(novoValor);
                                break;
                            case 2:
                                aluno.Avaliacao2 = parseFloat(novoValor);
                                break;
                            case 3:
                                aluno.Avaliacao3 = parseFloat(novoValor);
                                break;
                            case 5:
                                aluno.Recuperacao = parseFloat(novoValor);
                                break;
                        }

                        // Recalcula a média e atualiza a situação do aluno
                        aluno.Media = ((aluno.Avaliacao1 + aluno.Avaliacao2 + aluno.Avaliacao3) / 3).toFixed(2);
                        aluno.Situacao = aluno.Media >= MediaDefinida ? "Aprovado" : "Reprovado";

                        // Atualiza a tabela com a nova média e situação
                        gerarTabelaAlunos();
                    } else {
                        celula.textContent = valorAtual; // Retorna o valor anterior se inválido
                        alert('Por favor, insira uma nota válida.');
                    }
                } else { // Para a coluna de nome (coluna 0)
                    if (novoValor !== '') {
                        celula.textContent = novoValor;
                        // Atualiza o nome do aluno no sistema
                        atualizarNomeAlunoNaTabela(celula);
                    } else {
                        celula.textContent = valorAtual; // Retorna o valor anterior se o nome for vazio
                        alert('O nome não pode ser vazio.');
                    }
                }
            });

            // Confirma a edição ao pressionar Enter
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    input.blur();
                }
            });
        }
    });
}


// Função auxiliar para atualizar a nota e recalcular média e situação
const atualizarNotaAluno = (celula, alunoIndex, novaNota) => {
    const aluno = ListaDeAlunos[alunoIndex];
    switch (celula.cellIndex) {
        case 1:
            aluno.Avaliacao1 = novaNota;
            break;
        case 2:
            aluno.Avaliacao2 = novaNota;
            break;
        case 3:
            aluno.Avaliacao3 = novaNota;
            break;
        case 5:
            aluno.Recuperacao = novaNota;
            break;
    }
    aluno.Media = ((aluno.Avaliacao1 + aluno.Avaliacao2 + aluno.Avaliacao3) / 3).toFixed(2);
    aluno.Situacao = aluno.Media >= MediaDefinida ? "Aprovado" : "Reprovado";
    gerarTabelaAlunos(); // Atualiza a tabela para refletir mudanças
};

// Iniciar a funcionalidade de edição na célula
ativarEdicaoNota();

function gerarTabelaAlunos() { // Gerar a tabela HTML 
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
        <th>Ações</th>
    `;
    tabela.appendChild(cabecalho);

    // Ordena a lista de alunos em ordem alfabética pelo nome
    ListaDeAlunos.sort((a, b) => a.Nome.localeCompare(b.Nome));

    // Adiciona cada aluno na tabela
    ListaDeAlunos.forEach((aluno, index) => {
        const linha = document.createElement("tr");
        linha.innerHTML = `<td class="selecao"><span class="material-symbols-outlined"></span> <span class="nome-aluno">${aluno.Nome}</span></td>
            <td class="selecao"><span class="material-symbols-outlined"></span> ${aluno.Avaliacao1}</td>
            <td class="selecao"><span class="material-symbols-outlined"></span> ${aluno.Avaliacao2}</td>
            <td class="selecao"><span class="material-symbols-outlined"></span> ${aluno.Avaliacao3}</td>
            <td>${aluno.Media}</td>
            <td class="selecao"><span class="material-symbols-outlined"></span> ${aluno.Recuperacao}</td>
            <td>${aluno.Situacao}</td>
            <td>
                <button class="btn-excluir" data-index="${index}" title="Excluir">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>`;
        tabela.appendChild(linha);
    });

    // Adiciona evento de clique para excluir o aluno
    document.querySelectorAll('.btn-excluir').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.closest('button').getAttribute('data-index');
            excluirAluno(index);
        });
    });
}

// Função para excluir aluno da lista
function excluirAluno(index) {
    const aluno = ListaDeAlunos[index];
    if (confirm(`Tem certeza que deseja excluir o aluno ${aluno.Nome}?`)) {
        ListaDeAlunos.splice(index, 1); // Remove o aluno da lista
        gerarTabelaAlunos(); // Atualiza a tabela após a exclusão
        alert(`Aluno ${aluno.Nome} excluído com sucesso.`);
    }
}

function TratamentoDeDados(nomes) { // Função para tratar os dados dos alunos
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

//Fim das funções gerais

// Função para adição de alunos
FormPopUpAddAluno.addEventListener("submit", (e) => {
    e.preventDefault(); // Impede o comportamento padrão de envio do formulário

    // Obtém o valor do campo de texto do formulário de cadastro de novos alunos
    const nomesAlunos = document.getElementById("inputNomesTurma").value;

    // Trata os dados dos alunos
    const nomesTratados = TratamentoDeDados(nomesAlunos);

    // Adiciona os alunos à lista
    for (let i = 0; i < nomesTratados.length; i++) {
        const aluno = new Estudante(nomesTratados[i]);
        ListaDeAlunos.push(aluno);
    }

    // Classifica o conjunto de nomes em ordem alfabética
    ListaDeAlunos.sort((a, b) => a.Nome.localeCompare(b.Nome)); // Assumindo que a classe Estudante tem um atributo 'nome'

    // Limpa o campo de texto após a submissão do formulário
    document.getElementById("inputNomesTurma").value = "";

    // Atualiza a tabela de alunos
    gerarTabelaAlunos();

    fecharPopup(popupTurma);
});

// Função para pontuação de alunos
FormPopUpPontuar.addEventListener("submit", (e) => {
    e.preventDefault(); // Evita o comportamento padrão de envio do formulário

    // Captura os valores do pop-up
    const nomesAlunos = document.getElementById('NomesAlunos').value.trim(); // Campo de nomes
    const nota = document.getElementById('NotaAluno').value.trim(); // Campo de nota (ainda como string)
    const avaliacaoSelecionada = document.querySelector('input[name="LocalAv"]:checked'); // Radio button da avaliação

    // Validação dos campos
    if (!nomesAlunos) {
        alert("Por favor, insira pelo menos um nome.");
        return;
    }

    if (!nota || isNaN(nota) || parseFloat(nota) < 0 || parseFloat(nota) > 10) {
        alert("Por favor, insira uma nota válida entre 0 e 10.");
        return;
    }

    if (!avaliacaoSelecionada) {
        alert("Por favor, selecione uma avaliação.");
        return;
    }

    // Trata os dados dos alunos
    const nomesTratados = TratamentoDeDados(nomesAlunos);

    if (nomesTratados.length === 0) {
        alert("Por favor, informe pelo menos um nome de aluno.");
        return;
    }

    let alteracaoConfirmada = true; // Variável para controle de sobrescrição de notas

    // Atualiza as notas dos alunos
    nomesTratados.forEach(nomeAluno => {
        const aluno = ListaDeAlunos.find(a => a.Nome === nomeAluno);

        if (!aluno) {
            alert(`Aluno ${nomeAluno} não encontrado.`);
            return;
        }

        // Verifica se a nota já foi lançada e pede confirmação
        let notaExistente;
        switch (avaliacaoSelecionada.value) {
            case "Avaliação1":
                notaExistente = aluno.Avaliacao1;
                break;
            case "Avaliação2":
                notaExistente = aluno.Avaliacao2;
                break;
            case "Avaliação3":
                notaExistente = aluno.Avaliacao3;
                break;
        }

        // Modificação: Verifica se a nota existente é uma string vazia, null ou undefined
        if (notaExistente !== "" && notaExistente !== null && notaExistente !== undefined) {
            alteracaoConfirmada = confirm(`O aluno ${nomeAluno} já possui uma nota para ${avaliacaoSelecionada.value} (${notaExistente}). Deseja sobrescrevê-la?`);
        }

        if (!alteracaoConfirmada) return; // Caso o professor cancele a confirmação, interrompe o processo


        // Atribui a nota à avaliação correspondente
        switch (avaliacaoSelecionada.value) {
            case "Avaliação1":
                aluno.Avaliacao1 = parseFloat(nota);
                break;
            case "Avaliação2":
                aluno.Avaliacao2 = parseFloat(nota);
                break;
            case "Avaliação3":
                aluno.Avaliacao3 = parseFloat(nota);
                break;
            default:
                alert("Selecione uma avaliação válida.");
                return;
        }

        // Calcula a média do aluno
        aluno.Media = ((aluno.Avaliacao1 + aluno.Avaliacao2 + aluno.Avaliacao3) / 3).toFixed(2);

        // Atualiza a situação do aluno com base na média definida
        aluno.Situacao = aluno.Media >= MediaDefinida ? "Aprovado" : "Reprovado";
    });

    // Atualiza a tabela de alunos
    gerarTabelaAlunos();

    // Exibe o alerta de sucesso
    alert("As notas foram distribuídas com sucesso!");

    // Fecha o pop-up após o sucesso
    fecharPopup(popupPontuar);
});


// Evento de submissão do formulário de média
FormPopUpDefMedia.addEventListener('submit', (e) => {
    e.preventDefault();

    // Pega a nova média definida pelo professor
    const novaMediaDefinida = parseFloat(document.getElementById('inputMedia').value);

    // Verifica se já há uma média definida e se o valor foi alterado
    if (MediaDefinida !== null && novaMediaDefinida !== MediaDefinida) {
        const confirmacao = confirm(`A média atual é ${MediaDefinida}. Deseja alterar para ${novaMediaDefinida}?`);

        if (!confirmacao) {
            // Se o professor não confirmar, mantém a média atual
            document.getElementById('inputMedia').value = MediaDefinida;
            return;
        }
    }

    // Atualiza a média definida
    MediaDefinida = novaMediaDefinida;

    // Atualiza o status de todos os alunos
    for (let aluno of ListaDeAlunos) {
        // Verifica se as avaliações estão definidas
        if (aluno.Avaliacao1 || aluno.Avaliacao2 || aluno.Avaliacao3) {
            // Calcula a média do aluno
            const mediaCalculada = ((aluno.Avaliacao1 + aluno.Avaliacao2 + aluno.Avaliacao3) / 3).toFixed(2);

            // Atualiza a situação do aluno com base na média definida
            aluno.Situacao = mediaCalculada >= MediaDefinida ? "Aprovado" : "Reprovado";
        } else {
            // Se não há avaliações, pode definir como "Reprovado" ou outra lógica
            aluno.Situacao = "Reprovado"; // ou outra lógica se necessário
        }
    }

    // Exibe um alerta informando que a média foi definida com sucesso
    alert(`A média foi definida com sucesso: ${MediaDefinida}.`);

    // Atualiza o campo de entrada para mostrar a média definida
    document.getElementById('inputMedia').value = MediaDefinida;

    // Atualiza a tabela
    gerarTabelaAlunos();

    // Fecha o pop-up de média
    fecharPopup(popupMedia);
});

// Função para salvar a nota de recuperação
formNotaRecu.addEventListener('submit', (e) => {
    e.preventDefault(); // Impede o envio padrão do formulário

    NotaRecuperacaoDefinida = parseFloat(document.getElementById('inputRecuperacao').value); // Salva a nota na variável global
    alert("Nota de recuperação definida: " + NotaRecuperacaoDefinida);
    popupRecuperacaoNota.style.display = 'none'; // Fecha o pop-up
    document.querySelector('.popup-overlay').style.display = 'none';
});



