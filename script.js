/*==================================================
HOUSEKEEPING MANAGEMENT SYSTEM
TERMINAL TOEX
VERSÃO 2.0
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    iniciarSistema();

});

/*==================================================
INICIALIZAÇÃO
==================================================*/

function iniciarSistema(){

    atualizarDataHora();

    setInterval(atualizarDataHora,1000);

    animarCards();

    configurarBotoes();

}

/*==================================================
DATA E HORA
==================================================*/

function atualizarDataHora(){

    const elemento = document.getElementById("dataHora");

    if(!elemento) return;

    const agora = new Date();

    const dia = String(agora.getDate()).padStart(2,"0");

    const mes = String(agora.getMonth()+1).padStart(2,"0");

    const ano = agora.getFullYear();

    const hora = String(agora.getHours()).padStart(2,"0");

    const minuto = String(agora.getMinutes()).padStart(2,"0");

    const segundo = String(agora.getSeconds()).padStart(2,"0");

    elemento.innerHTML =
        `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`;

}

/*==================================================
ANIMAÇÃO DOS CARDS
==================================================*/

function animarCards(){

    const cards=document.querySelectorAll(".card");

    cards.forEach((card,index)=>{

        card.style.opacity="0";

        card.style.transform="translateY(25px)";

        setTimeout(()=>{

            card.style.transition=".5s";

            card.style.opacity="1";

            card.style.transform="translateY(0px)";

        },index*120);

    });

}

/*==================================================
BOTÕES
==================================================*/

function configurarBotoes(){

    const btnNova=document.querySelector(".btn-nova");

    const btnExcel=document.querySelector(".btn-exportar");

    const btnPrint=document.querySelector(".btn-imprimir");

    if(btnNova){

        btnNova.addEventListener("click",()=>{

            alert("Tela de cadastro será criada na próxima etapa.");

        });

    }

    if(btnExcel){

        btnExcel.addEventListener("click",()=>{

            alert("Exportação para Excel será implementada.");

        });

    }

    if(btnPrint){

        btnPrint.addEventListener("click",()=>{

            window.print();

        });

    }

}

/*==================================================
ATUALIZAÇÃO DOS KPIs
==================================================*/

function atualizarKPIs(){

    document.querySelector(".azul h2").innerHTML="28";

    document.querySelector(".verde h2").innerHTML="14";

    document.querySelector(".amarelo h2").innerHTML="8";

    document.querySelector(".cinza h2").innerHTML="2";

    document.querySelector(".vermelho h2").innerHTML="4";

    document.querySelector(".grafico-circle span").innerHTML="50%";

}

atualizarKPIs();

/*==================================================
UTILITÁRIOS
==================================================*/

function formatarNumero(numero){

    return numero.toLocaleString("pt-BR");

}

function gerarID(){

    return Date.now();

}

console.log("%cHOUSEKEEPING TOEX",
"color:#0D2F5C;font-size:22px;font-weight:bold");

console.log("%cSistema iniciado com sucesso.",
"color:#2CBF6E;font-size:14px");

/*==================================================
CHART.JS
==================================================*/

let graficoStatus;
let graficoResponsavel;
let graficoArea;
let graficoCriticidade;

/*==================================================
CRIAR GRÁFICOS
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    criarGraficos();

});

/*==================================================
STATUS
==================================================*/

function criarGraficos(){

    criarGraficoStatus();

    criarGraficoResponsavel();

    criarGraficoArea();

    criarGraficoCriticidade();

}

/*==================================================
GRÁFICO STATUS
==================================================*/

