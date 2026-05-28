const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
let estado = carregarEstado();
let termoBusca = '';
let categoriaFiltro = 'todas';
let renderTimer = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const normalizar = (texto) => String(texto || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const els = {
  porte: $('#porteVeiculo'),
  dadosVeiculo: $('#dadosVeiculo'),
  busca: $('#buscaCatalogo'),
  filtroCategoria: $('#filtroCategoria'),
  catalogoBody: $('#catalogoBody'),
  catalogoCount: $('#catalogoCount'),
  catalogoEmpty: $('#catalogoEmpty'),
  regulagemBody: $('#regulagemBody'),
  regulagemEmpty: $('#regulagemEmpty'),
  totalGeral: $('#totalGeral'),
  totalItens: $('#totalItens'),
  classificacao: $('#classificacaoGravidade'),
  score: $('#scoreGravidade'),
  alerta: $('#alertaGrandeMonta'),
  resumoCategorias: $('#categorySummary'),
  chartMaiorCategoria: $('#chartMaiorCategoria'),
  chartTicketMedio: $('#chartTicketMedio'),
  chart: $('#regulagemChart'),
  sugestoes: $('#sugestoes'),
  kits: $('#kitsContainer'),
  observacoes: $('#observacoes'),
  toast: $('#toast')
};

function init() {
  popularCategorias();
  restaurarFormulario();
  renderKits();
  vincularEventos();
  renderTudo();
  mostrarToast('Sistema carregado com catálogo profissional.');
}

function popularCategorias() {
  Object.entries(CATEGORIA_LABELS).forEach(([valor, label]) => {
    const option = document.createElement('option');
    option.value = valor;
    option.textContent = label;
    els.filtroCategoria.appendChild(option);
  });
}

function restaurarFormulario() {
  els.porte.value = estado.veiculo.porte || 'hatch';
  els.dadosVeiculo.value = estado.veiculo.dados || montarDadosVeiculoLegado();
  estado.veiculo.dados = els.dadosVeiculo.value;
  els.observacoes.value = estado.observacoes || '';
}

function vincularEventos() {
  els.porte.addEventListener('change', () => {
    estado.veiculo.porte = els.porte.value;
    recalcularValoresPorPorte();
    persistirERenderizar();
  });

  els.dadosVeiculo.addEventListener('input', () => {
    estado.veiculo.dados = els.dadosVeiculo.value;
    salvarEstado(estado);
  });

  els.observacoes.addEventListener('input', () => {
    estado.observacoes = els.observacoes.value;
    salvarEstado(estado);
  });

  els.busca.addEventListener('input', (event) => {
    termoBusca = normalizar(event.target.value);
    agendarRenderCatalogo();
  });

  els.filtroCategoria.addEventListener('change', (event) => {
    categoriaFiltro = event.target.value;
    agendarRenderCatalogo();
  });

  $('#btnLimpar').addEventListener('click', limparRegulagem);
  $('#btnCopiarResumo').addEventListener('click', copiarResumoWhatsapp);
  $('#btnGerarPdf').addEventListener('click', gerarPdf);

  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      els.busca.focus();
    }
  });
}

function agendarRenderCatalogo() {
  clearTimeout(renderTimer);
  renderTimer = setTimeout(renderCatalogo, 70);
}

function renderTudo() {
  renderCatalogo();
  renderRegulagem();
  renderDashboard();
  renderSugestoes();
}

