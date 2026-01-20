let vendas = JSON.parse(localStorage.getItem("vendas")) || [];

function salvar() {
  localStorage.setItem("vendas", JSON.stringify(vendas));
}

function adicionar() {
  vendas.push({
    cliente: cliente.value,
    valor: +valor.value,
    mes: mes.value,
    ano: ano.value
  });
  salvar();
  atualizar();
}

function atualizar() {
  lista.innerHTML = "";
  let total = 0;
  let comissao = 0;
  const perc = +percentual.value || 0;

  vendas.forEach((v, i) => {
    if (v.mes === mes.value && v.ano == ano.value) {
      const c = v.valor * (perc / 100);
      total += v.valor;
      comissao += c;

      lista.innerHTML += `
      <tr>
        <td>${v.cliente}</td>
        <td>R$ ${v.valor.toFixed(2)}</td>
        <td>R$ ${c.toFixed(2)}</td>
        <td><button onclick="remover(${i})">❌</button></td>
      </tr>`;
    }
  });

  totalVendido.innerText = total.toFixed(2);
  totalComissao.innerText = comissao.toFixed(2);

  atualizarGrafico(total, comissao);
}

function remover(i) {
  vendas.splice(i, 1);
  salvar();
  atualizar();
}

let grafico;
function atualizarGrafico(total, comissao) {
  if (grafico) grafico.destroy();

  grafico = new Chart(document.getElementById("grafico"), {
    type: "bar",
    data: {
      labels: ["Total Vendido", "Comissão"],
      datasets: [{
        data: [total, comissao]
      }]
    }
  });
}

function exportarExcel() {
  const dados = vendas.map(v => ({
    Cliente: v.cliente,
    Valor: v.valor,
    Mês: v.mes,
    Ano: v.ano
  }));

  const planilha = XLSX.utils.json_to_sheet(dados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, planilha, "Vendas");
  XLSX.writeFile(wb, "controle_vendas.xlsx");
}

atualizar();
