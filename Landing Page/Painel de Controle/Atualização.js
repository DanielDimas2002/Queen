class Estudante {
    constructor(nomeAluno, numAvaliacoes = 3) {
        this.Nome = nomeAluno;
        this.Avaliacoes = Array(numAvaliacoes).fill(""); // Inicia com avaliações vazias
        this.Media = "";
        this.Recuperacao = "";
        this.Situacao = "Reprovado";
    }

    calcularMedia() {
        const notasValidas = this.Avaliacoes.filter(nota => nota !== "");
        if (notasValidas.length > 0) {
            this.Media = (notasValidas.reduce((acc, val) => acc + parseFloat(val), 0) / notasValidas.length).toFixed(2);
        } else {
            this.Media = "";
        }
    }

    atualizarSituacao(mediaAprovacao = 7) {
        if (this.Media !== "") {
            this.Situacao = parseFloat(this.Media) >= mediaAprovacao ? "Aprovado" : "Reprovado";
        }
    }
}

//Definições iniciais(Variáveis globais)
let MediaDefinida = null;
let QuantidadeAvaliacoes = 3;
let ListaDeAlunos = [];
let NotaRecuperacaoDefinida = null;
let TitulosAvaliacoes = Array(QuantidadeAvaliacoes).fill('').map((_, i) => `Avaliação ${i + 1}`);

// Seleciona os elementos do formulário e inicializa a lista de alunos
const FormGroup = document.getElementById("FormGrupo");
const FormRecuperacao = document.getElementById("FormRecuperacao");
const defMedia = document.querySelector("#Predefinição");

// Selecionando os botões de ativação do PopUp
const PopUpAddAluno = document.getElementById('PopUpAddAluno');
const PopUpDefMedia = document.getElementById('PopUpDefMedia');
const PopUpPontuar = document.getElementById('PopUpPontuar');
const btnDownloadTabela = document.getElementById('PopUpDownloadTabela');

// Selecionando os próprios modais
const popupTurma = document.getElementById('popupTurma');
const popupMedia = document.getElementById('popupMedia');
const popupPontuar = document.getElementById('popupPontuar');

// Selecionando os formulários de dentro dos PopUp
const FormPopUpAddAluno = document.getElementById("CadastrarAlunos");
const FormPopUpDefMedia = document.getElementById("formMedia");
const FormPopUpPontuar = document.getElementById("formPontuar");
const btnDownloadPDF = document.getElementById('downloadPDF');
const btnDownloadExcel = document.getElementById('downloadExcel');
const btnDownloadCSV = document.getElementById('downloadCSV');

//Funções para baixar tabela

function baixarTabelaPDF() {
    const { jsPDF } = window.jspdf; // Acesse jsPDF
    const doc = new jsPDF();
    doc.text("Tabela de Alunos", 10, 10);

    // Obtém a tabela HTML
    const tabela = document.querySelector('table');
    // Converte a tabela HTML para PDF
    doc.autoTable({ html: tabela }); // Gera o PDF com base na tabela

    doc.save('Tabela_de_Alunos.pdf'); // Salva o PDF
    fecharPopup(popupDownload); // Fecha o pop-up de download
    removerOverlay(); // Remove o overlay após o download
}

function baixarTabelaExcel() {
    const tabela = document.querySelector('table'); // Seleciona a tabela no DOM
    const linhas = Array.from(tabela.rows); // Obtém as linhas da tabela

    // Cria um array de arrays com os dados da tabela
    const dados = linhas.map(linha =>
        Array.from(linha.cells).map(celula => celula.textContent)
    );

    // Usa SheetJS para criar um arquivo XLSX
    const ws = XLSX.utils.aoa_to_sheet(dados); // Converte o array de arrays para uma planilha
    const wb = XLSX.utils.book_new(); // Cria um novo "livro" (workbook)
    XLSX.utils.book_append_sheet(wb, ws, "Tabela de Alunos"); // Adiciona a planilha ao livro

    // Gera e baixa o arquivo XLSX
    XLSX.writeFile(wb, "tabela_alunos.xlsx");
    fecharPopup(popupDownload); // Fecha o pop-up de download
    removerOverlay(); // Remove o overlay após o download
}

