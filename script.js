/*=========================================================
    HOUSEKEEPING MANAGEMENT SYSTEM v4.0
    TERMINAL TOEX

    Desenvolvido em:
    HTML5
    CSS3
    JavaScript ES6+

=========================================================*/


/*=========================================================
    CONFIGURAÇÕES GLOBAIS
=========================================================*/

"use strict";


const CONFIG = {

    sistema: "HOUSEKEEPING TOEX",

    versao: "4.0",

    atualizarRelogio: 60000,

    progressoMaximo: 100

};



/*=========================================================
    ESTADO GLOBAL DA APLICAÇÃO
=========================================================*/

const state = {

    atividades: [],

    atividadesFiltradas: [],

    atividadeSelecionada: null,

    atividadeEditando: null,

    fotosTemporarias: [],

    charts: {},

    firebaseInicializado: false,

    carregando: false,

    mostrarHistorico: false,

    elementos: {}

};


// <-- NOVA FUNÇÃO AQUI

function obterLista() {

    if (state.atividadesFiltradas.length > 0) {

        return state.atividadesFiltradas;

    }

    return state.atividades;

}

function aplicarFiltros() {

    let lista = [...state.atividades];

    const dataInicio = document.getElementById("dataInicio")?.value;
    const dataFim = document.getElementById("dataFim")?.value;

    if (dataInicio && dataFim) {

        lista = lista.filter((atividade) => {

            const dataComparacao =
                atividade.status === "Concluído"
                    ? atividade.dataConclusao
                    : atividade.inicio;

            if (!dataComparacao) return false;

            return (
                dataComparacao >= dataInicio &&
                dataComparacao <= dataFim
            );

        });

    }

    state.atividadesFiltradas = lista;

}


// ======================================
// VERIFICA SE O USUÁRIO ESTÁ LOGADO
// ======================================

const usuarioLogado = sessionStorage.getItem("usuarioLogado");

if (!usuarioLogado) {

    window.location.replace("login.html");

}


/*=========================================================
    CACHE DOS ELEMENTOS HTML
=========================================================*/

function cacheDOM() {

    state.elementos = {

        // HEADER

        dataHora: document.getElementById("dataHora"),


        // BOTÕES

        btnNova: document.querySelector(".btn-nova"),

        btnPDF: document.getElementById("btnPDF"),

        btnImprimir: document.querySelector(".btn-imprimir"),

        btnHistorico: document.getElementById("btnHistorico"),

        btnAplicar: document.getElementById("btnAplicar"),


        // MODAL

        modal: document.getElementById("modalNovaAtividade"),

        fecharModal: document.getElementById("fecharModal"),

        cancelarModal: document.getElementById("cancelarModal"),

        salvarAtividade: document.getElementById("salvarAtividade"),


        // CAMPOS


        area: document.getElementById("area"),

        atividade: document.getElementById("atividade"),

        encarregado: document.getElementById("encarregado"),

        colaborador: document.getElementById("colaborador"),

        prioridade: document.getElementById("prioridade"),

        status: document.getElementById("status"),

        inicio: document.getElementById("inicio"),

        prazo: document.getElementById("prazo"),

        progresso: document.getElementById("progresso"),

        foto: document.getElementById("foto"),




        // TABELA

        tabela: document.getElementById("tabelaAtividades"),


        // GRÁFICOS

        graficoStatus:

            document.getElementById("graficoStatus"),

        graficoArea:

            document.getElementById("graficoArea"),

        graficoColaborador:

            document.getElementById("graficoColaborador"),

        graficoCriticidade:

            document.getElementById("graficoCriticidade")

    };

}

/*=========================================================
    USUÁRIO LOGADO
=========================================================*/

function carregarUsuarioLogado() {

    const usuario = JSON.parse(sessionStorage.getItem("usuarioLogado"));

    if (!usuario) return;

    document.getElementById("nomeUsuario").textContent = usuario.nome;
    document.getElementById("perfilUsuario").textContent = usuario.perfil;

}



