function toggleMenu() {
  const nav = document.getElementById("navLinks");
  nav.classList.toggle("active");
}

document.getElementById("ano").textContent = new Date().getFullYear();

const precos = {
  "Misto Quente": 10.0,
  Dog: 18.0,
  "Dog Duplo": 20.0,
  "X-Salada": 23.0,
  "X-Bacon": 25.0,
  "X-Calabresa": 26.0,
  "X-Frango": 24.0,
  "X-Tudo": 30.0,
  "X-Egg": 26.0,
  "Mega Bruta": 30.0,
  "Adicional de Hambúrguer": 4.0,
  "Adicional de Bacon": 4.0,
  "Adicional de Calabresa": 3.0,
  "Adicional de Ovo": 2.0,
  "Porção de Batata com bacon": 30.0,
  "Porção de Frango com Rodelas de limão": 35.0,
  "Porção de Linguiça Acebolada com azeitona": 18.0,
  "Bebida: Água": 2.0,
  "Bebida: Coca-Cola 350ml": 6.5,
  "Bebida: Coca-Cola 600ml": 8.0,
  "Bebida: Coca-cola 2L": 10.0,
  "Bebida: Guaraná": 8.0,
  "Bebida: Fanta Laranja ou Uva": 10.0,
};

let lojaAberta = false;

function verificarStatusLoja() {
  const statusEl = document.getElementById("status-loja");
  const agora = new Date();
  const diaSemana = agora.getDay();
  const hora = agora.getHours();

  lojaAberta = diaSemana !== 1 && hora >= 19 && hora < 23;

  if (diaSemana === 1) {
    statusEl.textContent = "🔴 Fechado às segundas";
    statusEl.classList.add("fechada");
  } else if (lojaAberta) {
    statusEl.textContent = "🟢 Loja Aberta";
    statusEl.classList.remove("fechada");
  } else {
    statusEl.textContent = "🔴 Loja Fechada";
    statusEl.classList.add("fechada");
  }
}

verificarStatusLoja();
//lojaAberta = true; manter a loja aberta para teste!

function calcularTotal() {
  let total = 0;
  for (const item of pedido) {
    total += precos[item] || 0;
  }
  return total;
}

let pedido = [];

function atualizarBotaoFinalizar() {
  const btnFinalizar = document.getElementById("btn-finalizar");
  const btnVerPedido = document.getElementById("btn-ver-pedido");
  const temPedido = pedido.length > 0;

  if (btnFinalizar) btnFinalizar.style.display = temPedido ? "block" : "none";
  if (btnVerPedido) btnVerPedido.style.display = temPedido ? "block" : "none";
}

function mostrarToast(mensagem) {
  const toast = document.getElementById("toast");
  toast.textContent = mensagem;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000); // 3 segundos
}

function adicionarItem(item) {
  if (!lojaAberta) {
    Swal.fire({
      icon: `info`,
      title: `Loja Fechada 🕒`,
      text: `Estamos fechados no momento. Tente novamente mais tarde.`,
      confirmButtonText: `Ok`,
      confirmButtonColor: `#d33`,
    });
    return;
  }
  pedido.push(item);
  mostrarToast(`${item} adicionado ao pedido!`);
  atualizarBotaoFinalizar();
}

function finalizarPedido() {
  if (pedido.length === 0) {
    mostrarToast(`Nenhum item no pedido!`);
    return;
  }
  fecharModalPedido(); // Fecha o modal "Seu Pedido" e mostra a barra de busca
  const total = calcularTotal();
  document.getElementById("totalPagamento").textContent = total
    .toFixed(2)
    .replace(`.`, `.`);
  document.getElementById("modalPagamento").style.display = "flex";
  esconderBusca(); // Esconde a barra de busca novamente
  document.getElementById("btn-ver-pedido").style.display = "none";
}

let formaPagamento = "";
function selecionarPagamento(tipo) {
  formaPagamento = tipo;
  document.getElementById("modalPagamento").style.display = "none";
  document.getElementById("modalMesa").style.display = "flex";

  esconderBusca();
  document.getElementById("btn-ver-pedido").style.diplay = "none";
  // busca continua escondida
}

function finalizarPedido_OLD() {
  if (pedido.length === 0) {
    mostrarToast(`Nenhum item no pedido!`);
    return;
  }
  document.getElementById(`modalMesa`).style.display = `block`;
}

function confirmarMesa() {
  const mesa = document.getElementById(`inputMesa`).value.trim();
  if (mesa === ``) {
    mostrarToast(`Por favor, digite o número da mesa.`);
    return;
  }
  enviarPedido(`Mesa ${mesa}`);
}

function selecionarEntrega() {
  enviarPedido(`Entrega`);
}

function selecionarRetirada() {
  enviarPedido(`Retirada`);
}

function enviarPedido(infoInicial) {
  // Contabiliza quantos de cada item foram pedidos
  const resumo = pedido.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});

  const total = calcularTotal();

  // Monta a mensagem para o WhatsApp
  let mensagem = `${infoInicial}:%0AForma de pagamento: ${formaPagamento}%0AOlá! Gostaria de fazer o seguinte pedido:%0A`;
  for (const item in resumo) {
    mensagem += `- ${resumo[item]}x ${item}%0A`;
  }

  mensagem += `%0A*Total do Pedido : R${total
    .toFixed(2)
    .replace(`.`, `.`)}*%0A`;

  const numero = `5544997014764`;
  const url = `https://wa.me/${numero}?text=${mensagem}`;

  // Fecha o modal e abre o WhatsApp
  document.getElementById(`modalMesa`).style.display = `none`;
  window.open(url, `_blank`);

  // Limpa o pedido e esconde botão finalizar
  pedido = [];
  mostrarBusca();
  atualizarBotaoFinalizar();
}

