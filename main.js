// --- INÍCIO: Modificações para localStorage ---

// Tenta carregar ocorrências salvas do localStorage
function carregarOcorrenciasSalvas() {
  const dadosSalvos = localStorage.getItem('serpal_ocorrencias');
  if (dadosSalvos) {
    return JSON.parse(dadosSalvos);
  }
  return []; // Retorna array vazio se nada for encontrado
}

// Salva a lista atual de ocorrências no localStorage
function salvarOcorrencias(ocorrencias) {
  localStorage.setItem('serpal_ocorrencias', JSON.stringify(ocorrencias));
}

// --- FIM: Modificações para localStorage ---

// Constante global 'ocorrencias' agora é carregada do localStorage
const ocorrencias = carregarOcorrenciasSalvas();

const btnAdicionar = document.getElementById('btnAdicionar');
const tbodyOcorrencias = document.getElementById('tbodyOcorrencias');
const tabelaOcorrencias = document.getElementById('tabelaOcorrencias');
const tableWrapper = document.getElementById('tableWrapper');
const semOcorrenciasMsg = document.getElementById('semOcorrenciasMsg');
const totalOcorrenciasSpan = document.getElementById('totalOcorrencias');
const setorDestaqueSpan = document.getElementById('setorDestaque');
const maiorRiscoSpan = document.getElementById('maiorRisco');
const resumoTecnicoDiv = document.getElementById('resumoTecnico');

function gravidadeBadge(gravidade) {
  switch (gravidade) {
    case 'Baixo':
      return '<span class="badge badge-green">🟢 Baixo</span>';
    case 'Médio':
      return '<span class="badge badge-yellow">🟡 Médio</span>';
    case 'Alto':
      return '<span class="badge badge-orange">🟠 Alto</span>';
    case 'Crítico':
      return '<span class="badge badge-red">🔴 Crítico</span>';
    default:
      return '<span class="badge badge-yellow">-</span>';
  }
}

function compararGravidade(g1, g2) {
  const pesos = { 'Baixo': 1, 'Médio': 2, 'Alto': 3, 'Crítico': 4 };
  return (pesos[g1] || 0) - (pesos[g2] || 0);
}

function atualizarDashboard() {
  const total = ocorrencias.length;
  totalOcorrenciasSpan.textContent = total;

  if (total === 0) {
    setorDestaqueSpan.textContent = '-';
    maiorRiscoSpan.textContent = '-';
    tabelaOcorrencias.style.display = 'none';
    tableWrapper.style.display = 'none';
    semOcorrenciasMsg.style.display = 'block';
    return;
  }

  const contagemPorSetor = {};
  let setorDestaque = '';
  let maiorQtde = 0;
  let maiorGravidade = null;

  ocorrencias.forEach(o => {
    contagemPorSetor[o.setor] = (contagemPorSetor[o.setor] || 0) + 1;
    if (contagemPorSetor[o.setor] > maiorQtde) {
      maiorQtde = contagemPorSetor[o.setor];
      setorDestaque = o.setor;
    }
    if (!maiorGravidade || compararGravidade(o.gravidade, maiorGravidade) > 0) {
      maiorGravidade = o.gravidade;
    }
  });

  setorDestaqueSpan.textContent = setorDestaque || '-';
  maiorRiscoSpan.innerHTML = gravidadeBadge(maiorGravidade);

  tabelaOcorrencias.style.display = 'table';
  tableWrapper.style.display = 'block';
  semOcorrenciasMsg.style.display = 'none';
}

function limparSelecaoTabela() {
  [...tbodyOcorrencias.querySelectorAll('tr')].forEach(tr => {
    tr.classList.remove('selected');
  });
}