/*=========================================================
    UTILITÁRIOS
=========================================================*/

function gerarID() {

    return Date.now();

}


function formatarNumero(numero) {

    return Number(numero).toLocaleString("pt-BR");

}


function formatarData(data) {

    if (!data) return "";

    const [ano, mes, dia] = data.split("-");

    return `${dia}/${mes}/${ano}`;

}


function formatarHora() {

    return new Date().toLocaleTimeString("pt-BR", {

        hour: "2-digit",

        minute: "2-digit"

    });

}




/*=========================================================
    MENSAGENS
=========================================================*/

function mostrarMensagem(texto) {

    console.log(

        `[HOUSEKEEPING] ${texto}`

    );

}

/*=========================================================
    INICIALIZAÇÃO DO SISTEMA
=========================================================*/

document.addEventListener("DOMContentLoaded", iniciarSistema);

function iniciarSistema() {

    mostrarMensagem("Inicializando sistema...");

    cacheDOM();

    configurarEventos();

    carregarUsuarioLogado();

    atualizarDataHora();

    setInterval(

        atualizarDataHora, 1000);

    carregarAtividades();

    //inicializarDashboard();

    renderizarSistema();

    mostrarMensagem("Sistema iniciado com sucesso.");

}



/*=========================================================
    EVENTOS
=========================================================*/

function configurarEventos() {

    const el = state.elementos;

    // NOVA ATIVIDADE

    el.btnNova?.addEventListener(

        "click",

        abrirModal

    );



    // FECHAR MODAL

    el.fecharModal?.addEventListener(

        "click",

        fecharModal

    );

    el.cancelarModal?.addEventListener(

        "click",

        fecharModal

    );


    // SALVAR

    el.salvarAtividade?.addEventListener(

        "click",

        salvarNovaAtividade

    );


    // EXPORTAR PDF

    el.btnPDF?.addEventListener(

        "click",

        exportarPDF

    );


    // IMPRIMIR

    el.btnImprimir?.addEventListener(

        "click",

        imprimirSistema

    );

    el.btnHistorico?.addEventListener(
        "click",
        alternarHistorico
    );

    el.btnAplicar?.addEventListener(
        "click",
        filtrarPeriodo
    );




}









function fecharModal() {

    state.elementos.modal.classList.remove("active");

}



function limparFormulario() {

    const el = state.elementos;



    el.area.value = "";

    el.atividade.value = "";

    // Encarregado fixo
    el.encarregado.value = "Rayan Cardoso";

    el.colaborador.value = "";

    el.prioridade.value = "Baixa";

    el.status.value = "Pendente";

    el.inicio.value = "";

    el.prazo.value = "";

    el.progresso.value = 0;

    el.foto.value = "";



}



/*=========================================================
    VALIDAÇÃO
=========================================================*/

function validarFormulario() {

    const el = state.elementos;



    if (el.area.value === "") {

        alert("Selecione a Área.");

        return false;

    }

    if (el.atividade.value.trim() === "") {

        alert("Informe a atividade.");

        return false;

    }

    if (el.encarregado.value === "") {

        alert("Selecione o Encarregado.");

        return false;

    }

    if (el.colaborador.value === "") {

        alert("Selecione o Colaborador.");

        return false;

    }

    return true;

}



/*=========================================================
    CARREGAMENTO DOS DADOS
=========================================================*/

function carregarAtividades() {

    state.atividades = [];

}



/*=========================================================
    RENDERIZAÇÃO PRINCIPAL
=========================================================*/

function renderizarSistema() {

    atualizarKPIs();

    renderizarTabela();

    atualizarGraficos();

}