function esconderBusca() {
  document.querySelector(".busca-container").style.display = "none";
}
function mostrarBusca() {
  document.querySelector(".busca-container").style.display = "";
}

// Modifique as funções de abrir/fechar modal:
function abrirModalPedido() {
  atualizarListaPedido();
  document.getElementById("modalPedido").style.display = "flex";
  esconderBusca();
}

function fecharModalPedido() {
  document.getElementById("modalPedido").style.display = "none";
  mostrarBusca();
}

function fecharModalMesa() {
  document.getElementById("modalMesa").style.display = "none";
  mostrarBusca();
  atualizarBotaoFinalizar(); // <-- Adicione esta linha
}

function fecharModalPagamento() {
  document.getElementById("modalPagamento").style.display = "none";
  mostrarBusca();
  atualizarBotaoFinalizar(); // <-- Adicione esta linha
}

function atualizarListaPedido() {
  const lista = document.getElementById("listaPedido");
  lista.innerHTML = "";

  pedido.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item;

    const btnRemover = document.createElement("button");
    btnRemover.textContent = "-";
    btnRemover.classList.add("btn-remover");
    btnRemover.onclick = () => {
      pedido.splice(index, 1);
      atualizarListaPedido();
      atualizarBotaoFinalizar();
    };

    li.appendChild(btnRemover);
    lista.appendChild(li);
  });

  if (pedido.length === 0) {
    lista.innerHTML = "<li>Seu pedido está vazio.</li>";
  }

  // Mostra o valor total do pedido
  const totalPedidoModal = document.getElementById("totalPedidoModal");
  if (totalPedidoModal) {
    totalPedidoModal.textContent =
      pedido.length > 0
        ? `Total: R$ ${calcularTotal().toFixed(2).replace(".", ",")}`
        : "";
  }
}

function filtrarCardapio() {
  const busca = document.getElementById("campoBusca").value.toLowerCase();

  // Esconde o banner e o footer se houver texto na busca, mostra se estiver vazio
  if (busca.length > 0) {
    esconderBanner();
    esconderFooter();
  } else {
    mostrarBanner();
    mostrarFooter();
  }

  let algumCardVisivel = false;
  document.querySelectorAll(".card-grid").forEach((grid) => {
    let algumVisivel = false;
    grid.querySelectorAll(".card").forEach((card) => {
      const titulo =
        card.querySelector(".card-title")?.textContent.toLowerCase() || "";
      const desc =
        card.querySelector(".card-desc")?.textContent.toLowerCase() || "";
      if (titulo.includes(busca) || desc.includes(busca)) {
        card.style.display = "";
        algumVisivel = true;
        algumCardVisivel = true;
      } else {
        card.style.display = "none";
      }
    });

    const tituloSecao = grid.previousElementSibling;
    if (tituloSecao && tituloSecao.tagName === "H2") {
      tituloSecao.style.display = algumVisivel ? "" : "none";
    }
  });

  let msgGlobal = document.getElementById("msg-nao-encontrado-global");
  if (!algumCardVisivel) {
    if (!msgGlobal) {
      msgGlobal = document.createElement("div");
      msgGlobal.id = "msg-nao-encontrado-global";
      msgGlobal.className = "msg-nao-encontrado";
      msgGlobal.textContent = "Esse item não existe no cardápio.";
      msgGlobal.style.color = "red";
      msgGlobal.style.textAlign = "center";
      msgGlobal.style.margin = "32px 0";
      const cardapio = document.getElementById("cardapio");
      cardapio.appendChild(msgGlobal);
    }
  } else if (msgGlobal) {
    msgGlobal.remove();
  }
}

let lastScrollTop = 0;
const navbar = document.querySelector(".navbar");
const buscaContainer = document.querySelector(".busca-container");

window.addEventListener("scroll", function () {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop > lastScrollTop) {
    // Rolando para baixo: esconde
    navbar.style.transform = "translateY(-100%)";
    buscaContainer.style.transform = "translateY(-100%)";
  } else {
    // Rolando para cima: mostra
    navbar.style.transform = "translateY(0)";
    buscaContainer.style.transform = "translateY(0)";
  }
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Evita valores negativos
});

function esconderBanner() {
  const header = document.querySelector(".header");
  if (header) {
    header.style.display = "none";
    header.style.marginTop = "0";
    header.style.padding = "0";
  }
}

function mostrarBanner() {
  const header = document.querySelector(".header");
  if (header) {
    header.style.display = "";
    header.style.marginTop = "110px";
    header.style.padding = "10px 0";
  }
}

function esconderFooter() {
  const footer = document.querySelector("footer");
  if (footer) footer.style.display = "none";
}

function mostrarFooter() {
  const footer = document.querySelector("footer");
  if (footer) footer.style.display = "";
}

const quantidades = {};

const btnScrool = document.getElementById("btnScrool");
let lastScrollTopBtn = 0;

window.addEventListener("scroll", function () {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > 300 && scrollTop < lastScrollTopBtn) {
    btnScrool.classList.add("visible");
  } else {
    btnScrool.classList.remove("visible");
  }

  lastScrollTopBtn = scrollTop;
});

// Rola para o topo ao clicar
btnScrool.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