function criarGraficoStatus(){

    const canvas=document.getElementById("graficoStatus");

    if(!canvas) return;

    graficoStatus=new Chart(canvas,{

        type:"doughnut",

        data:{

            labels:[

                "Concluídas",

                "Em andamento",

                "Pendentes",

                "Atrasadas"

            ],

            datasets:[{

                data:[14,8,2,4],

                backgroundColor:[

                    "#2CBF6E",

                    "#F5B400",

                    "#8B97A8",

                    "#E74C3C"

                ],

                borderWidth:0

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{

                    position:"bottom"

                }

            }

        }

    });

}

/*==================================================
RESPONSÁVEIS
==================================================*/

function criarGraficoResponsavel(){

    const canvas=document.getElementById("graficoResponsavel");

    if(!canvas) return;

    graficoResponsavel=new Chart(canvas,{

        type:"bar",

        data:{

            labels:[

                "Carlos",

                "Marcos",

                "Lucas",

                "João",

                "Ana"

            ],

            datasets:[{

                label:"Atividades",

                data:[8,6,5,4,5],

                backgroundColor:"#184E8C",

                borderRadius:8

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{

                    display:false

                }

            },

            scales:{

                y:{

                    beginAtZero:true

                }

            }

        }

    });

}

/*==================================================
ÁREAS
==================================================*/

function criarGraficoArea(){

    const canvas=document.getElementById("graficoArea");

    if(!canvas) return;

    graficoArea=new Chart(canvas,{

        type:"pie",

        data:{

            labels:[

                "Armazém",

                "Pátio",

                "Recepção",

                "Moega"

            ],

            datasets:[{

                data:[10,7,6,5],

                backgroundColor:[

                    "#0D2F5C",

                    "#2CBF6E",

                    "#F5B400",

                    "#E74C3C"

                ],

                borderWidth:0

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false

        }

    });

}

/*==================================================
CRITICIDADE
==================================================*/

function criarGraficoCriticidade(){

    const canvas=document.getElementById("graficoCriticidade");

    if(!canvas) return;

    graficoCriticidade=new Chart(canvas,{

        type:"polarArea",

        data:{

            labels:[

                "Alta",

                "Média",

                "Baixa"

            ],

            datasets:[{

                data:[5,9,14],

                backgroundColor:[

                    "#E74C3C",

                    "#F5B400",

                    "#2CBF6E"

                ]

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{

                    position:"bottom"

                }

            }

        }

    });

}

/*==================================================
ATUALIZAR TODOS OS GRÁFICOS
==================================================*/

function atualizarGraficos(dados){

    if(graficoStatus){

        graficoStatus.data.datasets[0].data=[
            dados.concluidas,
            dados.andamento,
            dados.pendentes,
            dados.atrasadas
        ];

        graficoStatus.update();

    }

}

/*==================================================
BANCO DE DADOS TEMPORÁRIO
==================================================*/

let atividades = [

{
    id:1,
    local:"Armazém 01",
    area:"Recebimento",
    atividade:"Limpeza Geral",
    responsavel:"Carlos Silva",
    equipe:"Equipe A",
    prioridade:"Alta",
    status:"Em andamento",
    inicio:"07:30",
    prazo:"11:00",
    progresso:60
},

{
    id:2,
    local:"Pátio",
    area:"Expedição",
    atividade:"Organização",
    responsavel:"Marcos Lima",
    equipe:"Equipe B",
    prioridade:"Média",
    status:"Concluído",
    inicio:"08:00",
    prazo:"10:30",
    progresso:100
}

];

/*==================================================
INICIALIZA TABELA
==================================================*/

document.addEventListener("DOMContentLoaded",()=>{

    carregarTabela();

});

/*==================================================
CARREGAR TABELA
==================================================*/

function carregarTabela(){

    const tbody=document.querySelector("tbody");

    if(!tbody) return;

    tbody.innerHTML="";

    atividades.forEach(item=>{

        tbody.innerHTML+=`

        <tr>

            <td>${item.id}</td>

            <td>${item.local}</td>

            <td>${item.area}</td>

            <td>${item.atividade}</td>

            <td>${item.responsavel}</td>

            <td>${item.equipe}</td>

            <td>

                <span class="prioridade ${item.prioridade.toLowerCase()}">

                    ${item.prioridade}

                </span>

            </td>

            <td>

                <span class="status ${converterStatus(item.status)}">

                    ${item.status}

                </span>

            </td>

            <td>${item.inicio}</td>

            <td>${item.prazo}</td>

            <td>

                <div class="mini-barra">

                    <div class="mini-progresso"

                    style="width:${item.progresso}%">

                    </div>

                </div>

                ${item.progresso}%

            </td>

            <td>

                <button
                class="acao visualizar"
                onclick="visualizar(${item.id})">

                <i class="fa-solid fa-eye"></i>

                </button>

                <button
                class="acao editar"
                onclick="editar(${item.id})">

                <i class="fa-solid fa-pen"></i>

                </button>

            </td>

        </tr>

        `;

    });

}

/*==================================================
STATUS
==================================================*/

function converterStatus(status){

    switch(status){

        case "Concluído":
            return "concluido";

        case "Em andamento":
            return "andamento";

        case "Pendente":
            return "pendente";

        case "Atrasado":
            return "atrasado";

        default:
            return "";

    }

}

/*==================================================
VISUALIZAR
==================================================*/

function visualizar(id){

    const atividade=atividades.find(a=>a.id===id);

    if(!atividade) return;

    alert(

`ATIVIDADE

Local: ${atividade.local}

Área: ${atividade.area}

Responsável: ${atividade.responsavel}

Status: ${atividade.status}

Progresso: ${atividade.progresso}%`

    );

}

/*==================================================
EDITAR
==================================================*/

function editar(id){

    alert("Tela de edição será criada na próxima etapa.");

}

/*==================================================
ADICIONAR NOVA ATIVIDADE
==================================================*/

function adicionarAtividade(objeto){

    atividades.push(objeto);

    carregarTabela();

    atualizarKPIsAutomatico();

}

/*==================================================
EXCLUIR
==================================================*/

function excluirAtividade(id){

    atividades=atividades.filter(item=>item.id!==id);

    carregarTabela();

    atualizarKPIsAutomatico();

}

/*==================================================
KPIs AUTOMÁTICOS
==================================================*/

function atualizarKPIsAutomatico(){

    const total = atividades.length;

    const concluidas = atividades.filter(a =>
        a.status === "Concluído").length;

    const andamento = atividades.filter(a =>
        a.status === "Em andamento").length;

    const pendentes = atividades.filter(a =>
        a.status === "Pendente").length;

    const atrasadas = atividades.filter(a =>
        a.status === "Atrasado").length;

    const percentual = total === 0
        ? 0
        : Math.round((concluidas / total) * 100);

    atualizarCard(".azul h2", total);
    atualizarCard(".verde h2", concluidas);
    atualizarCard(".amarelo h2", andamento);
    atualizarCard(".cinza h2", pendentes);
    atualizarCard(".vermelho h2", atrasadas);

    const circle = document.querySelector(".grafico-circle span");

    if(circle){

        circle.innerHTML = percentual + "%";

    }

    atualizarGraficos({

        concluidas,
        andamento,
        pendentes,
        atrasadas

    });

}

/*==================================================
ANIMAÇÃO DOS KPIs
==================================================*/

function atualizarCard(seletor, valor){

    const elemento = document.querySelector(seletor);

    if(!elemento) return;

    animarNumero(elemento, valor);

}

/*==================================================
ANIMAÇÃO DOS NÚMEROS
==================================================*/

function animarNumero(elemento, destino){

    let numero = 0;

    clearInterval(elemento.timer);

    elemento.timer = setInterval(()=>{

        numero++;

        elemento.innerHTML = numero;

        if(numero >= destino){

            elemento.innerHTML = destino;

            clearInterval(elemento.timer);

        }

    },25);

}

/*==================================================
ATUALIZAÇÃO GERAL
==================================================*/

function atualizarSistema(){

    carregarTabela();

    atualizarKPIsAutomatico();

}

/*==================================================
EXEMPLO DE CADASTRO
==================================================*/

function cadastrarExemplo(){

    atividades.push({

        id: gerarID(),

        local:"Moega",

        area:"Descarga",

        atividade:"Lavagem do Piso",

        responsavel:"Pedro Alves",

        equipe:"Equipe C",

        prioridade:"Alta",

        status:"Pendente",

        inicio:"09:15",

        prazo:"13:00",

        progresso:0

    });

    atualizarSistema();

}

/*==================================================
SIMULAÇÃO
==================================================*/

// Para testar rapidamente, execute no console:
//
// cadastrarExemplo();

/*==================================================
FIREBASE
HOUSEKEEPING TOEX
==================================================*/

/*
=============================================
IMPORTANTE

Quando criar seu projeto no Firebase,
substitua as informações abaixo pelas
credenciais do seu projeto.

=============================================
*/

const firebaseConfig = {

    apiKey: "SUA_API_KEY",

    authDomain: "SEU_PROJETO.firebaseapp.com",

    projectId: "SEU_PROJETO",

    storageBucket: "SEU_PROJETO.appspot.com",

    messagingSenderId: "000000000",

    appId: "000000000"

};

/*==================================================
VERIFICA FIREBASE
==================================================*/

let firebaseAtivo = false;

try{

    if(typeof firebase !== "undefined"){

        firebase.initializeApp(firebaseConfig);

        firebaseAtivo = true;

        console.log("Firebase conectado.");

    }

}catch(e){

    console.log("Firebase ainda não configurado.");

}

/*==================================================
REFERÊNCIA FIRESTORE
==================================================*/

let db = null;

if(firebaseAtivo){

    db = firebase.firestore();

}

/*==================================================
SALVAR ATIVIDADE
==================================================*/

async function salvarFirebase(atividade){

    if(!firebaseAtivo) return;

    try{

        await db.collection("atividades").add(atividade);

        console.log("Atividade salva.");

    }

    catch(erro){

        console.error(erro);

    }

}

/*==================================================
CARREGAR
==================================================*/

async function carregarFirebase(){

    if(!firebaseAtivo){

        atualizarSistema();

        return;

    }

    atividades=[];

    const snapshot=await db.collection("atividades").get();

    snapshot.forEach(doc=>{

        atividades.push({

            id:doc.id,

            ...doc.data()

        });

    });

    atualizarSistema();

}

/*==================================================
ATUALIZAÇÃO EM TEMPO REAL
==================================================*/

function realtimeFirebase(){

    if(!firebaseAtivo) return;

    db.collection("atividades")

    .onSnapshot(snapshot=>{

        atividades=[];

        snapshot.forEach(doc=>{

            atividades.push({

                id:doc.id,

                ...doc.data()

            });

        });

        atualizarSistema();

    });

}

/*==================================================
EXCLUIR
==================================================*/

async function excluirFirebase(id){

    if(!firebaseAtivo){

        excluirAtividade(id);

        return;

    }

    await db.collection("atividades")

    .doc(id)

    .delete();

}

/*==================================================
NOVA ATIVIDADE
==================================================*/

async function novaAtividadeFirebase(objeto){

    if(firebaseAtivo){

        await salvarFirebase(objeto);

    }

    else{

        adicionarAtividade(objeto);

    }

}

/*==================================================
INICIALIZAÇÃO
==================================================*/

window.addEventListener("load",()=>{

    if(firebaseAtivo){

        realtimeFirebase();

    }

    else{

        atualizarSistema();

    }

});

/*==================================================
FIM DO SCRIPT
==================================================*/

console.log(
"%cHOUSEKEEPING TERMINAL TOEX",
"font-size:22px;color:#0D2F5C;font-weight:bold;"
);

console.log(
"%cSistema carregado com sucesso.",
"color:#2CBF6E;"
);