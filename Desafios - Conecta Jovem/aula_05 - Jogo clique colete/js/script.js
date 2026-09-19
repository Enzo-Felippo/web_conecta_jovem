/*
  script.js
    Código criado pela Profª. Dra. Karen Ribeiro (karen@ic.ufmt.br) para fins educacionais e não comerciais, sob licença CC BY-NC-SA 4.0. 
    Lógica do jogo: tempo de partida, criação/remoção de itens, pontuação.
    Como ajustar a dificuldade:
    - GAME_DURATION: tempo total (segundos).
    - SPAWN_INTERVAL: intervalo para nascer um novo item (ms).
    - ITEM_LIFETIME: quanto tempo o item fica na tela (ms).
    - ITEM_POINTS: quantos pontos cada clique vale.
*/

(() => {
  // ======= CONFIGURAÇÕES DO JOGO (fáceis de ajustar pelos estudantes) =======
  const GAME_DURATION   = 30;   // Tempo total da partida (em segundos)
  const SPAWN_INTERVAL  = 1000;  // A cada quantos ms nasce um item novo
  const ITEM_LIFETIME   = 1200; // Tempo de vida de cada item (ms) antes de desaparecer
  const ITEM_POINTS     = 1;    // Pontos por item coletado (clique)

  // ======= REFERÊNCIAS A ELEMENTOS DA PÁGINA =======
  const areaJogo    = document.getElementById('areaJogo');   // Área onde os itens aparecem
  const pontosSpan  = document.getElementById('pontos');      // Texto do placar
  const tempoSpan   = document.getElementById('tempo');       // Texto do temporizador
  const btnIniciar  = document.getElementById('btnIniciar');  // Botão para iniciar
  const btnReiniciar= document.getElementById('btnReiniciar');// Botão para reiniciar

  // ======= ESTADO DO JOGO (variáveis que mudam durante a partida) =======
  let pontos = 0;                 // Pontuação atual
  let tempoRestante = GAME_DURATION;
  let intervaloSpawnId = null;    // ID do setInterval que cria itens
  let intervaloTempoId = null;    // ID do setInterval do cronômetro
  let jogoAtivo = false;          // Flag indicando se o jogo está rodando

  // ======= FUNÇÕES DE UTILIDADE =======

  /**
   * Gera um número inteiro aleatório entre min e max (inclusive).
   */
  function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Atualiza o texto do placar na tela.
   */
  function atualizarPlacar() {
    pontosSpan.textContent = pontos;
  }

  /**
   * Atualiza o texto do tempo na tela.
   */
  function atualizarTempo() {
    tempoSpan.textContent = tempoRestante;
  }

  /**
   * Cria um novo item (div) na área de jogo, em posição aleatória,
   * com duração limitada (ITEM_LIFETIME). Se clicar, soma pontos e remove.
   */
  function criarItem() {
    // Se o jogo já acabou, não cria mais nada
    if (!jogoAtivo) return;

    // Descobre o tamanho da arena e do item para posicionar dentro dos limites
    const rect = areaJogo.getBoundingClientRect();

    // Lê o tamanho do item definido no CSS (var(--item-size))
    const itemSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--item-size')) || 64;

    // Cálculo das coordenadas máximas para o item não "vazar" pelas bordas
    const maxX = rect.width  - itemSize;
    const maxY = rect.height - itemSize;

    // Posição aleatória dentro da área
    const posX = aleatorio(0, Math.max(0, Math.floor(maxX)));
    const posY = aleatorio(0, Math.max(0, Math.floor(maxY)));

    // Cria o elemento do item
    const item = document.createElement('div');
    item.className = 'item';
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'Item coletável');

    // Posiciona o item (absolute) relativo à .area-jogo
    item.style.left = `${posX}px`;
    item.style.top  = `${posY}px`;

    // Ao clicar no item: soma pontos, remove e (opcional) dá feedback
    item.addEventListener('click', () => {
      if (!jogoAtivo) return;
      pontos += ITEM_POINTS;     // soma a pontuação configurada
      atualizarPlacar();
      item.remove();             // remove o item clicado
      // (Opcional) Efeito sonoro simples usando Web Audio / <audio> pode ser adicionado aqui.
    });

    // Adiciona o item à área de jogo
    areaJogo.appendChild(item);

    // Remove o item após ITEM_LIFETIME ms se não for clicado a tempo
    setTimeout(() => {
      if (item.isConnected) item.remove();
    }, ITEM_LIFETIME);
  }

  /**
   * Inicia o cronômetro de contagem regressiva.
   */
  function iniciarTempo() {
    atualizarTempo();
    intervaloTempoId = setInterval(() => {
      tempoRestante--;
      atualizarTempo();

      // Quando o tempo acaba, encerramos o jogo
      if (tempoRestante <= 0) {
        encerrarJogo();
      }
    }, 1000);
  }

  /**
   * Começa a gerar itens periodicamente enquanto o jogo estiver ativo.
   */
  function iniciarSpawn() {
    // Cria um item imediatamente para não demorar o primeiro
    criarItem();
    // Depois, cria novos itens a cada SPAWN_INTERVAL ms
    intervaloSpawnId = setInterval(criarItem, SPAWN_INTERVAL);
  }

  /**
   * Inicia uma partida: zera pontuação, seta tempo e liga intervalos.
   */
  function iniciarJogo() {
    if (jogoAtivo) return; // Evita iniciar duas vezes

    // Estado inicial
    jogoAtivo = true;
    pontos = 0;
    tempoRestante = GAME_DURATION;
    atualizarPlacar();
    atualizarTempo();

    // Limpa quaisquer itens remanescentes
    limparItens();

    // UI de botões
    btnIniciar.disabled = true;
    btnReiniciar.disabled = false;

    // Inicia contagem regressiva e criação de itens
    iniciarTempo();
    iniciarSpawn();

    // Acessibilidade: coloca foco na área de jogo
    areaJogo.focus();
  }

  /**
   * Encerra a partida: para intervalos, bloqueia criação de itens,
   * mantém os itens atuais (opcional) e habilita reinício.
   */
  function encerrarJogo() {
    jogoAtivo = false;

    // Para os cronômetros/intervalos
    clearInterval(intervaloTempoId);
    clearInterval(intervaloSpawnId);
    intervaloTempoId = null;
    intervaloSpawnId = null;

    // UI de botões
    btnIniciar.disabled = false;
    btnReiniciar.disabled = false;

    // (Opcional) Mostrar mensagem final
    mostrarMensagemFinal();
  }

  /**
   * Reinicia completamente: encerra e inicia novamente.
   */
  function reiniciarJogo() {
    encerrarJogo();
    iniciarJogo();
  }

  /**
   * Remove todos os itens da área de jogo (útil ao iniciar nova partida).
   */
  function limparItens() {
    areaJogo.querySelectorAll('.item').forEach(el => el.remove());
  }

  /**
   * Mostra uma mensagem simples ao final da partida (pode ser estilizada no CSS).
   */
  function mostrarMensagemFinal() {
    // Cria um pequeno "toast" dentro da área de jogo
    const msg = document.createElement('div');
    msg.textContent = `Fim! Você fez ${pontos} ponto(s).`;
    msg.style.position = 'absolute';
    msg.style.left = '50%';
    msg.style.top = '50%';
    msg.style.transform = 'translate(-50%, -50%)';
    msg.style.background = 'rgba(0,0,0,0.8)';
    msg.style.color = '#fff';
    msg.style.padding = '12px 16px';
    msg.style.borderRadius = '10px';
    msg.style.fontWeight = 'bold';
    msg.style.zIndex = '999';

    areaJogo.appendChild(msg);

    // Remove a mensagem após alguns segundos
    setTimeout(() => msg.remove(), 2200);
  }

  // ======= LIGAÇÃO DOS BOTÕES =======
  btnIniciar.addEventListener('click', iniciarJogo);
  btnReiniciar.addEventListener('click', reiniciarJogo);

  // Segurança: se navegar para fora da aba, podemos pausar (opcional)
  // document.addEventListener('visibilitychange', () => {
  //   if (document.hidden && jogoAtivo) encerrarJogo();
  // });
})();