function gerarResumoTecnico(ocorrencia) {
  const data = ocorrencia.data || 'não informado';
  const filial = ocorrencia.filial || 'não informada';

  const diagnostico = `Foi registrada uma ocorrência no setor de ${ocorrencia.setor}, classificada como "${ocorrencia.tipo}" com gravidade ${ocorrencia.gravidade}. ` +
    `A descrição informada foi: "${ocorrencia.descricao || 'sem detalhamento'}". A filial envolvida é ${filial}, com data da ocorrência ${data}.`;

  let causas = [];
  if (ocorrencia.setor === 'Estoque') {
    if (ocorrencia.tipo.includes('Separação errada')) {
      causas = [
        'Falta de conferência dupla na separação dos itens.',
        'Layout ou endereçamento do estoque confuso, dificultando a identificação correta do produto.',
        'Pressão por tempo na preparação dos pedidos, reduzindo o cuidado na conferência.',
        'Possível falha de comunicação entre vendas e estoque sobre o item exato solicitado.'
      ];
    } else if (ocorrencia.tipo.includes('Produto com defeito')) {
      causas = [
        'Falha na inspeção visual do produto no recebimento.',
        'Defeito de fabricação não identificado no processo de entrada.',
        'Ausência de política estruturada de testes ou amostragem.',
        'Armazenagem inadequada, podendo causar danos ao produto.'
      ];
    } else if (ocorrencia.tipo.includes('Código do produto errado')) {
      causas = [
        'Erro de cadastro no sistema (código e descrição divergentes).',
        'Etiqueta física divergente do cadastro interno.',
        'Migração de dados sem validação dos códigos.',
        'Falta de padroniiação na criação de novos produtos.'
      ];
    } else if (ocorrencia.tipo.includes('Entrega errada de filial')) {
      causas = [
        'Conferência insuficiente do destino no momento da expedição.',
        'Etiquetagem dos volumes sem identificação clara da filial.',
        'Escolha incorreta da filial no sistema na emissão do pedido.',
        'Falta de integração entre estoque e logística na validação de rotas.'
      ];
    }
  }

  if (causas.length === 0) {
    causas = [
      'Falha de procedimento em alguma etapa do processo.',
      'Ausência ou não cumprimento de checklist operacional.',
      'Comunicação incompleta entre as áreas envolvidas.',
      'Falta de treinamento específico sobre o fluxo correto.'
    ];
  }

  const acoesCorretivas = [
    'Registrar formalmente a ocorrência no controle interno de não conformidades.',
    'Verificar imediatamente o impacto no cliente ou filial e realizar os ajustes necessários.',
    'Rever o pedido, nota fiscal e movimentações de estoque relacionadas à ocorrência.',
    'Comunicar os responsáveis do setor para ciência e correção pontual do problema.'
  ];

  const acoesPreventivas = [
    'Revisar e reforçar o procedimento operacional padrão (POP) do setor.',
    'Implantar ou atualizar checklists de conferência nas etapas críticas.',
    'Promover treinamento rápido com a equipe diretamente envolvida.',
    'Avaliar necessidade de melhoria de sistema (campos obrigatórios, travas, alertas).'
  ];

  const indicadores = [
    'Número de ocorrências por tipo e por setor (semanal/mensal).',
    'Percentual de pedidos com retrabalho por erro de processo.',
    'Tempo médio de correção das ocorrências.',
    'Índice de reincidência do mesmo tipo de desvio.'
  ];

  const responsavelSugerido =
    ocorrencia.setor === 'Estoque'
      ? 'Encarregado / Coordenador de Estoque'
      : 'Gestor responsável pelo setor da ocorrência';

  resumoTecnicoDiv.innerHTML = `
    <h3>Resumo técnico da ocorrência selecionada</h3>
    <p class="small-muted">Resumo gerado automaticamente com base nos dados informados e na lógica de risco definida para a Serpal.</p>

    <p><strong>Setor:</strong> ${ocorrencia.setor || '-'}<br>
    <strong>Ocorrência:</strong> ${ocorrencia.tipo || '-'}<br>
    <strong>Gravidade:</strong> ${gravidadeBadge(ocorrencia.gravidade)}<br>
    <strong>Filial impactada:</strong> ${filial}<br>
    <strong>Data da ocorrência:</strong> ${data}<br>
    <strong>Responsável informado:</strong> ${ocorrencia.responsavel || 'não informado'}</p>

    <h4>1. Diagnóstico rápido</h4>
    <p>${diagnostico}</p>

    <h4>2. Causas prováveis</h4>
    <ul>
      ${causas.map(c => `<li>${c}</li>`).join('')}
    </ul>

    <h4>3. Ação corretiva imediata (recomendada)</h4>
    <ul>
      ${acoesCorretivas.map(a => `<li>${a}</li>`).join('')}
    </ul>

    <h4>4. Ações preventivas sugeridas</h4>
    <ul>
      ${acoesPreventivas.map(a => `<li>${a}</li>`).join('')}
    </ul>

    <h4>5. Indicadores para acompanhamento</h4>
    <ul>
      ${indicadores.map(i => `<li>${i}</li>`).join('')}
    </ul>

    <h4>6. Próximos passos e responsáveis</h4>
    <p>
      <strong>Responsável sugerido:</strong> ${responsavelSugerido}<br>
      <strong>Prazo recomendado:</strong> até 24h para correção e registro da ocorrência.<br>
      <strong>Status recomendado:</strong> Em acompanhamento até validação da correção.
    </p>
  `;
}

