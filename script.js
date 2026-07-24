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

    atividadeSelecionada: null,

    atividadeEditando: null,

    fotosTemporarias: [],

    charts: {},

    firebaseInicializado: false,

    carregando: false,

    elementos: {}

};

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

    return new Date(data).toLocaleDateString("pt-BR");

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

    atualizarDataHora();

    setInterval(

        atualizarDataHora, 1000);

    carregarAtividades();

    inicializarDashboard();

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


    // FECHAR MODAL CLICANDO FORA

    el.modal?.addEventListener(

        "click",

        function (e) {

            if (e.target === el.modal) {

                fecharModal();

            }

        }

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



        fotos: []

    };
    if (state.atividadeEditando !== null) {

        atividade.id = state.atividadeEditando;

        const indice = state.atividades.findIndex(

            item => item.id === state.atividadeEditando

        );

        if (indice !== -1) {

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

    if (state.atividades.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="11" class="sem-registros">
                    Nenhuma atividade cadastrada.
                </td>
            </tr>
        `;

        return;
    }

    state.atividades.forEach((atividade) => {

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

    // Não estamos editando, vamos criar uma nova
    state.atividadeEditando = null;


    el.area.value = atividade.area;
    el.atividade.value = atividade.atividade;
    el.encarregado.value = atividade.encarregado;
    el.colaborador.value = atividade.colaborador;
    el.prioridade.value = atividade.prioridade;
    el.status.value = atividade.status;
    el.inicio.value = atividade.inicio;
    el.prazo.value = atividade.prazo;
    el.progresso.value = atividade.progresso;

    // Não duplicar as fotos
    el.foto.value = "";

    
    // Limpa qualquer foto temporária
    state.fotosTemporarias = [];

    state.elementos.modal.classList.add("active");

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

    const total = state.atividades.length;

    const concluidas = state.atividades.filter(

        item => item.status === "Concluído"

    ).length;

    const andamento = state.atividades.filter(

        item => item.status === "Em andamento"

    ).length;

    const pendentes = state.atividades.filter(

        item => item.status === "Pendente"

    ).length;

    const atrasadas = state.atividades.filter(

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

    const concluidas = state.atividades.filter(a => a.status === "Concluído").length;

    const andamento = state.atividades.filter(a => a.status === "Em andamento").length;

    const pendentes = state.atividades.filter(a => a.status === "Pendente").length;

    const atrasadas = state.atividades.filter(a => a.status === "Atrasado").length;

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

    const dados = {};

    state.atividades.forEach(a => {

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

    const dados = {};

    state.atividades.forEach(a => {

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

    const colaboradores = {};

    state.atividades.forEach((atividade) => {

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

    // Verifica se as datas foram informadas
    if (!dataInicio || !dataFim) {
        alert("Selecione a data inicial e a data final.");
        return;
    }

    // Verifica se o período é válido
    if (dataInicio > dataFim) {
        alert("A data inicial não pode ser maior que a data final.");
        return;
    }

    // Filtra as atividades
    const atividadesFiltradas = state.atividades.filter((atividade) => {

        if (!atividade.inicio) return false;

        return (
            atividade.inicio >= dataInicio &&
            atividade.inicio <= dataFim
        );

    });

    // Renderiza a tabela filtrada
    renderizarTabelaFiltrada(atividadesFiltradas);

}

/*=========================================================
    RENDERIZAR TABELA FILTRADA
=========================================================*/

function renderizarTabelaFiltrada(lista) {

    const tbody = state.elementos.tabela;

    if (!tbody) return;

    tbody.innerHTML = "";

    if (lista.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="11" class="sem-registros">
                    Nenhuma atividade encontrada para o período informado.
                </td>
            </tr>
        `;

        return;
    }

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

                <button
                    class="btn-acao duplicar"
                    onclick="duplicarAtividade(${atividade.id})">
                    <i class="fa-solid fa-copy"></i>
                </button>

                <button
                    class="btn-acao editar"
                    onclick="editarAtividade(${atividade.id})">
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button
                    class="btn-acao excluir"
                    onclick="excluirAtividade(${atividade.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>

            </td>
        `;

        tbody.appendChild(tr);

    });

}