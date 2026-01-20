// Comissão fixa
const COMISSAO = 2; // 2%

// Carrega vendas salvas
let vendas = JSON.parse(localStorage.getItem("vendas_comissao")) || [];

function salvar() {
  localStorage.setItem("vendas_comissao", JSON.stringify(vendas));
}

// Adicionar venda
function adicionar() {
  const cliente = document.getElementById("cliente").value.trim();
  const valor = document.getElementById("valor").value;

  if (!cliente || !valor) {
    alert("Preencha o nome da venda e o valor");
    return;
  }

  vendas.push({
    cliente,
    valor: Number(valor),
    mes: document.getElementById("mes").value,
    ano: document.getElementById("ano").value
  });

  document.getElementById("cliente").value = "";
  document.getElementById("valor").value = "";

  salvar();
  atualizar();
}

// Atualizar tela
function atualizar() {
  const mes = document.getElementById("mes").value;
  const ano = document.getElementById("ano").value;
  const lista = document.getElementById("lista");

  lista.innerHTML = "";

  let totalVendas = 0;
  let totalComissao = 0;

  vendas.forEach((v, index) => {
    if (v.mes === mes && v.ano === ano) {
      const comissao = v.valor * (COMISSAO / 100);

      totalVendas += v.valor;
      totalComissao += comissao;

      lista.innerHTML += `
        <tr>
          <td>${v.cliente}</td>
          <td>R$ ${v.valor.toFixed(2)}</td>
          <td>R$ ${comissao.toFixed(2)}</td>
          <td>
            <button onclick="remover(${index})">❌</button>
          </td>
        </tr>
      `;
    }
  });

  document.getElementById("totalVendas").innerText = totalVendas.toFixed(2);
  document.getElementById("totalComissao").innerText = totalComissao.toFixed(2);
}

// Remover venda
function remover(index) {
  vendas.splice(index, 1);
  salvar();
  atualizar();
}

// Inicializa
atualizar();