function baixarTabelaCSV() {
    const tabela = document.querySelector('table'); // Seleciona a tabela no HTML
    const linhas = Array.from(tabela.rows); // Obtém todas as linhas da tabela
    const dadosCSV = linhas.map(linha => {
        // Para cada linha, mapeia o texto das células separadas por vírgula
        return Array.from(linha.cells).map(celula => `"${celula.textContent}"`).join(',');
    }).join('\n');

    // Cria um blob com os dados CSV
    const blob = new Blob([dadosCSV], { type: 'text/csv' });

    // Cria o link para download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'tabela_alunos.csv';
    document.body.appendChild(link);

    link.click(); // Aciona o download
    document.body.removeChild(link); // Remove o link após o download
    fecharPopup(popupDownload); // Fecha o pop-up de download
    removerOverlay(); // Remove o overlay após o download
}

// Funcionamento do PopUp

// Função para abrir o pop-up de download
btnDownloadTabela.addEventListener('click', () => {
    abrirPopup(popupDownload); // Abre o pop-up de download
});

// Função para abrir o pop-up de limpar notas
function abrirPopupLimparNotas(index) {
    const aluno = ListaDeAlunos[index];

    // Mostra o pop-up
    const popup = document.getElementById("popupLimparNotas");
    popup.style.display = "block";

    // Adiciona os eventos de limpar notas
    document.getElementById("limparNotasAluno").onclick = () => {
        limparNotasAluno(aluno); // Passa o aluno selecionado
        fecharPopup(popup);
    };

    document.getElementById("limparTodasNotas").onclick = () => {
        limparTodasNotas();
        fecharPopup(popup);
    };
}

// Funções para criar e remover o overlay
let overlay;

function criarOverlay() {
    overlay = document.createElement('div');
    overlay.classList.add('popup-overlay');
    document.body.appendChild(overlay);
}

function removerOverlay() {
    if (overlay) {
        overlay.remove();
        overlay = null; // Zera a referência do overlay
    }
}

// Função para abrir o pop-up
function abrirPopup(popup) {
    // Cria o overlay se ele não existir
    if (!overlay) {
        criarOverlay();
    }
    popup.style.display = 'block';
    overlay.style.display = 'block'; // Exibe o overlay com o desfoque
}

// Eventos de clique para abrir os pop-ups
PopUpAddAluno.addEventListener('click', () => abrirPopup(popupTurma));
PopUpDefMedia.addEventListener('click', () => abrirPopup(popupMedia));

PopUpPontuar.addEventListener('click', () => {
    if (MediaDefinida === null || MediaDefinida === 0) {
        alert("É necessário definir uma média!");
    } else {
        atualizarDropdownAvaliacoes(); // Atualiza o dropdown antes de abrir o pop-up
        abrirPopup(popupPontuar);
    }
});

// Função para fechar o pop-up
function fecharPopup(popup) {
    popup.style.display = 'none';
    if (overlay) {
        overlay.style.display = 'none'; // Esconde o overlay
        removerOverlay(); // Remove o overlay da tela
    }
}

// Botões de fechar dentro dos pop-ups (selecionando pelo botão "X")
const FecharPopUp = document.querySelectorAll('.close, .fechar');

FecharPopUp.forEach(btn => {
    // Adicionando evento de clique em cada botão de fechar
    btn.addEventListener('click', () => {
        const popup = btn.closest('.popup');
        fecharPopup(popup);
    });
});

// Fecha o pop-up se clicar fora do conteúdo
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('popup')) {
        fecharPopup(e.target);
    }
});

// Funções para baixar a tabela em diferentes formatos
btnDownloadPDF.addEventListener('click', () => {
    baixarTabelaPDF();
});

btnDownloadExcel.addEventListener('click', () => {
    baixarTabelaExcel();
});

btnDownloadCSV.addEventListener('click', () => {
    baixarTabelaCSV();
});

// Fim do Funcionamento do PopUp

//Funções gerais

// Limpar as notas do aluno atual
function limparNotasAluno(aluno) {
    aluno.Avaliacoes = Array(QuantidadeAvaliacoes).fill(''); // Zera as notas das avaliações
    aluno.Recuperacao = ''; // Zera a nota de recuperação
    aluno.Media = '';
    aluno.Situacao = 'Reprovado';

    gerarTabelaAlunos(); // Atualiza a tabela
    //verificarAlunosNaTabela(); // Verifica se há alunos na tabela
}

// Limpar as notas de todos os alunos
function limparTodasNotas() {
    ListaDeAlunos.forEach(aluno => {
        aluno.Avaliacoes = Array(QuantidadeAvaliacoes).fill(''); // Zera as notas das avaliações
        aluno.Recuperacao = ''; // Zera a nota de recuperação
        aluno.Media = '';
        aluno.Situacao = 'Reprovado';
    });

    gerarTabelaAlunos(); // Atualiza a tabela
    //verificarAlunosNaTabela(); // Verifica se há alunos na tabela
}