// --- INÍCIO: Modificação para renderizar linha da tabela ---
// Separei a lógica de criar a linha da tabela em uma função
// para poder usá-la tanto ao adicionar UMA nova, quanto ao carregar TODAS.
function criarLinhaTabela(ocorrencia) {
  const tr = document.createElement('tr');
  tr.dataset.id = ocorrencia.id;
  tr.innerHTML = `
    <td>${String(ocorrencia.id).padStart(2, '0')}</td>
    <td><span class="pill-setor">${ocorrencia.setor}</span></td>
    <td>${ocorrencia.tipo}</td>
    <td>${gravidadeBadge(ocorrencia.gravidade)}</td>
    <td>${ocorrencia.filial || '-'}</td>
  `;

  tr.addEventListener('click', () => {
    limparSelecaoTabela();
    tr.classList.add('selected');
    gerarResumoTecnico(ocorrencia);
  });

  return tr;
}
// --- FIM: Modificação para renderizar linha da tabela ---


btnAdicionar.addEventListener('click', () => {
  const setor = document.getElementById('setor').value;
  const filial = document.getElementById('filial').value.trim();
  const data = document.getElementById('data').value;
  const responsavel = document.getElementById('responsavel').value.trim();
  const tipo = document.getElementById('tipo').value;
  const gravidade = document.getElementById('gravidade').value;
  const descricao = document.getElementById('descricao').value.trim();

  if (!setor || !tipo || !gravidade || !descricao) {
    alert('Preencha pelo menos: Setor, Tipo de ocorrência, Gravidade e Descrição.');
    return;
  }

  // Modificado para pegar o ID com base no tamanho atual do array
  const id = (ocorrencias.length > 0 ? Math.max(...ocorrencias.map(o => o.id)) : 0) + 1;
  
  const novaOcorrencia = {
    id,
    setor,
    filial,
    data,
    responsavel,
    tipo,
    gravidade,
    descricao
  };

  ocorrencias.push(novaOcorrencia);

  const tr = criarLinhaTabela(novaOcorrencia); // Usa a nova função
  tbodyOcorrencias.appendChild(tr);

  atualizarDashboard();

  // --- INÍCIO: Modificação para salvar no localStorage ---
  salvarOcorrencias(ocorrencias);
  // --- FIM: Modificação para salvar no localStorage ---

  document.getElementById('tipo').value = '';
  document.getElementById('gravidade').value = '';
  document.getElementById('descricao').value = '';
});

// --- INÍCIO: Modificação para carregar dados ao iniciar ---
// Esta função é executada quando a página termina de carregar
document.addEventListener('DOMContentLoaded', () => {
  if (ocorrencias.length > 0) {
    // Se carregou ocorrências, limpa a tabela (caso haja algo)
    tbodyOcorrencias.innerHTML = ''; 
    // Adiciona todas as ocorrências salvas na tabela
    ocorrencias.forEach(ocorrencia => {
      const tr = criarLinhaTabela(ocorrencia);
      tbodyOcorrencias.appendChild(tr);
    });
  }
  // Atualiza os contadores do dashboard
  atualizarDashboard();
});
// --- FIM: Modificação para carregar dados ao iniciar ---