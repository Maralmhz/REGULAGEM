const regrasAutomaticas = [
  {
    id: 'frontal-para-choque',
    gatilhos: ['para choque dianteiro', 'para-choque dianteiro'],
    sugestoes: ['DES001', 'DES003', 'DES013', 'DES014'],
    mensagem: 'Para serviço em para-choque dianteiro, avalie desmontagem/montagem frontal e faróis.'
  },
  {
    id: 'traseira-para-choque',
    gatilhos: ['para choque traseiro', 'para-choque traseiro'],
    sugestoes: ['DES004', 'DES006', 'DES015'],
    mensagem: 'Para serviço em para-choque traseiro, avalie desmontagem/montagem traseira e lanternas.'
  },
  {
    id: 'porta',
    gatilhos: ['porta'],
    sugestoes: ['DES009', 'DES010', 'ACA003', 'ACA004'],
    mensagem: 'Serviços em portas podem exigir desmontagem de forração, acabamentos e regulagem de vidros.'
  },
  {
    id: 'airbag',
    gatilhos: ['airbag', 'pré tensor', 'pre tensor'],
    sugestoes: ['AIR003', 'AIR006', 'ELE009'],
    mensagem: 'Itens de airbag exigem scanner, avaliação de pré-tensores e módulo de segurança.'
  },
  {
    id: 'arrefecimento-frontal',
    gatilhos: ['radiador', 'condensador', 'eletroventilador'],
    sugestoes: ['DES027', 'ARR001', 'ARR006'],
    mensagem: 'Dano no conjunto frontal pode exigir desmontagem do conjunto radiador, sangria e teste de estanqueidade.'
  }
];

const regrasGrandeMonta = {
  termosCriticos: ['longarina', 'agregado', 'painel frontal', 'coluna a', 'coluna b', 'túnel', 'tunel', 'assoalho estrutural'],
  quantidadeMinima: 2,
  mensagem: 'POSSÍVEL GRANDE MONTA: há combinação de componentes estruturais críticos.'
};

const pontosGravidade = {
  pintura: 1,
  lanternagem: 2,
  desmontagem: 1,
  mecanica: 2,
  suspensao: 2,
  arrefecimento: 1,
  eletrica: 1,
  airbag: 4,
  acabamento: 1,
  vidracaria: 1,
  estrutura: 5
};

function avaliarGravidade(itens) {
  const score = itens.reduce((total, item) => {
    const bonusSeveridade = item.severidade === 'estrutural' ? 3 : item.severidade === 'forte' ? 2 : 0;
    return total + (pontosGravidade[item.categoria] || 1) + bonusSeveridade;
  }, 0);

  if (score >= 28) return { score, classificacao: 'Grande monta', nivel: 'danger' };
  if (score >= 12) return { score, classificacao: 'Média monta', nivel: 'warning' };
  return { score, classificacao: 'Pequena monta', nivel: 'success' };
}

function obterSugestoesRegras(itens, catalogoCompleto) {
  const nomes = itens.map((item) => item.descricao.toLowerCase()).join(' | ');
  const existentes = new Set(itens.map((item) => item.codigo));
  return regrasAutomaticas
    .filter((regra) => regra.gatilhos.some((gatilho) => nomes.includes(gatilho)))
    .map((regra) => ({
      ...regra,
      itens: regra.sugestoes
        .map((codigo) => catalogoCompleto.find((servico) => servico.codigo === codigo))
        .filter((servico) => servico && !existentes.has(servico.codigo))
    }))
    .filter((regra) => regra.itens.length);
}

function detectarGrandeMonta(itens) {
  const texto = itens.map((item) => item.descricao.toLowerCase()).join(' | ');
  const encontrados = regrasGrandeMonta.termosCriticos.filter((termo) => texto.includes(termo));
  const estruturais = itens.filter((item) => item.severidade === 'estrutural' || item.categoria === 'estrutura').length;
  return {
    ativo: encontrados.length >= regrasGrandeMonta.quantidadeMinima || estruturais >= 2,
    encontrados,
    mensagem: regrasGrandeMonta.mensagem
  };
}
