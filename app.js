// ============================================================
// CONSTANTES
// ============================================================

const URL_API = "https://restful-apidevcloe.vercel.app/objects";

// ============================================================
// VETOR LOCAL
// ============================================================

let dispositivos = [];

// ============================================================
// REFERÊNCIAS AO DOM
// ============================================================

const campoId = document.getElementById("campoId");
const campoNome = document.getElementById("campoNome");
const campoCor = document.getElementById("campoCor");
const campoCapacidade = document.getElementById("campoCapacidade");
const campoPreco = document.getElementById("campoPreco");

const corpoTabela = document.getElementById("corpoTabela");
const divMensagem = document.getElementById("mensagem");

// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

function mostrarMensagem(texto, tipo) {
  divMensagem.textContent = texto;
  divMensagem.className = tipo;
}

function limparFormulario() {
  campoId.value = "";
  campoNome.value = "";
  campoCor.value = "";
  campoCapacidade.value = "";
  campoPreco.value = "";
}

// ============================================================
// RENDERIZAR TABELA
// ============================================================

function renderizar() {
  // 1. Limpar tabela
  corpoTabela.innerHTML = "";

  // 2. Percorrer o vetor
  for (let i = 0; i < dispositivos.length; i++) {
    const item = dispositivos[i];

    // Criar linha
    const linha = document.createElement("tr");

    // ID
    const celulaId = document.createElement("td");
    celulaId.textContent = item.id;

    // Nome
    const celulaNome = document.createElement("td");
    celulaNome.textContent = item.name;

    // Cor
    const celulaCor = document.createElement("td");
    if (item.data && item.data.color) {
      celulaCor.textContent = item.data.color;
    } else {
      celulaCor.textContent = "—";
    }

    // Capacidade
    const celulaCapacidade = document.createElement("td");
    if (item.data && item.data.capacity) {
      celulaCapacidade.textContent = item.data.capacity;
    } else {
      celulaCapacidade.textContent = "—";
    }

    // Preço
    const celulaPreco = document.createElement("td");
    if (item.data && item.data.price) {
      celulaPreco.textContent = item.data.price.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    } else {
      celulaPreco.textContent = "—";
    }

    // Adicionar células na linha
    linha.appendChild(celulaId);
    linha.appendChild(celulaNome);
    linha.appendChild(celulaCor);
    linha.appendChild(celulaCapacidade);
    linha.appendChild(celulaPreco);

    // Adicionar linha na tabela
    corpoTabela.appendChild(linha);
  }
}

// ============================================================
// CRUD - PASSO 1
// ============================================================

async function listarDispositivos() {
  try {
    const respostaHTTP = await fetch(URL_API);
    const dados = await respostaHTTP.json();

    if (Array.isArray(dados)) {
      dispositivos = dados;
    } else if (dados.data) {
      dispositivos = dados.data;
    } else {
      dispositivos = [];
    }

    renderizar();

    mostrarMensagem(
      dispositivos.length + " dispositivos encontrados.",
      "sucesso",
    );
  } catch (erro) {
    mostrarMensagem("Erro ao listar: " + erro.message, "erro");
  }
}

// ============================================================
// FUNÇÕES (AINDA NÃO IMPLEMENTADAS)
// ============================================================

async function buscarPorId() {
  alert("Botão BUSCAR POR ID clicado!");
}

async function cadastrarDispositivo() {
  alert("Botão CADASTRAR clicado!");
}

async function atualizarDispositivo() {
  alert("Botão ATUALIZAR clicado!");
}

async function excluirDispositivo() {
  alert("Botão EXCLUIR clicado!");
}

// ============================================================
// EVENT LISTENERS
// ============================================================

document
  .getElementById("btnListar")
  .addEventListener("click", listarDispositivos);

document.getElementById("btnBuscar").addEventListener("click", buscarPorId);

document
  .getElementById("btnCadastrar")
  .addEventListener("click", cadastrarDispositivo);

document
  .getElementById("btnAtualizar")
  .addEventListener("click", atualizarDispositivo);

document
  .getElementById("btnExcluir")
  .addEventListener("click", excluirDispositivo);
