// ========================================
// HOUSEKEEPING TOEX
// LOGIN FIRESTORE
// ========================================

import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// ========================================
// ELEMENTOS
// ========================================

const inputUsuario = document.getElementById("usuario");
const inputSenha = document.getElementById("senha");
const btnEntrar = document.getElementById("btnEntrar");
const btnMostrarSenha = document.getElementById("mostrarSenha");

// ========================================
// MOSTRAR SENHA
// ========================================

btnMostrarSenha.addEventListener("click", () => {

    const icone = btnMostrarSenha.querySelector("i");

    if (inputSenha.type === "password") {

        inputSenha.type = "text";

        icone.classList.remove("fa-eye");
        icone.classList.add("fa-eye-slash");

    } else {

        inputSenha.type = "password";

        icone.classList.remove("fa-eye-slash");
        icone.classList.add("fa-eye");

    }

});

// ========================================
// LOGIN
// ========================================

async function realizarLogin() {

    const usuario = inputUsuario.value.trim();
    const senha = inputSenha.value;

    if (!usuario || !senha) {

        alert("Informe usuário e senha.");
        return;

    }

    try {

        const usuarioRef = doc(db, "usuarios", usuario);

        const snapshot = await getDoc(usuarioRef);

        if (!snapshot.exists()) {

            alert("Usuário não encontrado.");
            return;

        }

        const dados = snapshot.data();

        // Verifica se está ativo

        if (!dados.ativo) {

            alert("Usuário desativado.");
            return;

        }

        // Verifica senha

        if (dados.senha !== senha) {

            alert("Senha incorreta.");

            inputSenha.value = "";
            inputSenha.focus();

            return;

        }

        // Salva sessão

        sessionStorage.setItem(
            "usuarioLogado",
            JSON.stringify({

                usuario: dados.usuario,
                nome: dados.nome,
                perfil: dados.perfil,    
                ativo: dados.ativo

            })
        );

        window.location.href = "index.html";

    }

    catch (erro) {

        console.error(erro);

        alert("Erro ao conectar com o banco de dados.");

    }

}

// ========================================
// EVENTOS
// ========================================

btnEntrar.addEventListener("click", realizarLogin);

inputUsuario.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        realizarLogin();

    }

});

inputSenha.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        realizarLogin();

    }

});

// ========================================
// JÁ LOGADO
// ========================================

if (sessionStorage.getItem("usuarioLogado")) {

    window.location.href = "index.html";

}