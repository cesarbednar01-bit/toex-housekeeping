// ========================================
// HOUSEKEEPING MANAGEMENT SYSTEM
// LOGIN
// ========================================

// Usuário padrão (temporário)
const USUARIO = "admin";
const SENHA = "123456";

// Elementos
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

function realizarLogin() {

    const usuario = inputUsuario.value.trim();
    const senha = inputSenha.value.trim();

    if (usuario === "" || senha === "") {

        alert("Preencha usuário e senha.");

        return;

    }

    if (usuario === USUARIO && senha === SENHA) {

        sessionStorage.setItem("usuarioLogado", usuario);

        window.location.href = "index.html";

    } else {

        alert("Usuário ou senha inválidos.");

        inputSenha.value = "";

        inputSenha.focus();

    }

}

// ========================================
// EVENTOS
// ========================================

btnEntrar.addEventListener("click", realizarLogin);

inputSenha.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        realizarLogin();

    }

});

inputUsuario.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        realizarLogin();

    }

});

// ========================================
// SE JÁ ESTIVER LOGADO
// ========================================

if (sessionStorage.getItem("usuarioLogado")) {

    window.location.href = "index.html";

}