function renderCatalogo() {
  const porte = estado.veiculo.porte || 'hatch';
  const fragment = document.createDocumentFragment();
  const filtrados = catalogo.filter((servico) => {
    const texto = normalizar(`${servico.nome} ${servico.categoria} ${servico.subcategoria} ${servico.codigo}`);
    const combinaBusca = !termoBusca || texto.includes(termoBusca);
    const combinaCategoria = categoriaFiltro === 'todas' || servico.categoria === categoriaFiltro;
    return combinaBusca && combinaCategoria;
  });

  filtrados.forEach((servico) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${servico.codigo}</strong></td>
      <td>${servico.nome}<small class="row-note">Severidade: ${servico.severidade}</small></td>
      <td><span class="badge ${servico.categoria}">${CATEGORIA_LABELS[servico.categoria]}</span></td>
      <td>${servico.subcategoria}</td>
      <td><strong>${moeda.format(servico.valores[porte])}</strong></td>
      <td><button class="btn btn-small" data-add="${servico.codigo}">Adicionar</button></td>`;
    fragment.appendChild(tr);
  });

  els.catalogoBody.replaceChildren(fragment);
  els.catalogoCount.textContent = `${filtrados.length} de ${catalogo.length} itens`;
  els.catalogoEmpty.classList.toggle('hidden', filtrados.length > 0);

  $$('[data-add]').forEach((botao) => botao.addEventListener('click', () => adicionarItem(botao.dataset.add)));
}

function renderKits() {
  const fragment = document.createDocumentFragment();
  kitsRegulagem.forEach((kit) => {
    const button = document.createElement('button');
    button.className = 'kit-card';
    button.innerHTML = `<strong>${kit.nome}</strong><span>${kit.descricao}</span>`;
    button.addEventListener('click', () => aplicarKit(kit));
    fragment.appendChild(button);
  });
  els.kits.replaceChildren(fragment);
}

function criarItemRegulagem(servico) {
  const porte = estado.veiculo.porte || 'hatch';
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    codigo: servico.codigo,
    categoria: servico.categoria,
    descricao: servico.nome,
    valor: servico.valores[porte],
    severidade: servico.severidade
  };
}

function adicionarItem(codigo, silencioso = false) {
  const servico = catalogo.find((item) => item.codigo === codigo);
  if (!servico) return;
  estado.regulagem.push(criarItemRegulagem(servico));
  persistirERenderizar();
  if (!silencioso) mostrarToast(`${servico.nome} adicionado à regulagem.`);
}

function aplicarKit(kit) {
  kit.codigos.forEach((codigo) => adicionarItem(codigo, true));
  mostrarToast(`Kit "${kit.nome}" aplicado com ${kit.codigos.length} serviços.`);
}

function recalcularValoresPorPorte() {
  const porte = estado.veiculo.porte || 'hatch';
  estado.regulagem = estado.regulagem.map((item) => {
    const servico = catalogo.find((catalogoItem) => catalogoItem.codigo === item.codigo);
    return servico ? { ...item, valor: servico.valores[porte] } : item;
  });
}

function renderRegulagem() {
  const fragment = document.createDocumentFragment();
  estado.regulagem.forEach((item) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="badge ${item.categoria}">${CATEGORIA_LABELS[item.categoria] || item.categoria}</span></td>
      <td><input class="table-input" value="${escapeHtml(item.descricao)}" data-edit-desc="${item.id}" /></td>
      <td><input class="table-input money" type="number" min="0" step="10" value="${Number(item.valor).toFixed(2)}" data-edit-value="${item.id}" /></td>
      <td><button class="icon-btn" title="Remover" data-remove="${item.id}">×</button></td>`;
    fragment.appendChild(tr);
  });
  els.regulagemBody.replaceChildren(fragment);
  els.regulagemEmpty.classList.toggle('hidden', estado.regulagem.length > 0);

  $$('[data-edit-desc]').forEach((input) => input.addEventListener('input', () => editarItem(input.dataset.editDesc, { descricao: input.value })));
  $$('[data-edit-value]').forEach((input) => input.addEventListener('input', () => editarItem(input.dataset.editValue, { valor: Number(input.value) || 0 })));
  $$('[data-remove]').forEach((botao) => botao.addEventListener('click', () => removerItem(botao.dataset.remove)));
}

function editarItem(id, patch) {
  estado.regulagem = estado.regulagem.map((item) => item.id === id ? { ...item, ...patch } : item);
  salvarEstado(estado);
  renderDashboard();
  renderSugestoes();
}

function removerItem(id) {
  estado.regulagem = estado.regulagem.filter((item) => item.id !== id);
  persistirERenderizar();
}

function limparRegulagem() {
  if (!estado.regulagem.length) return;
  estado.regulagem = [];
  persistirERenderizar();
  mostrarToast('Regulagem limpa.');
}

function persistirERenderizar() {
  salvarEstado(estado);
  renderRegulagem();
  renderCatalogo();
  renderDashboard();
  renderSugestoes();
}

function obterTotaisPorCategoria() {
  const total = estado.regulagem.reduce((soma, item) => soma + Number(item.valor || 0), 0);
  const categorias = estado.regulagem.reduce((acc, item) => {
    acc[item.categoria] = (acc[item.categoria] || 0) + Number(item.valor || 0);
    return acc;
  }, {});
  return { total, categorias };
}

function renderDashboard() {
  const { total, categorias } = obterTotaisPorCategoria();
  const gravidade = avaliarGravidade(estado.regulagem);
  const grandeMonta = detectarGrandeMonta(estado.regulagem);

  els.totalGeral.textContent = moeda.format(total);
  els.totalItens.textContent = estado.regulagem.length;
  els.classificacao.textContent = gravidade.classificacao;
  els.score.textContent = `Score ${gravidade.score}`;
  els.alerta.classList.toggle('is-danger', grandeMonta.ativo);
  els.alerta.querySelector('strong').textContent = grandeMonta.ativo ? 'Possível grande monta' : 'Sem alerta';
  els.alerta.querySelector('small').textContent = grandeMonta.ativo ? grandeMonta.mensagem : 'Regras automáticas em tempo real';

  const fragment = document.createDocumentFragment();
  const entradas = Object.entries(categorias).sort((a, b) => b[1] - a[1]);
  if (!entradas.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'A distribuição será exibida quando houver itens na regulagem.';
    fragment.appendChild(empty);
  }
  entradas.forEach(([categoria, valor]) => {
    const percentual = total ? (valor / total) * 100 : 0;
    const row = document.createElement('div');
    row.className = 'summary-row';
    row.innerHTML = `
      <div class="summary-row__top"><strong>${CATEGORIA_LABELS[categoria]}</strong><span>${moeda.format(valor)} • ${percentual.toFixed(1)}%</span></div>
      <div class="bar"><i style="width:${percentual}%"></i></div>`;
    fragment.appendChild(row);
  });
  els.resumoCategorias.replaceChildren(fragment);
  renderGraficoRegulagem(total, categorias);
}