// Recebe as pré-definições
/*FormPopUpDefMedia.addEventListener('submit', (e) => {
    e.preventDefault();

    const novaMediaDefinida = parseFloat(document.getElementById('inputMedia').value);
    const numeroDeAvaliacoes = parseInt(document.getElementById('inputNumAvaliacoes').value);
    const novaNotaRecuperacao = parseFloat(document.getElementById('notaRecuperacao').value);

    // Confirmação para alterar a média
    if (MediaDefinida !== null && novaMediaDefinida !== MediaDefinida) {
        const confirmacao = confirm(`A média atual é ${MediaDefinida}. Deseja alterar para ${novaMediaDefinida}?`);
        if (!confirmacao) {
            document.getElementById('inputMedia').value = MediaDefinida;
            return;
        }
    }

    // Confirmação para alterar a nota de recuperação (Evita confirmação se for a primeira vez)
    if (NotaRecuperacaoDefinida !== null && novaNotaRecuperacao !== NotaRecuperacaoDefinida) {
        const confirmacaoRecu = confirm(`A nota de recuperação atual é ${NotaRecuperacaoDefinida}. Deseja alterar para ${novaNotaRecuperacao}?`);
        if (!confirmacaoRecu) {
            document.getElementById('notaRecuperacao').value = NotaRecuperacaoDefinida;
            return;
        }
    } else if (NotaRecuperacaoDefinida === null) {
        // Se a nota de recuperação ainda não foi definida, não pede confirmação
        NotaRecuperacaoDefinida = novaNotaRecuperacao;
    }

    // Confirmação para redução do número de avaliações
    if (numeroDeAvaliacoes < QuantidadeAvaliacoes) {
        const confirmacaoReducao = confirm(`Você está reduzindo o número de avaliações de ${QuantidadeAvaliacoes} para ${numeroDeAvaliacoes}. Deseja continuar?`);
        if (!confirmacaoReducao) {
            document.getElementById('inputNumAvaliacoes').value = QuantidadeAvaliacoes;
            return;
        }
    }

    // Atualiza a média definida
    MediaDefinida = novaMediaDefinida;

    // Atualiza os títulos preservando os existentes
    if (numeroDeAvaliacoes > TitulosAvaliacoes.length) {
        // Adiciona novos títulos se o número de avaliações aumentar
        for (let i = TitulosAvaliacoes.length; i < numeroDeAvaliacoes; i++) {
            TitulosAvaliacoes.push(`Avaliação ${i + 1}`);
        }
    } else if (numeroDeAvaliacoes < TitulosAvaliacoes.length) {
        // Remove títulos extras se o número de avaliações diminuir
        TitulosAvaliacoes = TitulosAvaliacoes.slice(0, numeroDeAvaliacoes);
    }

    QuantidadeAvaliacoes = numeroDeAvaliacoes;

    // Alerta para o número de avaliações
    alert(`O número de avaliações foi definido como ${QuantidadeAvaliacoes}.`);

    // Atualiza a situação de todos os alunos
    for (let aluno of ListaDeAlunos) {
        // Ajusta o array de avaliações do aluno com base no novo número de avaliações
        if (aluno.Avaliacoes.length > QuantidadeAvaliacoes) {
            aluno.Avaliacoes = aluno.Avaliacoes.slice(0, QuantidadeAvaliacoes);
        } else {
            while (aluno.Avaliacoes.length < QuantidadeAvaliacoes) {
                aluno.Avaliacoes.push('');
            }
        }

        // Recalcula a média do aluno
        const mediaCalculada = aluno.Avaliacoes
            .filter(nota => nota !== "")
            .reduce((acc, val) => acc + parseFloat(val), 0) / aluno.Avaliacoes.length;
        aluno.Media = mediaCalculada.toFixed(2);

        // Atualiza a situação do aluno
        aluno.Situacao = mediaCalculada >= MediaDefinida ? "Aprovado" : "Reprovado";
    }

    alert(`A média foi definida com sucesso: ${MediaDefinida}.`);
    alert(`A nota de recuperação foi definida com sucesso: ${NotaRecuperacaoDefinida}.`);
    document.getElementById('inputMedia').value = MediaDefinida;
    document.getElementById('notaRecuperacao').value = NotaRecuperacaoDefinida;

    // Gera a tabela novamente com as novas configurações
    gerarTabelaAlunos();

    // Fecha o pop-up
    fecharPopup(popupMedia);
}); */

