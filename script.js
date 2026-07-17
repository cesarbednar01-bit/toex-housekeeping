/*=========================================
 HOUSEKEEPING MANAGEMENT SYSTEM
 script.js
=========================================*/

document.addEventListener("DOMContentLoaded", () => {

    iniciarRelogio();
    iniciarMenu();
    animarCards();
    preencherDashboard();

});

/*=========================================
 RELÓGIO
=========================================*/

function iniciarRelogio() {

    const clock = document.getElementById("clock");

    if (!clock) return;

    function atualizar() {

        const agora = new Date();

        const hora = String(agora.getHours()).padStart(2, "0");
        const minuto = String(agora.getMinutes()).padStart(2, "0");
        const segundo = String(agora.getSeconds()).padStart(2, "0");

        clock.innerHTML = `${hora}:${minuto}:${segundo}`;

    }

    atualizar();

    setInterval(atualizar, 1000);

}

/*=========================================
 MENU LATERAL
=========================================*/

function iniciarMenu() {

    const botao = document.querySelector(".menu-btn");
    const sidebar = document.querySelector(".sidebar");

    if (!botao || !sidebar) return;

    botao.addEventListener("click", () => {

        sidebar.classList.toggle("active");

    });

}

/*=========================================
 ANIMAÇÃO DOS CARDS
=========================================*/

function animarCards() {

    const cards = document.querySelectorAll(".card");

    cards.forEach((card, index) => {

        card.style.opacity = "0";
        card.style.transform = "translateY(25px)";

        setTimeout(() => {

            card.style.transition = ".45s";

            card.style.opacity = "1";
            card.style.transform = "translateY(0px)";

        }, index * 120);

    });

}

/*=========================================
 DASHBOARD DEMONSTRAÇÃO
=========================================*/

function preencherDashboard() {

    const valores = [

        "145",
        "126",
        "12",
        "7",
        "92%"

    ];

    const cards = document.querySelectorAll(".card h2");

    cards.forEach((card, index) => {

        if (valores[index]) {

            animarNumero(card, valores[index]);

        }

    });

}

/*=========================================
 ANIMAÇÃO DE NÚMEROS
=========================================*/

function animarNumero(elemento, valorFinal) {

    if (valorFinal.includes("%")) {

        let numero = 0;

        const destino = parseInt(valorFinal);

        const timer = setInterval(() => {

            numero++;

            elemento.innerHTML = numero + "%";

            if (numero >= destino) {

                clearInterval(timer);

            }

        }, 18);

    }

    else {

        let numero = 0;

        const destino = parseInt(valorFinal);

        const timer = setInterval(() => {

            numero += 2;

            elemento.innerHTML = numero;

            if (numero >= destino) {

                elemento.innerHTML = destino;

                clearInterval(timer);

            }

        }, 15);

    }

}

/*=========================================
 MENU ATIVO
=========================================*/

const menus = document.querySelectorAll(".sidebar li");

menus.forEach(item => {

    item.addEventListener("click", () => {

        menus.forEach(i => i.classList.remove("active"));

        item.classList.add("active");

    });

});

/*=========================================
 NOTIFICAÇÃO
=========================================*/

const notificacao = document.querySelector(".notification");

if (notificacao) {

    notificacao.addEventListener("click", () => {

        alert("Nenhuma nova notificação.");

    });

}

/*=========================================
 PESQUISA
=========================================*/

const pesquisa = document.querySelector(".search input");

if (pesquisa) {

    pesquisa.addEventListener("keyup", function () {

        console.log("Pesquisar:", this.value);

    });

}

console.log("%cHousekeeping Management System", "color:#173F73;font-size:20px;font-weight:bold;");
console.log("%cSistema iniciado com sucesso.", "color:green;");