function alternarHistorico() {

    state.mostrarHistorico = !state.mostrarHistorico;

    const titulo = document.getElementById("tituloTabela");
    const botao = document.getElementById("btnHistorico");

    if (state.mostrarHistorico) {

        titulo.textContent = "Histórico de Atividades";

        botao.innerHTML =
            '<i class="fa-solid fa-arrow-left"></i> Voltar';

    } else {

        titulo.textContent =
            "Lista Operacional de Atividades";

        botao.innerHTML =
            '<i class="fa-solid fa-clock-rotate-left"></i> Histórico';

    }

    renderizarTabela();

}

/*=========================================================
    SALVAR NOVA ATIVIDADE
=========================================================*/

function salvarNovaAtividade() {

    if (!validarFormulario()) return;

    const el = state.elementos;


    const atividade = {
        id: gerarID(),

        area: el.area.value,
        atividade: el.atividade.value.trim(),
        encarregado: el.encarregado.value,
        colaborador: el.colaborador.value,
        prioridade: el.prioridade.value,
        status: el.status.value,
        inicio: el.inicio.value,
        prazo: el.prazo.value,
        progresso: Number(el.progresso.value),

        fotos: [],

        dataConclusao: null,
        horaConclusao: null,
        concluidoPor: null
    };

    // Se a atividade foi concluída
    if (atividade.status === "Concluído") {

        const agora = new Date();

        atividade.dataConclusao = agora.toISOString().split("T")[0];

        atividade.horaConclusao = agora.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        });

        atividade.concluidoPor = "Rayan Cardoso";
    }


    if (state.atividadeEditando !== null) {

        atividade.id = state.atividadeEditando;

        const indice = state.atividades.findIndex(
            item => item.id === state.atividadeEditando
        );

        if (indice !== -1) {

            const antiga = state.atividades[indice];

            // Mantém as fotos existentes
            atividade.fotos = antiga.fotos || [];

            // Se já estava concluída anteriormente,
            // mantém os dados da conclusão
            if (antiga.dataConclusao) {

                atividade.dataConclusao = antiga.dataConclusao;
                atividade.horaConclusao = antiga.horaConclusao;
                atividade.concluidoPor = antiga.concluidoPor;

            }

            // Se acabou de ser concluída agora,
            // registra a conclusão
            if (
                atividade.status === "Concluído" &&
                !atividade.dataConclusao
            ) {

                const agora = new Date();

                atividade.dataConclusao =
                    agora.toISOString().split("T")[0];

                atividade.horaConclusao =
                    agora.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit"
                    });

                atividade.concluidoPor = "Rayan Cardoso";

            }

            state.atividades[indice] = atividade;

        }

    } else {

        state.atividades.push(atividade);

    }


    fecharModal();

    renderizarSistema();

}

/*=========================================================
    RENDERIZAR TABELA
=========================================================*/