FormPopUpDefMedia.addEventListener('submit', async (e) => {
    console.log("Formulário enviado");
    e.preventDefault();

    // Captura os valores do formulário
    const inputMedia = document.getElementById('inputMedia').value;
    const inputNumAvaliacoes = document.getElementById('inputNumAvaliacoes').value;
    const inputNotaRecuperacao = document.getElementById('notaRecuperacao').value;

    // Validação dos campos
    if (!inputMedia || isNaN(parseFloat(inputMedia)) || parseFloat(inputMedia) < 0) {
        alert("Por favor, insira uma média válida e maior ou igual a 0.");
        return;
    }

    if (!inputNumAvaliacoes || isNaN(parseInt(inputNumAvaliacoes)) || parseInt(inputNumAvaliacoes) < 0) {
        alert("Por favor, insira um número válido de avaliações e maior ou igual a 0.");
        return;
    }

    if (!inputNotaRecuperacao || isNaN(parseFloat(inputNotaRecuperacao)) || parseFloat(inputNotaRecuperacao) < 0) {
        alert("Por favor, insira uma nota válida para recuperação e maior ou igual a 0.");
        return;
    }

    const novaMediaDefinida = parseFloat(inputMedia);
    const numeroDeAvaliacoes = parseInt(inputNumAvaliacoes);
    const novaNotaRecuperacao = parseFloat(inputNotaRecuperacao);

    // Verifica o ID da turma
    const urlParams = new URLSearchParams(window.location.search);
    const turmaId = urlParams.get('id');

    if (!turmaId) {
        console.error('ID da turma não encontrado!');
        alert("Erro: ID da turma não encontrado.");
        return;
    }

    try {
        // Confirmar antes de enviar
        const confirmacao = confirm(
            `Você está prestes a salvar as seguintes configurações:\n\n` +
            `Média: ${novaMediaDefinida}\n` +
            `Número de Avaliações: ${numeroDeAvaliacoes}\n` +
            `Nota de Recuperação: ${novaNotaRecuperacao}\n\n` +
            `Deseja continuar?`
        );

        if (!confirmacao) {
            alert("Alterações canceladas pelo usuário.");
            return;
        }

        const response = await fetch('http://localhost:3000/definirMedia', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                turmaId,
                novaMedia: novaMediaDefinida,
                numeroDeAvaliacoes: numeroDeAvaliacoes,
                notaRecuperacao: novaNotaRecuperacao,
            }),
        });

        // Logando os dados antes de enviar
        console.log('Enviando dados para o backend:', {
            turmaId,
            novaMedia: novaMediaDefinida,
            numeroDeAvaliacoes: numeroDeAvaliacoes,
            notaRecuperacao: novaNotaRecuperacao,
        });

        const responseData = await response.json();
        console.log('Resposta do backend:', responseData);

        if (!response.ok) {
            alert('Erro ao salvar pré-definições: ' + responseData.message);
        } else {
            alert('Pré-definições salvas com sucesso.');
        }
    } catch (error) {
        console.error('Erro ao enviar dados!', error);
        alert('Erro ao salvar pré-definições, tente novamente mais tarde.');
    }

    // Fecha o pop-up
    fecharPopup(popupMedia);
});






// Função para buscar os alunos da turma no backend e gerar a tabela
async function buscarAlunosDaTurma() {
    const urlParams = new URLSearchParams(window.location.search);
    const turmaId = urlParams.get("id"); // Captura o ID da turma da URL

    if (!turmaId) {
        alert("ID da turma não encontrado na URL.");
        console.error("ID da turma não encontrado.");
        return;
    }

    try {
        console.log(`Buscando alunos da turma com ID: ${turmaId}`);
        // Realiza a requisição GET para buscar os alunos da turma e o número de avaliações
        const response = await fetch(`http://localhost:3000/turmas/${turmaId}/alunos`);

        if (response.ok) {
            const { alunos, qtd_avaliacoes } = await response.json();
            console.log("Dados recebidos:", alunos, qtd_avaliacoes);

            // Verifica se há alunos retornados
            if (alunos.length > 0) {
                gerarTabelaAlunos(alunos, qtd_avaliacoes); // Chama a função de geração da tabela
            } else {
                alert('Nenhum aluno encontrado para essa turma.');
                console.warn('Nenhum aluno encontrado.');
            }
        } else {
            const error = await response.json();
            alert("Erro ao buscar alunos: " + error.message);
            console.error("Erro ao buscar alunos:", error.message);
        }
    } catch (error) {
        console.error('Erro ao buscar alunos:', error);
        alert('Erro ao buscar alunos, tente novamente mais tarde.');
    }
}