function renderGraficoRegulagem(total, categorias) {
  const entradas = Object.entries(categorias).sort((a, b) => b[1] - a[1]);
  const maiorValor = entradas[0]?.[1] || 0;
  const ticketMedio = estado.regulagem.length ? total / estado.regulagem.length : 0;
  els.chartMaiorCategoria.textContent = entradas[0] ? CATEGORIA_LABELS[entradas[0][0]] : '-';
  els.chartTicketMedio.textContent = moeda.format(ticketMedio);

  const fragment = document.createDocumentFragment();
  if (!entradas.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'O gráfico será montado automaticamente conforme a regulagem receber itens.';
    els.chart.replaceChildren(empty);
    return;
  }

  entradas.forEach(([categoria, valor], index) => {
    const percentualTotal = total ? (valor / total) * 100 : 0;
    const altura = maiorValor ? Math.max(12, (valor / maiorValor) * 100) : 0;
    const coluna = document.createElement('div');
    coluna.className = `chart-column ${categoria}`;
    coluna.style.setProperty('--bar-height', `${altura}%`);
    coluna.style.setProperty('--delay', `${index * 45}ms`);
    coluna.innerHTML = `
      <div class="chart-column__value">${moeda.format(valor)}</div>
      <div class="chart-column__track"><i></i></div>
      <strong>${CATEGORIA_LABELS[categoria]}</strong>
      <small>${percentualTotal.toFixed(1)}% · ${estado.regulagem.filter((item) => item.categoria === categoria).length} item(ns)</small>`;
    fragment.appendChild(coluna);
  });
  els.chart.replaceChildren(fragment);
}

function montarDadosVeiculoLegado() {
  const v = estado.veiculo || {};
  return [v.modelo, v.versao, v.ano && `ano ${v.ano}`, v.placa && `placa ${v.placa}`, v.cor && `cor ${v.cor}`, v.chassi && `chassi ${v.chassi}`]
    .filter(Boolean)
    .join(', ');
}

function renderSugestoes() {
  const sugestoes = obterSugestoesRegras(estado.regulagem, catalogo);
  const fragment = document.createDocumentFragment();
  sugestoes.forEach((regra) => {
    const box = document.createElement('div');
    box.className = 'suggestion-card';
    const botoes = regra.itens.map((item) => `<button class="btn btn-small btn-secondary" data-add="${item.codigo}">${item.nome}</button>`).join('');
    box.innerHTML = `<strong>${regra.mensagem}</strong><div>${botoes}</div>`;
    fragment.appendChild(box);
  });
  els.sugestoes.replaceChildren(fragment);
  els.sugestoes.classList.toggle('hidden', sugestoes.length === 0);
  els.sugestoes.querySelectorAll('[data-add]').forEach((botao) => botao.addEventListener('click', () => adicionarItem(botao.dataset.add)));
}

function copiarResumoWhatsapp() {
  const { total, categorias } = obterTotaisPorCategoria();
  const linhasCategorias = Object.entries(categorias).map(([cat, valor]) => `• ${CATEGORIA_LABELS[cat]}: ${moeda.format(valor)}`).join('\n');
  const veiculo = estado.veiculo;
  const dadosVeiculo = veiculo.dados || montarDadosVeiculoLegado() || '-';
  const texto = `*Regulagem Automotiva - Associação de Proteção Veicular*\n\n*Veículo:* ${dadosVeiculo}\n*Porte:* ${PORTE_LABELS[veiculo.porte || 'hatch']}\n\n*Itens:*\n${estado.regulagem.map((item) => `• ${item.descricao}: ${moeda.format(item.valor)}`).join('\n') || 'Nenhum item'}\n\n*Totais por categoria:*\n${linhasCategorias || 'Sem categorias'}\n\n*Total geral:* ${moeda.format(total)}\n*Classificação:* ${avaliarGravidade(estado.regulagem).classificacao}\n\n*Observações:* ${estado.observacoes || '-'}`;
  navigator.clipboard.writeText(texto).then(() => mostrarToast('Resumo copiado para WhatsApp.'));
}

function gerarPdf() {
  document.body.classList.add('printing');
  window.print();
  setTimeout(() => document.body.classList.remove('printing'), 500);
}

function mostrarToast(mensagem) {
  els.toast.textContent = mensagem;
  els.toast.classList.add('show');
  clearTimeout(mostrarToast.timer);
  mostrarToast.timer = setTimeout(() => els.toast.classList.remove('show'), 2800);
}

function escapeHtml(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', init);
