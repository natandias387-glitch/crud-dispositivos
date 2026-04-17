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
  // 1. Pegar o ID
  const id = campoId.value.trim();

  // 2. Validar
  if (!id) {
    mostrarMensagem("Digite um ID para buscar.", "erro");
    return;
  }

  try {
    // 3. Fazer GET com ID
    const respostaHTTP = await fetch(`${URL_API}/${id}`);

    // 4. Verificar se encontrou
    if (!respostaHTTP.ok) {
      mostrarMensagem("Dispositivo não encontrado (ID: " + id + ").", "erro");
      return;
    }

    // 5. Converter resposta
    const item = await respostaHTTP.json();

    // 6. Preencher formulário
    campoNome.value = item.name || "";

    if (item.data && item.data.color) {
      campoCor.value = item.data.color;
    } else {
      campoCor.value = "";
    }

    if (item.data && item.data.capacity) {
      campoCapacidade.value = item.data.capacity;
    } else {
      campoCapacidade.value = "";
    }

    if (item.data && item.data.price) {
      campoPreco.value = item.data.price;
    } else {
      campoPreco.value = "";
    }

    // 7. Atualizar vetor e tabela
    dispositivos = [item];
    renderizar();

    mostrarMensagem('Dispositivo "' + item.name + '" encontrado.', "sucesso");
  } catch (erro) {
    mostrarMensagem("Erro ao buscar: " + erro.message, "erro");
  }
}

async function cadastrarDispositivo() {
  // 1. Ler os valores
  const nome = campoNome.value.trim();
  const cor = campoCor.value.trim();
  const capacidade = campoCapacidade.value.trim();
  const preco = campoPreco.value;

  // 2. Validação
  if (!nome) {
    mostrarMensagem("O nome do dispositivo é obrigatório.", "erro");
    return;
  }

  // 3. Montar objeto
  const precoNumerico = parseFloat(preco) || 0;

  const novoDispositivo = {
    name: nome,
    data: {
      color: cor,
      capacity: capacidade,
      price: precoNumerico,
    },
  };

  try {
    // 4. POST
    const respostaHTTP = await fetch(URL_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novoDispositivo),
    });

    // 5. Verificar resposta
    if (!respostaHTTP.ok) {
      mostrarMensagem(
        "Erro ao cadastrar. Status: " + respostaHTTP.status,
        "erro",
      );
      return;
    }

    // 6. Converter resposta
    const itemCriado = await respostaHTTP.json();

    // 7. Atualizar vetor
    dispositivos.push(itemCriado);

    // 8. Renderizar
    renderizar();

    // 9. Limpar + mensagem
    limparFormulario();
    mostrarMensagem(
      'Dispositivo "' + itemCriado.name + '" cadastrado com sucesso!',
      "sucesso",
    );
  } catch (erro) {
    mostrarMensagem("Erro ao cadastrar: " + erro.message, "erro");
  }
}

async function atualizarDispositivo() {
  const id = campoId.value.trim();
  const nome = campoNome.value.trim();
  const cor = campoCor.value.trim();
  const capacidade = campoCapacidade.value.trim();
  const preco = campoPreco.value;

  if (!id) {
    mostrarMensagem("Informe o ID para atualizar.", "erro");
    return;
  }

  if (!nome) {
    mostrarMensagem("O nome é obrigatório.", "erro");
    return;
  }

  const precoNumerico = parseFloat(preco) || 0;

  const dispositivoAtualizado = {
    name: nome,
    data: {
      color: cor,
      capacity: capacidade,
      price: precoNumerico,
    },
  };

  try {
    const respostaHTTP = await fetch(`${URL_API}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dispositivoAtualizado),
    });

    if (!respostaHTTP.ok) {
      mostrarMensagem(
        "Erro ao atualizar. Status: " + respostaHTTP.status,
        "erro",
      );
      return;
    }

    const itemAtualizado = await respostaHTTP.json();

    const index = dispositivos.findIndex((d) => d.id == id);
    if (index !== -1) {
      dispositivos[index] = itemAtualizado;
    }

    renderizar();

    mostrarMensagem("Dispositivo atualizado com sucesso!", "sucesso");
  } catch (erro) {
    mostrarMensagem("Erro ao atualizar: " + erro.message, "erro");
  }
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