// Função para gerar a tabela com os dados dos alunos
function gerarTabelaAlunos(alunos, qtd_avaliacoes) {
    const tabela = document.querySelector("table");

    // Limpa o conteúdo atual da tabela
    tabela.innerHTML = "";

    // Cria o cabeçalho da tabela dinamicamente
    const cabecalho = document.createElement("tr");
    let cabecalhoHTML = `<th>Nome do Aluno</th>`;

    // Adiciona os títulos das avaliações ao cabeçalho
    for (let i = 0; i < qtd_avaliacoes; i++) {
        cabecalhoHTML += `<th>Avaliação ${i + 1}</th>`;
    }

    // Adiciona os títulos fixos (Média, Recuperação, Situação, Ações)
    cabecalhoHTML += `
        <th>Média</th>
        <th>Recuperação</th>
        <th>Situação</th>
        <th>Ações</th>
    `;
    cabecalho.innerHTML = cabecalhoHTML;
    tabela.appendChild(cabecalho);

    // Ordena os alunos por nome
    alunos.sort((a, b) => a.nome.localeCompare(b.nome));

    // Adiciona cada aluno na tabela
    alunos.forEach((aluno, index) => {
        const linha = document.createElement("tr");
        let linhaHTML = `<td class="selecao">
            <span class="nome-aluno">${aluno.nome}</span>
        </td>`;

        // Adiciona as avaliações do aluno dinamicamente
        for (let i = 0; i < qtd_avaliacoes; i++) {
            const nota = aluno.boletim.nota && aluno.boletim.nota[i] ? aluno.boletim.nota[i].valor : '';
            linhaHTML += `<td class="selecao" contenteditable="true" data-avaliacao="${i + 1}">
                ${nota}
            </td>`;
        }

        // Adiciona os campos fixos (Média, Recuperação, Situação, Ações)
        const recuperacao = aluno.boletim.recuperacao !== undefined && aluno.boletim.recuperacao !== "" ? aluno.boletim.recuperacao : '';
        linhaHTML += `
            <td>${aluno.boletim.media}</td>
            <td class="selecao" contenteditable="true" data-recuperacao="true">${recuperacao}</td>
            <td>${aluno.boletim.situacao}</td>
            <td>
                <button class="btn-excluir" data-index="${index}" title="Excluir">
                    <i class="fas fa-trash-alt"></i>
                </button>
                <button class="btn-limpar" data-index="${index}" title="Limpar Notas">
                    <i class="fas fa-broom"></i>
                </button>
            </td>
        `;
        linha.innerHTML = linhaHTML;
        tabela.appendChild(linha);
    });
}




// Chama a função de buscar alunos ao carregar a página
window.onload = buscarAlunosDaTurma;


    // Adiciona evento de clique para excluir o aluno
    document.querySelectorAll('.btn-excluir').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.closest('button').getAttribute('data-index');
            excluirAluno(index);
        });
    });

    // Adiciona evento de clique para abrir o pop-up de limpeza de notas
    document.querySelectorAll('.btn-limpar').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.closest('button').getAttribute('data-index');
            abrirPopupLimparNotas(index);
        });
    });



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

function atualizarTabelaAlunos(alunos) {
    if (!Array.isArray(alunos)) {
        console.error('Dados inesperados recebidos do backend:', alunos);
        alert('Erro ao atualizar a tabela. Dados inválidos.');
        return;
    }

    ListaDeAlunos = alunos.map((aluno) => new Estudante(aluno.nome)); // Atualiza a lista local
    ListaDeAlunos.sort((a, b) => a.Nome.localeCompare(b.Nome)); // Ordena por nome
    gerarTabelaAlunos(); // Chama a função para renderizar
}

// Função para adição de alunos
FormPopUpAddAluno.addEventListener("submit", async (e) => {
    e.preventDefault(); // Impede o comportamento padrão de envio do formulário

    // Obtém o valor do campo de texto do formulário de cadastro de novos alunos
    const nomesAlunos = document.getElementById("inputNomesTurma").value;

    // Trata os dados dos alunos
    const nomesTratados = TratamentoDeDados(nomesAlunos);

    if (nomesTratados.length === 0) {
        alert("Nenhum nome válido foi encontrado!");
        return;
    }

    try {
        // Obtém o ID da turma da URL
        const urlParams = new URLSearchParams(window.location.search);
        const turmaId = urlParams.get("id");

        if (!turmaId) {
            alert("ID da turma não encontrado na URL.");
            return;
        }

        console.log("Enviando dados para o backend:", { nomes: nomesTratados, turmaId });

        // Envia os dados ao backend
        const response = await fetch("http://localhost:3000/alunos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nomes: nomesTratados, turmaId }),
        });

        if (response.ok) {
            // Atualiza os dados recebidos do backend
            const alunosAtualizados = await response.json();
            console.log("Resposta do backend:", alunosAtualizados);

            // Fecha o pop-up
            const popup = document.getElementById("popupTurma");
            if (popup) {
                fecharPopup(popup);
            } else {
                console.error("Pop-up não encontrado para fechamento.");
            }

            // Recarrega a página imediatamente
            window.location.reload();

            alert("Alunos cadastrados com sucesso!");
        } else {
            const error = await response.json();
            alert("Erro ao cadastrar alunos: " + error.message);
        }
    } catch (error) {
        console.error("Erro ao cadastrar alunos:", error);
        alert("Erro ao salvar alunos, tente novamente mais tarde.");
    }
});



