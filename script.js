let vendas = JSON.parse(localStorage.getItem("vendas")) || [];

// 🔒 Comissão fixa
const COMISSAO_FIXA = 0.02; // 2%

function salvar() {
  localStorage.setItem("vendas", JSON.stringify(vendas));
}

function adicionar() {
  if (!cliente.value || !valor.value) return alert("Preencha cliente e valor");

  vendas.push({
    cliente: cliente.value,
    valor: +valor.value,
    mes: mes.value,
    ano: ano.value
  });

  cliente.value = "";
  valor.value = "";

  salvar();
  atualizar();
}

function atualizar() {
  lista.innerHTML = "";
  let total = 0;
  let totalComissao = 0;

  vendas.forEach((v, i) => {
    if (v.mes === mes.value && v.ano == ano.value) {
      const comissao = v.valor * COMISSAO_FIXA;

      total += v.valor;
      totalComissao += comissao;

      lista.innerHTML += `
        <tr>
          <td>${v.cliente}</td>
          <td>R$ ${v.valor.toFixed(2)}</td>
          <td>R$ ${comissao.toFixed(2)}</td>
          <td><button onclick="remover(${i})">❌</button></td>
        </tr>
      `;
    }
  });

  totalVendido.innerText = total.toFixed(2);
  totalComissaoSpan.innerText = totalComissao.toFixed(2);

  atualizarGrafico(total, totalComissao);
}

function remover(index) {
  vendas.splice(index, 1);
  salvar();
  atualizar();
}

// 📊 Gráfico
let grafico;
function atualizarGrafico(total, comissao) {
  if (grafico) grafico.destroy();

  grafico = new Chart(document.getElementById("grafico"), {
    type: "bar",
    data: {
      labels: ["Total Vendido", "Comissão (2%)"],
      datasets: [{
        data: [total, comissao]
      }]
    }
  });
}

// 📤 Exportar Excel
function exportarExcel() {
  const dados = vendas
    .filter(v => v.mes === mes.value && v.ano == ano.value)
    .map(v => ({
      Cliente: v.cliente,
      "Valor da Venda": v.valor,
      "Comissão (2%)": (v.valor * COMISSAO_FIXA).toFixed(2),
      Mês: v.mes,
      Ano: v.ano
    }));

  const planilha = XLSX.utils.json_to_sheet(dados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, planilha, "Vendas");
  XLSX.writeFile(wb, "controle_vendas_2_porcento.xlsx");
}

atualizar();
