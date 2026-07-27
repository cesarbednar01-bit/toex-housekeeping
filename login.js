// ========================================
// HOUSEKEEPING MANAGEMENT SYSTEM
// LOGIN
// ========================================

// ========================================
// USUÁRIOS DO SISTEMA (TEMPORÁRIO)
// Futuramente estes dados virão do Firebase.
// ========================================

const USUARIOS = [

    {
        id: 1,
        usuario: "Cesar.Bednarczuk",
        senha: "Moxaki123",
        nome: "Cesar Bednarczuk",
        perfil: "Administrador"
    },

    {
        id: 2,
        usuario: "Rayan.Cardoso",
        senha: "Choraboy123",
        nome: "Rayan Cardoso",
        perfil: "Operador"
    }

];

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

    const usuarioEncontrado = USUARIOS.find(u =>
        u.usuario.toLowerCase() === usuario.toLowerCase() &&
        u.senha === senha
    );

    if (usuarioEncontrado) {

        // Salva todas as informações do usuário
        sessionStorage.setItem(
            "usuarioLogado",
            JSON.stringify(usuarioEncontrado)
        );

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

inputUsuario.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        realizarLogin();

    }

});

inputSenha.addEventListener("keypress", function (e) {

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