PopUpPontuar.addEventListener('click', () => {
    if (MediaDefinida === null || MediaDefinida === 0) {
        alert("É necessário definir uma média!");
    } else {
        abrirPopup(popupPontuar);
    }
});

// Controla as avaliações que aparecem na lista de pontuação em grupo
function atualizarDropdownAvaliacoes() {
    const dropdown = document.getElementById('avaliacoesDropdown');
    dropdown.innerHTML = ''; // Limpa o conteúdo atual

    TitulosAvaliacoes.forEach((titulo, index) => {
        const option = document.createElement('option');
        option.value = index; // Índice da avaliação
        option.textContent = titulo; // Nome da avaliação
        dropdown.appendChild(option);
    });
};

// Função para preencher o dropdown de alunos
function preencherDropdownAlunos() {
    const alunosDropdown = document.getElementById('alunosDropdown');
    alunosDropdown.innerHTML = ''; // Limpa as opções existentes

    // Adiciona a lista de alunos no dropdown
    ListaDeAlunos.forEach(aluno => {
        const option = document.createElement('option');
        option.value = aluno.Nome;
        option.textContent = aluno.Nome;
        alunosDropdown.appendChild(option);
    });
}

// Chama a função para preencher o dropdown ao abrir o pop-up
preencherDropdownAlunos();


