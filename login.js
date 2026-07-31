// ========================================
// HOUSEKEEPING TOEX
// LOGIN FIREBASE
// ========================================

import { auth, db } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// ========================================
// ELEMENTOS
// ========================================

const inputUsuario = document.getElementById("usuario");
const inputSenha = document.getElementById("senha");
const btnEntrar = document.getElementById("btnEntrar");
const btnMostrarSenha = document.getElementById("mostrarSenha");

// ========================================
// MOSTRAR / OCULTAR SENHA
// ========================================

btnMostrarSenha.addEventListener("click", () => {

    const icone = btnMostrarSenha.querySelector("i");

    if (inputSenha.type === "password") {

        inputSenha.type = "text";
        icone.classList.replace("fa-eye", "fa-eye-slash");

    } else {

        inputSenha.type = "password";
        icone.classList.replace("fa-eye-slash", "fa-eye");

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

        // Procura o usuário no Firestore
        const q = query(
            collection(db, "usuarios"),
            where("usuario", "==", usuario)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {

            alert("Usuário não encontrado.");
            return;

        }

        const dadosUsuario = snapshot.docs[0].data();

        console.log("Usuário encontrado:", dadosUsuario);

        // Login no Firebase Authentication
        const credencial = await signInWithEmailAndPassword(
            auth,
            dadosUsuario.email,
            senha
        );

        console.log("Login realizado:", credencial.user);

        // Salva sessão
        sessionStorage.setItem(
            "usuarioLogado",
            JSON.stringify({
                uid: credencial.user.uid,
                usuario: dadosUsuario.usuario,
                nome: dadosUsuario.nome,
                perfil: dadosUsuario.perfil,
                email: dadosUsuario.email,
                ativo: dadosUsuario.ativo
            })
        );

        window.location.replace("index.html");

    } catch (erro) {

        console.error("Erro Firebase:", erro);

        switch (erro.code) {

            case "auth/invalid-credential":
                alert("Usuário ou senha inválidos.");
                break;

            case "auth/user-not-found":
                alert("Usuário não encontrado no Authentication.");
                break;

            case "auth/wrong-password":
                alert("Senha incorreta.");
                break;

            case "auth/too-many-requests":
                alert("Muitas tentativas de login. Aguarde alguns minutos.");
                break;

            default:
                alert(
                    "Erro: " +
                    (erro.code || "") +
                    "\n\n" +
                    (erro.message || erro)
                );

        }

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

    window.location.replace("index.html");

}