function renderizarTabela() {

    const tbody = state.elementos.tabela;

    if (!tbody) return;

    tbody.innerHTML = "";

    const atividades = obterLista();

    if (atividades.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="11" class="sem-registros">
                    Nenhuma atividade encontrada.
                </td>
            </tr>
        `;

        return;
    }

    const lista = state.mostrarHistorico
        ? atividades.filter(a => a.status === "Concluído")
        : atividades.filter(a => a.status !== "Concluído");

    lista.forEach((atividade) => {

        const tr = document.createElement("tr");

        tr.innerHTML = `

            <td>${atividade.id}</td>

            <td>${atividade.area}</td>

            <td>${atividade.atividade}</td>

            <td>${atividade.encarregado}</td>

            <td>${atividade.colaborador}</td>

            <td>
                ${criarBadgePrioridade(atividade.prioridade)}
            </td>

            <td>
                ${criarBadgeStatus(atividade.status)}
            </td>

            <td>${formatarData(atividade.inicio)}</td>

            <td>${formatarData(atividade.prazo)}</td>

            <td>${atividade.progresso}%</td>

            <td>
                <div class="acoes-tabela">

                    <button
                        class="btn-acao duplicar"
                        onclick="duplicarAtividade(${atividade.id})"
                        title="Duplicar">
                        <i class="fa-solid fa-copy"></i>
                    </button>

                    <button
                        class="btn-acao editar"
                        onclick="editarAtividade(${atividade.id})"
                        title="Editar">
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button
                        class="btn-acao excluir"
                        onclick="excluirAtividade(${atividade.id})"
                        title="Excluir">
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>
            </td>

        `;

        tbody.appendChild(tr);

    });

}


/*=========================================================
    BADGE PRIORIDADE
=========================================================*/

function criarBadgePrioridade(prioridade) {

    return `
        <span class="badge prioridade ${prioridade.toLowerCase()}">
            ${prioridade}
        </span>
    `;

}



/*=========================================================
    BADGE STATUS
=========================================================*/

function criarBadgeStatus(status) {

    const classe = status
        .toLowerCase()
        .replace(/\s/g, "-");

    return `
        <span class="badge status ${classe}">
            ${status}
        </span>
    `;

}

/*=========================================================
    EDITAR ATIVIDADE
=========================================================*/

function editarAtividade(id) {

    const atividade = state.atividades.find(

        item => item.id === id

    );

    if (!atividade) return;

    state.atividadeEditando = id;

    const el = state.elementos;

    el.area.value = atividade.area;

    el.atividade.value = atividade.atividade;

    el.encarregado.value = atividade.encarregado;

    el.colaborador.value = atividade.colaborador;

    el.prioridade.value = atividade.prioridade;

    el.status.value = atividade.status;

    el.inicio.value = atividade.inicio;

    el.prazo.value = atividade.prazo;

    el.progresso.value = atividade.progresso;



    abrirModal(false);

}

/*=========================================================
    DUPLICAR ATIVIDADE
=========================================================*/

function duplicarAtividade(id) {

    const atividade = state.atividades.find(
        item => item.id === id
    );

    if (!atividade) return;

    const el = state.elementos;

    // Será uma nova atividade
    state.atividadeEditando = null;

    // Abre o modal sem limpar os campos
    abrirModal(false);

    // Copia os dados principais
    el.area.value = atividade.area;
    el.atividade.value = atividade.atividade;
    el.encarregado.value = atividade.encarregado;
    el.colaborador.value = atividade.colaborador;
    el.prioridade.value = atividade.prioridade;

    // Copia também os demais dados da atividade
    el.status.value = atividade.status;
    el.inicio.value = atividade.inicio;
    el.prazo.value = atividade.prazo;
    el.progresso.value = atividade.progresso;

    // Não duplica fotos
    el.foto.value = "";
    state.fotosTemporarias = [];

    // Coloca o cursor na atividade
    setTimeout(() => {
        el.atividade.focus();
        el.atividade.select();
    }, 100);

}

/*=========================================================
 MODAL
=========================================================*/

function abrirModal(limpar = true) {

    if (limpar) {

        limparFormulario();

        state.atividadeEditando = null;

    }

    state.elementos.modal.classList.add("active");

}



/*=========================================================
    EXCLUIR ATIVIDADE
=========================================================*/

function excluirAtividade(id) {

    const atividade = state.atividades.find(

        item => item.id === id

    );

    if (!atividade) return;

    const confirmar = confirm(

        `Deseja realmente excluir a atividade:\n\n${atividade.atividade}?`

    );

    if (!confirmar) return;

    state.atividades = state.atividades.filter(

        item => item.id !== id

    );

    renderizarSistema();

}



/*=========================================================
    DUPLO CLIQUE NA LINHA
=========================================================*/

function selecionarAtividade(id) {

    state.atividadeSelecionada = id;

}

/*=========================================================
    ATUALIZAR KPIs
=========================================================*/

function atualizarKPIs() {

    const atividades = obterLista();

    const total = atividades.length;

    const concluidas = atividades.filter(
        item => item.status === "Concluído"
    ).length;

    const andamento = atividades.filter(
        item => item.status === "Em andamento"
    ).length;

    const pendentes = atividades.filter(
        item => item.status === "Pendente"
    ).length;

    const atrasadas = atividades.filter(
        item => item.status === "Atrasado"
    ).length;

    const percentual = total === 0
        ? 0
        : Math.round((concluidas / total) * 100);

    atualizarCard("kpiTotal", total);
    atualizarCard("kpiConcluidas", concluidas);
    atualizarCard("kpiAndamento", andamento);
    atualizarCard("kpiPendentes", pendentes);
    atualizarCard("kpiAtrasadas", atrasadas);
    atualizarCard("percentualConclusao", percentual + "%");
    atualizarCard("efetividadeValor", percentual + "%");

    atualizarBarraEfetividade(percentual);

}

/*=========================================================
    ATUALIZAR CARD
=========================================================*/

function atualizarCard(id, valor) {

    const elemento = document.getElementById(id);

    if (!elemento) return;

    elemento.textContent = valor;

}

/*=========================================================
    BARRA DE EFETIVIDADE
=========================================================*/

function atualizarBarraEfetividade(percentual) {

    const barra = document.getElementById("barraEfetividade");

    if (!barra) return;

    barra.style.width = percentual + "%";

    if (percentual >= 90) {

        barra.style.background = "#22c55e";

    }

    else if (percentual >= 70) {

        barra.style.background = "#f59e0b";

    }

    else {

        barra.style.background = "#ef4444";

    }

}

/*=========================================================
    ATUALIZAR GRÁFICOS
=========================================================*/

function atualizarGraficos() {

    destruirGraficos();

    criarGraficoStatus();

    criarGraficoColaborador();

    criarGraficoArea();

    criarGraficoCriticidade();

}

/*=========================================================
    DESTRUIR GRÁFICOS
=========================================================*/

function destruirGraficos() {

    Object.values(state.charts).forEach(chart => {

        if (chart) {

            chart.destroy();

        }

    });

    state.charts = {};

}

/*=========================================================
    STATUS
=========================================================*/

function criarGraficoStatus() {

    const ctx = state.elementos.graficoStatus;

    if (!ctx) return;

    const atividades = obterLista();

    const concluidas = atividades.filter(a => a.status === "Concluído").length;

    const andamento = atividades.filter(a => a.status === "Em andamento").length;

    const pendentes = atividades.filter(a => a.status === "Pendente").length;

    const atrasadas = atividades.filter(a => a.status === "Atrasado").length;

    state.charts.status = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: [

                "Concluído",

                "Em andamento",

                "Pendente",

                "Atrasado"

            ],

            datasets: [{

                data: [

                    concluidas,

                    andamento,

                    pendentes,

                    atrasadas

                ]

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

}

/*=========================================================
    COLABORADOR
=========================================================*/
function criarGraficoColaborador() {

    const ctx = state.elementos.graficoColaborador;

    if (!ctx) return;

    const atividades = obterLista();

    const dados = {};

    atividades.forEach(a => {

        dados[a.colaborador] =

            (dados[a.colaborador] || 0) + 1;

    });

    state.charts.colaborador = new Chart(ctx, {

        type: "bar",

        data: {

            labels: Object.keys(dados),

            datasets: [{

                label: "Atividades",

                data: Object.values(dados)

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

}


/*=========================================================
    ÁREA
=========================================================*/

function criarGraficoArea() {

    const ctx = state.elementos.graficoArea;

    if (!ctx) return;

    const atividades = obterLista();

    const dados = {};

    atividades.forEach(a => {

        dados[a.area] =

            (dados[a.area] || 0) + 1;

    });

    state.charts.area = new Chart(ctx, {

        type: "bar",

        data: {

            labels: Object.keys(dados),

            datasets: [{

                label: "Atividades",

                data: Object.values(dados)

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

}

/*=========================================================
    CRITICIDADE
=========================================================*/

function criarGraficoCriticidade() {

    const ctx = state.elementos.graficoCriticidade;

    if (!ctx) return;

    const atividades = obterLista();

    const colaboradores = {};

    atividades.forEach((atividade) => {

        if (!colaboradores[atividade.colaborador]) {

            colaboradores[atividade.colaborador] = {
                total: 0,
                progresso: 0
            };

        }

        colaboradores[atividade.colaborador].total++;

        colaboradores[atividade.colaborador].progresso += Number(atividade.progresso);

    });

    const ranking = Object.entries(colaboradores).map(([nome, dados]) => ({

        nome,

        efetividade: dados.total === 0
            ? 0
            : Math.round(dados.progresso / dados.total)

    }));

    ranking.sort((a, b) => b.efetividade - a.efetividade);

    state.charts.criticidade = new Chart(ctx, {

        type: "bar",

        data: {

            labels: ranking.map(item => item.nome),

            datasets: [{

                label: "Efetividade (%)",

                data: ranking.map(item => item.efetividade),

                borderWidth: 1

            }]

        },

        options: {

            indexAxis: "y",

            responsive: true,

            maintainAspectRatio: false,

            animation: {
                duration: 1200
            },

            scales: {

                x: {

                    min: 0,

                    max: 100,

                    ticks: {

                        callback: value => value + "%"

                    }

                }

            },

            plugins: {

                legend: {

                    display: false

                },

                tooltip: {

                    callbacks: {

                        label: function (context) {

                            return context.raw + "% de efetividade";

                        }

                    }

                }

            }

        }

    });

}



// ================================
// DATA E HORA EM TEMPO REAL
// ================================

function atualizarDataHora() {

    const agora = new Date();

    const data = agora.toLocaleDateString("pt-BR");

    const hora = agora.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    const elemento = document.getElementById("dataHora");

    if (elemento) {
        elemento.innerHTML = `${data}<br>${hora}`;
    }
}


/*=========================================================
    LOGOUT
=========================================================*/

function logout() {

    const confirmar = confirm("Deseja realmente sair do sistema?");

    if (!confirmar) return;

    sessionStorage.removeItem("usuarioLogado");

    window.location.href = "login.html";

}

/*=========================================================
    FILTRO POR PERÍODO
=========================================================*/

function filtrarPeriodo() {

    const dataInicio = document.getElementById("dataInicio").value;
    const dataFim = document.getElementById("dataFim").value;

    if (!dataInicio || !dataFim) {
        alert("Selecione a data inicial e a data final.");
        return;
    }

    if (dataInicio > dataFim) {
        alert("A data inicial não pode ser maior que a data final.");
        return;
    }

    aplicarFiltros();

    renderizarSistema();

}

function aplicarFiltros() {

    const dataInicio = document.getElementById("dataInicio").value;
    const dataFim = document.getElementById("dataFim").value;

    let lista = [...state.atividades];

    if (dataInicio && dataFim) {

        lista = lista.filter((atividade) => {

            const dataComparacao =
                atividade.status === "Concluído"
                    ? atividade.dataConclusao
                    : atividade.inicio;

            if (!dataComparacao) return false;

            return (
                dataComparacao >= dataInicio &&
                dataComparacao <= dataFim
            );

        });

    }

    state.atividadesFiltradas = lista;

}


/*=========================================================
    EXPORTAR PDF
=========================================================*/

async function exportarPDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
    });

    const azul = [0, 59, 113];
    const laranja = [245, 130, 32];
    const cinza = [90, 90, 90];

    const hoje = new Date();

    const data =
        hoje.toLocaleDateString("pt-BR");

    const hora =
        hoje.toLocaleTimeString("pt-BR");

    const lista = state.mostrarHistorico
        ? state.atividades.filter(a => a.status === "Concluído")
        : state.atividades.filter(a => a.status !== "Concluído");

    const total = lista.length;

    const concluidas =
        lista.filter(a => a.status === "Concluído").length;

    const andamento =
        lista.filter(a => a.status === "Em andamento").length;

    const pendentes =
        lista.filter(a => a.status === "Pendente").length;

    const atrasadas =
        lista.filter(a => a.status === "Atrasado").length;

    const efetividade =
        total === 0
            ? 0
            : Math.round((concluidas / total) * 100);

    // ==========================================
    // CAPA
    // ==========================================

    doc.setFillColor(...azul);
    doc.rect(0, 0, 297, 25, "F");

    doc.setTextColor(255);

    doc.setFontSize(24);

    doc.text(
        "HOUSEKEEPING MANAGEMENT SYSTEM",
        14,
        15
    );

    doc.setFontSize(12);

    doc.text(
        "TERMINAL TOEX",
        14,
        22
    );

    doc.setTextColor(...cinza);

    doc.setFontSize(11);

    doc.text(
        "Relatório Gerencial",
        14,
        38
    );

    doc.text(
        "Emitido em: " + data + " às " + hora,
        14,
        45
    );

    doc.text(
        "Usuário: Rayan Cardoso",
        14,
        52
    );

    doc.text(
        state.mostrarHistorico
            ? "Modo: Histórico"
            : "Modo: Operacional",
        14,
        59
    );

    // ===============================
    // KPI
    // ===============================

    let x = 15;

    const cards = [

        ["TOTAL", total],

        ["CONCLUÍDAS", concluidas],

        ["EM ANDAMENTO", andamento],

        ["PENDENTES", pendentes],

        ["ATRASADAS", atrasadas],

        ["EFETIVIDADE", efetividade + "%"]

    ];

    cards.forEach(card => {

        doc.setFillColor(248, 249, 250);

        doc.roundedRect(
            x,
            72,
            42,
            28,
            2,
            2,
            "F"
        );

        doc.setDrawColor(...azul);

        doc.roundedRect(
            x,
            72,
            42,
            28,
            2,
            2
        );

        doc.setTextColor(...azul);

        doc.setFontSize(10);

        doc.text(
            card[0],
            x + 3,
            81
        );

        doc.setFontSize(18);

        doc.text(
            String(card[1]),
            x + 3,
            94
        );

        x += 46;

    });

    // ==========================================
    // RESUMO EXECUTIVO
    // ==========================================

    doc.setFontSize(16);
    doc.setTextColor(...azul);

    doc.text(
        "Resumo Executivo",
        15,
        115
    );

    doc.setDrawColor(...laranja);

    doc.line(
        15,
        118,
        80,
        118
    );

    doc.setFontSize(11);

    doc.setTextColor(60);

    let resumo = [];

    resumo.push(
        `• Total de atividades: ${total}`
    );

    resumo.push(
        `• Concluídas: ${concluidas}`
    );

    resumo.push(
        `• Em andamento: ${andamento}`
    );

    resumo.push(
        `• Pendentes: ${pendentes}`
    );

    resumo.push(
        `• Atrasadas: ${atrasadas}`
    );

    resumo.push(
        `• Efetividade geral: ${efetividade}%`
    );

    let y = 128;

    resumo.forEach(item => {

        doc.text(
            item,
            18,
            y
        );

        y += 8;

    });

    // ==========================================
    // OBSERVAÇÃO
    // ==========================================

    doc.setFillColor(245, 245, 245);

    doc.roundedRect(
        15,
        178,
        265,
        20,
        2,
        2,
        "F"
    );

    doc.setFontSize(10);

    doc.setTextColor(90);

    doc.text(
        "Este relatório foi gerado automaticamente pelo sistema Housekeeping TOEX.",
        20,
        188
    );

    doc.text(
        "Os indicadores representam a situação no momento da emissão.",
        20,
        194
    );

    // ==========================================
    // NOVA PÁGINA
    // ==========================================

    doc.addPage();

    // ==========================================
    // TÍTULO DA TABELA
    // ==========================================

    doc.setFontSize(18);
    doc.setTextColor(...azul);

    doc.text(
        "Lista de Atividades",
        14,
        18
    );

    doc.setFontSize(10);

    doc.setTextColor(90);

    doc.text(
        "Relação completa das atividades registradas.",
        14,
        24
    );

    // ==========================================
    // DADOS DA TABELA
    // ==========================================

    const linhas = lista.map(a => [

        a.id,

        a.area,

        a.atividade,

        a.colaborador,

        a.prioridade,

        a.status,

        formatarData(a.inicio),

        formatarData(a.prazo),

        a.progresso + "%"

    ]);

    doc.autoTable({

        startY: 30,

        head: [[
            "ID",
            "Área",
            "Atividade",
            "Colaborador",
            "Prioridade",
            "Status",
            "Início",
            "Prazo",
            "%"
        ]],

        body: linhas,

        styles: {
            fontSize: 8,
            cellPadding: 2,
            valign: "middle"
        },

        headStyles: {
            fillColor: azul,
            textColor: 255,
            fontStyle: "bold"
        },

        alternateRowStyles: {
            fillColor: [245, 245, 245]
        },

        margin: {
            left: 10,
            right: 10
        }

    });

    // ==========================================
    // NOVA PÁGINA PARA OS GRÁFICOS
    // ==========================================

    doc.addPage();

    doc.setFontSize(18);

    doc.setTextColor(...azul);

    doc.text(
        "Dashboard Gráfico",
        14,
        18
    );

    // ==========================================
    // CAPTURA DOS GRÁFICOS
    // ==========================================

    const canvasStatus =
        document.getElementById("graficoStatus");

    const canvasArea =
        document.getElementById("graficoArea");

    const canvasColaborador =
        document.getElementById("graficoColaborador");

    const canvasEfetividade =
        document.getElementById("graficoCriticidade");

    const imgStatus = await html2canvas(
        canvasStatus.parentElement,
        {
            backgroundColor: "#ffffff",
            scale: 2
        }
    );

    const imgArea = await html2canvas(
        canvasArea.parentElement,
        {
            backgroundColor: "#ffffff",
            scale: 2
        }
    );

    const imgColaborador = await html2canvas(
        canvasColaborador.parentElement,
        {
            backgroundColor: "#ffffff",
            scale: 2
        }
    );

    const imgEfetividade = await html2canvas(
        canvasEfetividade.parentElement,
        {
            backgroundColor: "#ffffff",
            scale: 2
        }
    );

    doc.addImage(
        imgStatus.toDataURL("image/png"),
        "PNG",
        10,
        28,
        130,
        80
    );

    doc.addImage(
        imgArea.toDataURL("image/png"),
        "PNG",
        150,
        28,
        130,
        80
    );

    doc.addImage(
        imgColaborador.toDataURL("image/png"),
        "PNG",
        10,
        118,
        130,
        80
    );

    doc.addImage(
        imgEfetividade.toDataURL("image/png"),
        "PNG",
        150,
        118,
        130,
        80
    );

    // ==========================================
    // RODAPÉ
    // ==========================================

    const paginas = doc.getNumberOfPages();

    for (let i = 1; i <= paginas; i++) {

        doc.setPage(i);

        doc.setDrawColor(220);

        doc.line(
            10,
            205,
            287,
            205
        );

        doc.setFontSize(9);

        doc.setTextColor(120);

        doc.text(
            "Housekeeping Management System - Terminal TOEX",
            10,
            210
        );

        doc.text(
            "Página " + i + " de " + paginas,
            245,
            210
        );

    }

    doc.save("Housekeeping_TOEX.pdf");

}

/*=========================================================
    IMPRIMIR
=========================================================*/

function imprimirSistema() {

    window.print();

}

