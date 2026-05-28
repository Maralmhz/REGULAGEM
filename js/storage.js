const STORAGE_KEY = 'regulapro_apv_estado_v1';

const estadoPadrao = {
  veiculo: { modelo: '', versao: '', ano: '', placa: '', cor: '', chassi: '', porte: 'hatch' },
  regulagem: [],
  observacoes: ''
};

function carregarEstado() {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY);
    return bruto ? { ...estadoPadrao, ...JSON.parse(bruto) } : structuredClone(estadoPadrao);
  } catch (error) {
    console.warn('Não foi possível carregar o estado salvo.', error);
    return structuredClone(estadoPadrao);
  }
}

function salvarEstado(estado) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
}

function limparEstado() {
  localStorage.removeItem(STORAGE_KEY);
}