// Função de pontuação de alunos em grupo
FormPopUpPontuar.addEventListener("submit", (e) => {
    e.preventDefault(); // Evita o comportamento padrão de envio do formulário

    // Captura os valores do pop-up
    const alunosSelecionados = Array.from(document.getElementById('alunosDropdown').selectedOptions).map(option => option.value); // Captura todos os alunos selecionados
    let nota = document.getElementById('NotaAluno').value.trim(); // Campo de nota (ainda como string)
    const avaliacaoSelecionadaIndex = document.getElementById('avaliacoesDropdown').value; // Valor do índice selecionado no drop-down

    // Substitui a vírgula por ponto para garantir a consistência
    nota = nota.replace(',', '.');

    // Validação dos campos
    if (alunosSelecionados.length === 0) {
        alert("Por favor, selecione pelo menos um aluno.");
        return;
    }

    if (!nota || isNaN(nota) || parseFloat(nota) < 0 || parseFloat(nota) > 10) {
        alert("Por favor, insira uma nota válida entre 0 e 10.");
        return;
    }

    if (avaliacaoSelecionadaIndex === "") {
        alert("Por favor, selecione uma avaliação.");
        return;
    }

    // Trata os dados dos alunos
    alunosSelecionados.forEach(nomeAluno => {
        const aluno = ListaDeAlunos.find(a => a.Nome === nomeAluno);

        if (!aluno) {
            alert(`Aluno ${nomeAluno} não encontrado.`);
            return;
        }

        // Verifica se a nota já foi lançada e pede confirmação
        const notaExistente = aluno.Avaliacoes[avaliacaoSelecionadaIndex];

        // Modificação: Verifica se a nota existente é uma string vazia, null ou undefined
        let alteracaoConfirmada = true; // Variável para controle de sobrescrição de notas
        if (notaExistente !== "" && notaExistente !== null && notaExistente !== undefined) {
            alteracaoConfirmada = confirm(`O aluno ${nomeAluno} já possui uma nota para ${TitulosAvaliacoes[avaliacaoSelecionadaIndex]} (${notaExistente}). Deseja sobrescrevê-la?`);
        }

        if (!alteracaoConfirmada) return; // Caso o professor cancele a confirmação, interrompe o processo

        // Atribui a nota à avaliação correspondente
        aluno.Avaliacoes[avaliacaoSelecionadaIndex] = parseFloat(nota);

        // Calcula a média do aluno
        const totalNotas = aluno.Avaliacoes.reduce((acc, val) => acc + (val || 0), 0);
        const quantidadeNotas = aluno.Avaliacoes.filter(n => n !== undefined && n !== null).length;
        aluno.Media = (totalNotas / quantidadeNotas).toFixed(2);

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



// Função para verificar se há alunos na tabela e ativar/desativar botões
/*function verificarAlunosNaTabela() {
    const tabela = document.querySelector('table');
    const numeroDeAlunos = ListaDeAlunos.length; // Usa ListaDeAlunos para contar o número de alunos

    // Seleciona os botões do menu que precisam ser restritos
    const botoesRestritos = [
        document.getElementById('PopUpDefMedia'),
        document.getElementById('PopUpPontuar'),
        document.getElementById('PopUpDownloadTabela')
    ];

    // Habilita ou desabilita os botões conforme o número de alunos
    botoesRestritos.forEach(botao => {
        if (numeroDeAlunos > 0) {
            botao.disabled = false;
            botao.classList.remove('btn-desativado'); // Remove o estilo de desativado
        } else {
            botao.disabled = true;
            botao.classList.add('btn-desativado'); // Adiciona o estilo de desativado
        }
    });

    // Verifica se todos os alunos possuem o número correto de avaliações
    const botaoPontuar = document.getElementById('PopUpPontuar');
    const todasAvaliacoesDefinidas = ListaDeAlunos.every(aluno => aluno.Avaliacoes.length === QuantidadeAvaliacoes); // Verifica se todos os alunos têm o número correto de avaliações

    if (todasAvaliacoesDefinidas) {
        botaoPontuar.disabled = false;
        botaoPontuar.classList.remove('btn-desativado');
    } else {
        botaoPontuar.disabled = true;
        botaoPontuar.classList.add('btn-desativado');
    }
}*/

//Função da edição nas células
function ativarEdicaoNota() {
    const tabela = document.querySelector('table');

    tabela.addEventListener('click', (event) => {
        const celula = event.target;
        const linha = celula.closest('tr');

        // Editar nome de aluno
        /*  if (linha && linha.rowIndex > 0 && celula.cellIndex === 0) {
              const nomeAluno = linha.cells[0].textContent.trim();
              const aluno = ListaDeAlunos.find(a => a.Nome === nomeAluno);
  
              if (celula.querySelector('input')) return;
  
              const input = document.createElement('input');
              input.type = 'text';
              input.value = nomeAluno;
              input.style.width = '100%';
  
              celula.textContent = '';
              celula.appendChild(input);
              input.select();
  
              input.addEventListener('blur', () => {
                  let novoNome = input.value.trim();
                  if (novoNome !== '') {
                      celula.textContent = novoNome;
                      aluno.Nome = novoNome; // Atualiza o nome do aluno na lista
                  } else {
                      celula.textContent = nomeAluno; // Restaura o nome original caso o campo esteja vazio
                      alert('O nome não pode ser vazio.');
                  }
              });
  
              input.addEventListener('keydown', (e) => {
                  if (e.key === 'Enter') {
                      input.blur();
                  }
              });
  
              return;
          }*/

        // Editar títulos das avaliações
        if (linha && linha.rowIndex === 0 && celula.cellIndex >= 1 && celula.cellIndex <= QuantidadeAvaliacoes) {
            const tituloAtual = celula.textContent.trim();

            if (celula.querySelector('input')) return;

            const input = document.createElement('input');
            input.type = 'text';
            input.value = tituloAtual;
            input.style.width = '100%';

            celula.textContent = '';
            celula.appendChild(input);
            input.select();

            input.addEventListener('blur', () => {
                let novoTitulo = input.value.trim();
                if (novoTitulo !== '') {
                    celula.textContent = novoTitulo;
                    TitulosAvaliacoes[celula.cellIndex - 1] = novoTitulo; // Atualiza o título da avaliação
                } else {
                    celula.textContent = tituloAtual; // Restaura o título original caso o campo esteja vazio
                    alert('O título não pode ser vazio.');
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    input.blur();
                }
            });

            return;
        }

        // Editar notas
        if (linha && linha.rowIndex > 0 && celula.cellIndex >= 1 && celula.cellIndex <= QuantidadeAvaliacoes) {
            if (MediaDefinida === null || MediaDefinida === undefined) {
                alert("Configure as pré-definições antes de adicionar notas!");
                return;
            }

            const nomeAluno = linha.cells[0].textContent.trim();
            const aluno = ListaDeAlunos.find(a => a.Nome === nomeAluno);
            const valorAtual = celula.textContent.trim();

            if (celula.querySelector('input')) return;

            const input = document.createElement('input');
            input.type = 'text';
            input.value = valorAtual;
            input.style.width = '100%';

            celula.textContent = '';
            celula.appendChild(input);
            input.select();

            input.addEventListener('blur', () => {
                let novoValor = input.value.trim();
                novoValor = novoValor.replace(',', '.');

                if (!isNaN(novoValor) && novoValor !== '' && novoValor >= 0 && novoValor <= 10) {
                    celula.textContent = novoValor;
                    aluno.Avaliacoes[celula.cellIndex - 1] = parseFloat(novoValor);
                    aluno.calcularMedia(); // Método da classe Estudante
                    aluno.atualizarSituacao(MediaDefinida); // Atualiza a situação com a média definida globalmente
                    // Atualiza apenas as colunas relacionadas (Média, Situação)
                    const linha = celula.closest('tr');
                    linha.cells[QuantidadeAvaliacoes + 1].textContent = aluno.Media; // Atualiza Média
                    linha.cells[QuantidadeAvaliacoes + 3].textContent = aluno.Situacao; // Atualiza Situação
                } else {
                    celula.textContent = valorAtual;
                    alert('Por favor, insira uma nota válida entre 0 e 10.');
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    input.blur();
                }
            });

            return;
        }

        // Editar recuperação
        if (linha && linha.rowIndex > 0 && celula.cellIndex === QuantidadeAvaliacoes + 2) {
            // Verifica se as predefinições estão configuradas antes de permitir a edição
            if (NotaRecuperacaoDefinida === null || NotaRecuperacaoDefinida === undefined) {
                alert("Configure as pré-definições antes de adicionar a nota de recuperação!");
                return;
            }

            const nomeAluno = linha.cells[0].textContent.trim();
            const aluno = ListaDeAlunos.find(a => a.Nome === nomeAluno);

            // Só permite editar se o aluno estiver em recuperação (situação "Reprovado")
            if (aluno.Situacao !== "Reprovado") {
                alert("A edição da recuperação só é permitida para alunos em recuperação.");
                return;
            }

            const valorAtual = celula.textContent.trim();

            if (celula.querySelector('input')) return;

            const input = document.createElement('input');
            input.type = 'text';
            input.value = valorAtual;
            input.style.width = '100%';

            celula.textContent = '';
            celula.appendChild(input);
            input.select();

            input.addEventListener('blur', () => {
                let novoValor = input.value.trim();
                novoValor = novoValor.replace(',', '.');

                if (!isNaN(novoValor) && novoValor !== '' && novoValor >= 0 && novoValor <= 10) {
                    celula.textContent = novoValor;
                    aluno.Recuperacao = parseFloat(novoValor); // Atualiza a nota de recuperação
                    aluno.Media = calcularMedia(aluno.Avaliacoes.concat(aluno.Recuperacao)); // Recalcula a média incluindo recuperação

                    // Atualiza a situação com base na recuperação
                    if (aluno.Recuperacao >= NotaRecuperacaoDefinida) {
                        aluno.Situacao = "Aprovado";
                    } else {
                        aluno.Situacao = "Reprovado";
                    }

                    // Atualiza apenas as colunas necessárias na linha do aluno
                    const linha = celula.closest('tr');
                    linha.cells[QuantidadeAvaliacoes + 1].textContent = aluno.Media; // Atualiza a célula da média
                    linha.cells[QuantidadeAvaliacoes + 3].textContent = aluno.Situacao; // Atualiza a célula da situação
                } else {
                    celula.textContent = valorAtual; // Restaura o valor anterior em caso de entrada inválida
                    alert('Por favor, insira uma nota válida entre 0 e 10.');
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    input.blur();
                }
            });

            return;
        }


    });
}


// Função auxiliar para calcular a média de um aluno
function calcularMedia(avaliacoes) {
    const notasValidas = avaliacoes.filter(nota => !isNaN(nota));
    return (notasValidas.reduce((acc, val) => acc + val, 0) / notasValidas.length).toFixed(2);
}


ativarEdicaoNota();


// Executa a função ao carregar a página para desativar os botões inicialmente
//window.addEventListener('load', verificarAlunosNaTabela);

// Atualiza a verificação toda vez que um aluno é adicionado
document.getElementById('CadastrarAlunos').addEventListener('submit', function (event) {
    event.preventDefault(); // Previne o comportamento padrão de envio de formulário

    // Verifica novamente se há alunos na tabela
    //verificarAlunosNaTabela();
});
