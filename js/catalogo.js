/* Catálogo profissional baseado em dados, sem linhas HTML manuais. */
const PORTE_LABELS = {
  hatch: 'Hatch compacto',
  sedan: 'Sedan/Hatch médio',
  suv: 'SUV/Picape leve',
  utilitario: 'Utilitário/Van'
};

const CATEGORIA_LABELS = {
  pintura: 'Pintura',
  lanternagem: 'Lanternagem',
  estrutura: 'Estrutura',
  desmontagem: 'Desmontagem/Montagem',
  mecanica: 'Mecânica',
  suspensao: 'Suspensão',
  arrefecimento: 'Arrefecimento',
  eletrica: 'Elétrica',
  airbag: 'Airbag',
  acabamento: 'Acabamento',
  vidracaria: 'Vidraçaria'
};

const multiplicadoresPorte = { hatch: 1, sedan: 1.22, suv: 1.48, utilitario: 1.78 };

const basesCatalogo = [
  { categoria: 'pintura', prefixo: 'PIN', itens: [
    ['Capô - pintura', 'frontal', 'medio', 500], ['Teto - pintura', 'superior', 'medio', 620], ['Tampa traseira - pintura', 'traseira', 'medio', 480],
    ['Para choque dianteiro - pintura', 'frontal', 'leve', 420], ['Para choque traseiro - pintura', 'traseira', 'leve', 420], ['Paralama dianteiro esquerdo - pintura', 'lateral', 'medio', 390],
    ['Paralama dianteiro direito - pintura', 'lateral', 'medio', 390], ['Porta dianteira esquerda - pintura', 'lateral', 'medio', 450], ['Porta dianteira direita - pintura', 'lateral', 'medio', 450],
    ['Porta traseira esquerda - pintura', 'lateral', 'medio', 440], ['Porta traseira direita - pintura', 'lateral', 'medio', 440], ['Retrovisor esquerdo - pintura', 'acabamento externo', 'leve', 160],
    ['Retrovisor direito - pintura', 'acabamento externo', 'leve', 160], ['Saia lateral esquerda - pintura', 'lateral inferior', 'medio', 350], ['Saia lateral direita - pintura', 'lateral inferior', 'medio', 350],
    ['Spoiler dianteiro - pintura', 'aerodinâmico', 'leve', 260], ['Spoiler traseiro - pintura', 'aerodinâmico', 'leve', 260], ['Caixa de ar esquerda - pintura', 'estrutura lateral', 'medio', 420],
    ['Caixa de ar direita - pintura', 'estrutura lateral', 'medio', 420], ['Coluna A esquerda - pintura', 'colunas', 'medio', 360], ['Coluna A direita - pintura', 'colunas', 'medio', 360],
    ['Coluna B esquerda - pintura', 'colunas', 'medio', 330], ['Coluna B direita - pintura', 'colunas', 'medio', 330], ['Coluna C esquerda - pintura', 'colunas', 'medio', 360],
    ['Coluna C direita - pintura', 'colunas', 'medio', 360], ['Lateral esquerda - pintura', 'lateral', 'forte', 850], ['Lateral direita - pintura', 'lateral', 'forte', 850],
    ['Painel traseiro - pintura', 'traseira estrutural', 'forte', 620], ['Mini frente - pintura', 'frontal estrutural', 'forte', 580], ['Alma do para choque - pintura técnica', 'reforço', 'leve', 250],
    ['Moldura paralama esquerda - pintura', 'molduras', 'leve', 180], ['Moldura paralama direita - pintura', 'molduras', 'leve', 180], ['Grade dianteira - pintura', 'frontal', 'leve', 230],
    ['Aplique de porta - pintura', 'molduras', 'leve', 170], ['Maçaneta externa - pintura', 'acabamento externo', 'leve', 120], ['Aerofólio - pintura', 'traseira', 'leve', 280],
    ['Portinhola combustível - pintura', 'lateral', 'leve', 120], ['Moldura inferior de porta - pintura', 'molduras', 'leve', 190], ['Acabamento do rack - pintura', 'superior', 'leve', 210]
  ]},
  { categoria: 'lanternagem', prefixo: 'LAN', itens: [
    ['Recuperação porta dianteira esquerda leve', 'leve', 'leve', 260], ['Recuperação porta dianteira esquerda média', 'média', 'medio', 420], ['Recuperação porta dianteira esquerda forte', 'forte', 'forte', 680],
    ['Recuperação porta dianteira direita leve', 'leve', 'leve', 260], ['Recuperação porta dianteira direita média', 'média', 'medio', 420], ['Recuperação porta dianteira direita forte', 'forte', 'forte', 680],
    ['Recuperação porta traseira esquerda leve', 'leve', 'leve', 250], ['Recuperação porta traseira esquerda média', 'média', 'medio', 400], ['Recuperação porta traseira esquerda forte', 'forte', 'forte', 650],
    ['Recuperação porta traseira direita leve', 'leve', 'leve', 250], ['Recuperação porta traseira direita média', 'média', 'medio', 400], ['Recuperação porta traseira direita forte', 'forte', 'forte', 650],
    ['Recuperação lateral esquerda leve', 'leve', 'leve', 380], ['Recuperação lateral esquerda média', 'média', 'medio', 620], ['Recuperação lateral esquerda forte', 'forte', 'forte', 980],
    ['Recuperação lateral direita leve', 'leve', 'leve', 380], ['Recuperação lateral direita média', 'média', 'medio', 620], ['Recuperação lateral direita forte', 'forte', 'forte', 980],
    ['Recuperação teto leve', 'superior', 'leve', 420], ['Recuperação teto média', 'superior', 'medio', 720], ['Recuperação teto forte', 'superior', 'forte', 1150],
    ['Recuperação caixa de roda dianteira', 'caixa de roda', 'medio', 520], ['Recuperação caixa de roda traseira', 'caixa de roda', 'medio', 560], ['Alinhamento frontal', 'alinhamento', 'medio', 480],
    ['Alinhamento traseiro', 'alinhamento', 'medio', 460], ['Reparo estrutural lateral', 'estrutural', 'estrutural', 1200], ['Puxamento em bancada frontal', 'estrutural', 'estrutural', 1450],
    ['Puxamento em bancada traseiro', 'estrutural', 'estrutural', 1380], ['Longarina dianteira - reparo', 'estrutural', 'estrutural', 1500], ['Longarina traseira - reparo', 'estrutural', 'estrutural', 1420],
    ['Painel frontal - recuperação', 'estrutural', 'estrutural', 980], ['Painel traseiro - recuperação', 'estrutural', 'estrutural', 940], ['Agregado - alinhamento alojamento', 'estrutural', 'estrutural', 900],
    ['Túnel central - reparo', 'assoalho', 'estrutural', 1250], ['Assoalho dianteiro - reparo', 'assoalho', 'forte', 960], ['Assoalho traseiro - reparo', 'assoalho', 'forte', 920],
    ['Caixa de ar - recuperação estrutural', 'estrutural', 'estrutural', 1180], ['Coluna A - reparo estrutural', 'estrutural', 'estrutural', 1300], ['Coluna B - reparo estrutural', 'estrutural', 'estrutural', 1320],
    ['Coluna C - reparo estrutural', 'estrutural', 'estrutural', 1200]
  ]},
  { categoria: 'desmontagem', prefixo: 'DES', itens: [
    ['Desmontagem frontal parcial', 'frontal', 'leve', 220], ['Desmontagem frontal completa', 'frontal', 'medio', 420], ['Montagem frontal completa', 'frontal', 'medio', 430],
    ['Desmontagem traseira parcial', 'traseira', 'leve', 210], ['Desmontagem traseira completa', 'traseira', 'medio', 390], ['Montagem traseira completa', 'traseira', 'medio', 400],
    ['Desmontagem lateral esquerda', 'lateral', 'medio', 340], ['Desmontagem lateral direita', 'lateral', 'medio', 340], ['Desmontagem portas lado esquerdo', 'portas', 'medio', 300],
    ['Desmontagem portas lado direito', 'portas', 'medio', 300], ['Montagem portas lado esquerdo', 'portas', 'medio', 310], ['Montagem portas lado direito', 'portas', 'medio', 310],
    ['Desmontagem faróis', 'iluminação', 'leve', 160], ['Montagem faróis', 'iluminação', 'leve', 160], ['Desmontagem lanternas', 'iluminação', 'leve', 150],
    ['Desmontagem painel interno', 'interior', 'forte', 650], ['Montagem painel interno', 'interior', 'forte', 680], ['Desmontagem suspensão dianteira', 'suspensão', 'medio', 380],
    ['Montagem suspensão dianteira', 'suspensão', 'medio', 390], ['Desmontagem suspensão traseira', 'suspensão', 'medio', 360], ['Montagem suspensão traseira', 'suspensão', 'medio', 370],
    ['Montagem completa pós-reparo', 'geral', 'forte', 980], ['Desmontagem acabamento interno', 'interior', 'medio', 300], ['Montagem acabamento interno', 'interior', 'medio', 320],
    ['Desmontagem mecânica frontal', 'mecânica', 'forte', 580], ['Montagem mecânica frontal', 'mecânica', 'forte', 600], ['Desmontagem conjunto radiador', 'arrefecimento', 'medio', 280]
  ]},
  { categoria: 'mecanica', prefixo: 'MEC', itens: [
    ['Radiador - substituir', 'arrefecimento', 'medio', 520], ['Condensador - substituir', 'ar condicionado', 'medio', 480], ['Eletroventilador - substituir', 'arrefecimento', 'medio', 420],
    ['Bandeja dianteira esquerda - substituir', 'suspensão', 'medio', 360], ['Bandeja dianteira direita - substituir', 'suspensão', 'medio', 360], ['Pivô de suspensão - substituir', 'suspensão', 'leve', 190],
    ['Amortecedor dianteiro - substituir par', 'suspensão', 'medio', 520], ['Amortecedor traseiro - substituir par', 'suspensão', 'medio', 480], ['Caixa de direção - substituir', 'direção', 'forte', 950],
    ['Agregado dianteiro - substituir', 'estrutura mecânica', 'forte', 1100], ['Semi eixo esquerdo - substituir', 'transmissão', 'medio', 430], ['Semi eixo direito - substituir', 'transmissão', 'medio', 430],
    ['Sistema de freio - revisão colisão', 'freio', 'medio', 360], ['Disco de freio - substituir par', 'freio', 'leve', 260], ['Pastilha de freio - substituir jogo', 'freio', 'leve', 180],
    ['Compressor de ar - substituir', 'ar condicionado', 'forte', 820], ['Motor - remoção para acesso', 'motor', 'forte', 1600], ['Cárter - substituir', 'motor', 'medio', 420],
    ['Correias auxiliares - substituir', 'motor', 'leve', 240], ['Coxim motor - substituir', 'motor', 'medio', 380], ['Coxim câmbio - substituir', 'transmissão', 'medio', 360],
    ['Alinhamento e geometria', 'rodagem', 'leve', 160], ['Balanceamento rodas', 'rodagem', 'leve', 140], ['Mangueira arrefecimento - substituir', 'arrefecimento', 'leve', 180],
    ['Reservatório expansão - substituir', 'arrefecimento', 'leve', 190], ['Suporte radiador - substituir', 'arrefecimento', 'medio', 360], ['Carga gás ar condicionado', 'ar condicionado', 'leve', 260]
  ]},
  { categoria: 'eletrica', prefixo: 'ELE', itens: [
    ['Chicote frontal - reparo', 'chicote', 'medio', 480], ['Chicote traseiro - reparo', 'chicote', 'medio', 430], ['Chicote porta - reparo', 'chicote', 'leve', 260],
    ['Módulo eletrônico - diagnóstico', 'módulo', 'medio', 360], ['Módulo eletrônico - substituir/configurar', 'módulo', 'forte', 780], ['Sensor estacionamento - substituir', 'sensores', 'leve', 190],
    ['Sensor impacto - substituir', 'sensores', 'medio', 320], ['Sensor ABS - substituir', 'sensores', 'leve', 220], ['Scanner completo pós-colisão', 'diagnóstico', 'leve', 220],
    ['Reparo elétrico iluminação frontal', 'iluminação', 'leve', 260], ['Reparo elétrico iluminação traseira', 'iluminação', 'leve', 240], ['Regulagem faróis eletrônica', 'iluminação', 'leve', 160]
  ]},
  { categoria: 'airbag', prefixo: 'AIR', itens: [
    ['Bolsa airbag motorista - substituir', 'segurança', 'forte', 1250], ['Bolsa airbag passageiro - substituir', 'segurança', 'forte', 1450], ['Módulo airbag - substituir', 'módulo', 'forte', 980],
    ['Pré tensor cinto esquerdo - substituir', 'cintos', 'forte', 620], ['Pré tensor cinto direito - substituir', 'cintos', 'forte', 620], ['Reset módulo airbag', 'módulo', 'medio', 420],
    ['Cinta airbag volante - substituir', 'segurança', 'medio', 380], ['Sensor satélite airbag - substituir', 'sensores', 'medio', 360]
  ]},
  { categoria: 'vidracaria', prefixo: 'VID', itens: [
    ['Parabrisa - substituir', 'vidros', 'medio', 780], ['Vidro lateral dianteiro esquerdo - substituir', 'vidros', 'leve', 360], ['Vidro lateral dianteiro direito - substituir', 'vidros', 'leve', 360],
    ['Vidro lateral traseiro esquerdo - substituir', 'vidros', 'leve', 340], ['Vidro lateral traseiro direito - substituir', 'vidros', 'leve', 340], ['Vigia traseiro - substituir', 'vidros', 'medio', 690],
    ['Máquina vidro dianteira esquerda - substituir', 'mecanismo', 'medio', 420], ['Máquina vidro dianteira direita - substituir', 'mecanismo', 'medio', 420], ['Máquina vidro traseira - substituir', 'mecanismo', 'medio', 390],
    ['Canaleta vidro - substituir', 'acabamento vidro', 'leve', 180]
  ]},
  { categoria: 'acabamento', prefixo: 'ACA', itens: [
    ['Grampos diversos - kit', 'fixação', 'leve', 90], ['Presilhas para-choque - kit', 'fixação', 'leve', 120], ['Acabamento interno porta dianteira', 'interno', 'leve', 220],
    ['Acabamento interno porta traseira', 'interno', 'leve', 210], ['Carpete assoalho - substituir', 'interno', 'medio', 520], ['Forro teto - substituir', 'interno', 'medio', 620],
    ['Moldura painel - substituir', 'interno', 'leve', 260], ['Moldura caixa de roda - substituir', 'externo', 'leve', 230], ['Parabarro dianteiro - substituir', 'externo', 'leve', 220],
    ['Parabarro traseiro - substituir', 'externo', 'leve', 210], ['Defletor inferior - substituir', 'externo', 'leve', 190], ['Friso lateral - substituir', 'externo', 'leve', 180]
  ]},
  { categoria: 'suspensao', prefixo: 'SUS', itens: [
    ['Manga de eixo esquerda - substituir', 'dianteira', 'medio', 480], ['Manga de eixo direita - substituir', 'dianteira', 'medio', 480], ['Terminal direção - substituir', 'direção', 'leve', 180],
    ['Barra estabilizadora - substituir', 'dianteira', 'medio', 360], ['Bieleta estabilizadora - substituir par', 'dianteira', 'leve', 220], ['Eixo traseiro - substituir', 'traseira', 'forte', 980],
    ['Cubo de roda - substituir', 'rodagem', 'medio', 360], ['Rolamento roda - substituir', 'rodagem', 'medio', 340]
  ]},
  { categoria: 'arrefecimento', prefixo: 'ARR', itens: [
    ['Aditivo e sangria do sistema', 'fluido', 'leve', 160], ['Tubulação arrefecimento - reparar', 'tubulação', 'leve', 210], ['Defletor radiador - substituir', 'defletores', 'leve', 180],
    ['Intercooler - substituir', 'turbo', 'medio', 620], ['Ventoinha auxiliar - substituir', 'ventilação', 'medio', 390], ['Teste estanqueidade arrefecimento', 'diagnóstico', 'leve', 140]
  ]},
  { categoria: 'estrutura', prefixo: 'EST', itens: [
    ['Substituição longarina dianteira esquerda', 'frontal', 'estrutural', 2200], ['Substituição longarina dianteira direita', 'frontal', 'estrutural', 2200], ['Substituição painel frontal', 'frontal', 'estrutural', 1650],
    ['Substituição painel traseiro', 'traseira', 'estrutural', 1550], ['Substituição caixa de ar esquerda', 'lateral', 'estrutural', 1750], ['Substituição caixa de ar direita', 'lateral', 'estrutural', 1750],
    ['Substituição coluna A', 'colunas', 'estrutural', 2100], ['Substituição coluna B', 'colunas', 'estrutural', 2250], ['Substituição coluna C', 'colunas', 'estrutural', 1950],
    ['Bancada estrutural com medição', 'bancada', 'estrutural', 1850], ['Medição eletrônica de carroceria', 'bancada', 'estrutural', 980], ['Reforço assoalho estrutural', 'assoalho', 'estrutural', 1500]
  ]}
];

const catalogo = basesCatalogo.flatMap((grupo) => grupo.itens.map((item, index) => {
  const [nome, subcategoria, severidade, base] = item;
  return {
    codigo: `${grupo.prefixo}${String(index + 1).padStart(3, '0')}`,
    nome,
    categoria: grupo.categoria,
    subcategoria,
    severidade,
    valores: Object.fromEntries(Object.entries(multiplicadoresPorte).map(([porte, mult]) => [porte, Math.round(base * mult / 10) * 10]))
  };
}));
