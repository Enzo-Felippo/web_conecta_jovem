/*
  snake.js
  Lógica do Jogo da Cobrinha (Snake).

  Como funciona (resumo):
  - O tabuleiro é uma grade (grid) desenhada no canvas.
  - A cobrinha é uma lista de "partes" (cada parte é uma célula da grade).
  - A cada "tick" do jogo, a cobrinha anda 1 célula na direção atual.
  - Se encostar na comida, cresce e ganha pontos.
  - Se bater na parede ou em si mesma: Game Over.

  Controles:
  - Setas do teclado (↑ ↓ ← →)
  - Ou W A S D
*/

(() => {
  // =========================
  // 1) CONFIGURAÇÕES FÁCEIS
  // =========================

  const TAMANHO_CELULA = 24;      // Tamanho de cada "quadradinho" do tabuleiro (px)
  const VELOCIDADE_MS = 120;      // Quanto menor, mais rápido (ms por passo)
  const PONTOS_POR_COMIDA = 1;    // Pontos ganhos por cada comida

  // =========================
  // 2) PEGANDO ELEMENTOS DO HTML
  // =========================

  const canvas = document.getElementById("tela");         // Canvas (tabuleiro)
  const ctx = canvas.getContext("2d");                    // "Pincel" do canvas 2D

  const pontosSpan = document.getElementById("pontos");   // Texto de pontos
  const melhorSpan = document.getElementById("melhor");   // Texto de melhor pontuação
  const mensagemP = document.getElementById("mensagem");  // Mensagens (game over etc.)

  const btnIniciar = document.getElementById("btnIniciar");     // Botão iniciar/pausar
  const btnReiniciar = document.getElementById("btnReiniciar"); // Botão reiniciar

  // =========================
  // 3) TAMANHO DO TABULEIRO EM "CÉLULAS"
  // =========================
  // Ex.: canvas 480px e célula 24px -> 20 colunas (480/24) e 20 linhas (480/24)

  const COLUNAS = Math.floor(canvas.width / TAMANHO_CELULA);
  const LINHAS = Math.floor(canvas.height / TAMANHO_CELULA);

  // =========================
  // 4) ESTADO DO JOGO (VARIÁVEIS QUE MUDAM)
  // =========================

  let cobrinha = [];              // Array de partes: [{x, y}, {x, y}, ...]
  let direcao = { x: 1, y: 0 };   // Direção atual (começa indo para a direita)
  let proximaDirecao = { x: 1, y: 0 }; // Direção “pedida” pelo teclado (aplicada no próximo passo)

  let comida = { x: 10, y: 10 };  // Posição da comida (vai ser sorteada)

  let pontos = 0;                 // Pontuação atual
  let melhor = 0;                 // Melhor pontuação (vamos guardar no localStorage)

  let jogoAtivo = false;          // Se está rodando
  let timerId = null;             // ID do setInterval (para pausar/retomar)

  // =========================
  // 5) FUNÇÕES UTILITÁRIAS
  // =========================

  // Retorna um número inteiro aleatório entre 0 e max-1
  function inteiroAleatorio(max) {
    return Math.floor(Math.random() * max);
  }

  // Verifica se (x,y) está em alguma parte da cobrinha
  function posicaoOcupadaPelaCobrinha(x, y) {
    return cobrinha.some((parte) => parte.x === x && parte.y === y);
  }

  // Sorteia uma posição de comida que NÃO fique em cima da cobrinha
  function sortearComida() {
    let x, y;

    do {
      x = inteiroAleatorio(COLUNAS);
      y = inteiroAleatorio(LINHAS);
    } while (posicaoOcupadaPelaCobrinha(x, y)); // repete se cair em cima da cobrinha

    comida = { x, y };
  }

  // Atualiza textos de placar
  function atualizarPlacar() {
    pontosSpan.textContent = String(pontos);
    melhorSpan.textContent = String(melhor);
  }

  // Limpa mensagem (ou escreve uma mensagem)
  function setMensagem(texto) {
    mensagemP.textContent = texto;
  }

  // =========================
  // 6) DESENHO NO CANVAS
  // =========================

  // Desenha um quadrado na célula (x,y) com a cor informada
  function desenharCelula(x, y, cor) {
    // Converte "células" em pixels:
    const px = x * TAMANHO_CELULA;
    const py = y * TAMANHO_CELULA;

    // Preenche o quadrado
    ctx.fillStyle = cor;
    ctx.fillRect(px, py, TAMANHO_CELULA, TAMANHO_CELULA);

    // Desenha uma borda leve para dar efeito de grade
    ctx.strokeStyle = "rgba(0,0,0,0.08)";
    ctx.strokeRect(px, py, TAMANHO_CELULA, TAMANHO_CELULA);
  }

  // Desenha o tabuleiro inteiro
  function desenhar() {
    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // (Opcional) pinta um fundo suave (pode comentar se quiser)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenha a comida
    desenharCelula(comida.x, comida.y, "#ff5252"); // vermelho

    // Desenha a cobrinha
    cobrinha.forEach((parte, indice) => {
      // Cabeça mais escura, corpo mais claro
      const cor = indice === 0 ? "#1a237e" : "#4c6ef5";
      desenharCelula(parte.x, parte.y, cor);
    });
  }

  // =========================
  // 7) REGRAS DO JOGO (MOVIMENTO / COLISÕES)
  // =========================

  function passoDoJogo() {
    // Aplica a próxima direção (evita “virar duas vezes” no mesmo frame)
    direcao = { ...proximaDirecao };

    // Pega a cabeça atual da cobrinha
    const cabeca = cobrinha[0];

    // Calcula a nova cabeça (andando 1 célula)
    const novaCabeca = {
      x: cabeca.x + direcao.x,
      y: cabeca.y + direcao.y,
    };

    // 1) COLISÃO COM PAREDE
    const bateuNaParede =
      novaCabeca.x < 0 ||
      novaCabeca.x >= COLUNAS ||
      novaCabeca.y < 0 ||
      novaCabeca.y >= LINHAS;

    if (bateuNaParede) {
      terminarJogo("💥 Game Over! Você bateu na parede.");
      return;
    }

    // 2) COLISÃO COM O PRÓPRIO CORPO
    // (Se a nova cabeça cair em uma célula já ocupada pela cobrinha -> game over)
    const bateuNoCorpo = posicaoOcupadaPelaCobrinha(novaCabeca.x, novaCabeca.y);
    if (bateuNoCorpo) {
      terminarJogo("💥 Game Over! Você bateu em você mesmo(a).");
      return;
    }

    // Coloca a nova cabeça no começo do array (a cobrinha “anda”)
    cobrinha.unshift(novaCabeca);

    // 3) COMEU A COMIDA?
    const comeu = novaCabeca.x === comida.x && novaCabeca.y === comida.y;

    if (comeu) {
      // Ganha pontos
      pontos += PONTOS_POR_COMIDA;

      // Atualiza melhor pontuação (e salva)
      if (pontos > melhor) {
        melhor = pontos;
        salvarMelhorPontuacao();
      }

      // Sorteia nova comida
      sortearComida();
    } else {
      // Se NÃO comeu, remove a última parte para manter o tamanho
      cobrinha.pop();
    }

    // Atualiza placar e redesenha
    atualizarPlacar();
    desenhar();
  }

  // =========================
  // 8) CONTROLES: INICIAR / PAUSAR / REINICIAR
  // =========================

  function iniciar() {
    // Evita iniciar duas vezes
    if (jogoAtivo) return;

    jogoAtivo = true;

    // Atualiza botões
    btnIniciar.textContent = "⏸️ Pausar";
    btnReiniciar.disabled = false;

    // Inicia o loop do jogo (um passo a cada VELOCIDADE_MS)
    timerId = setInterval(passoDoJogo, VELOCIDADE_MS);

    // Limpa mensagens
    setMensagem("");
  }

  function pausar() {
    // Se não estiver ativo, não faz nada
    if (!jogoAtivo) return;

    jogoAtivo = false;

    // Para o loop
    clearInterval(timerId);
    timerId = null;

    // Atualiza botão
    btnIniciar.textContent = "▶️ Continuar";
    setMensagem("⏸️ Pausado.");
  }

  function alternarIniciarPausar() {
    // Se está ativo, pausa; se está parado, inicia
    if (jogoAtivo) {
      pausar();
    } else {
      iniciar();
    }
  }

  function reiniciar() {
    // Sempre para antes de reiniciar
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }

    jogoAtivo = false;

    // Zera pontuação e direção
    pontos = 0;
    direcao = { x: 1, y: 0 };
    proximaDirecao = { x: 1, y: 0 };

    // Cobrinha começa com 3 partes, no meio do tabuleiro
    const meioX = Math.floor(COLUNAS / 2);
    const meioY = Math.floor(LINHAS / 2);

    cobrinha = [
      { x: meioX, y: meioY },
      { x: meioX - 1, y: meioY },
      { x: meioX - 2, y: meioY },
    ];

    // Sorteia comida
    sortearComida();

    // Atualiza UI
    atualizarPlacar();
    setMensagem("Pronto(a)! Clique em Iniciar. 🐍");
    btnIniciar.textContent = "▶️ Iniciar";
    btnReiniciar.disabled = true;

    // Desenha o estado inicial
    desenhar();
  }

  function terminarJogo(texto) {
    // Para o jogo
    jogoAtivo = false;

    // Para o timer
    clearInterval(timerId);
    timerId = null;

    // Mostra mensagem
    setMensagem(texto + " Clique em Reiniciar.");

    // Atualiza botões
    btnIniciar.textContent = "▶️ Iniciar";
    btnReiniciar.disabled = false;
  }

  // =========================
  // 9) TECLADO: MUDAR DIREÇÃO
  // =========================

  function tratarTecla(evento) {
    // Normaliza a tecla (ex.: "ArrowUp", "w", "W" etc.)
    const tecla = evento.key.toLowerCase();

    // Regras importantes:
    // - Não pode inverter direto (ex.: indo para direita, não pode ir para esquerda imediatamente)
    // - Por isso checamos a direção atual antes de aceitar a mudança

    // CIMA (seta ↑ ou W)
    if (tecla === "arrowup" || tecla === "w") {
      if (direcao.y !== 1) {
        proximaDirecao = { x: 0, y: -1 };
      }
    }

    // BAIXO (seta ↓ ou S)
    if (tecla === "arrowdown" || tecla === "s") {
      if (direcao.y !== -1) {
        proximaDirecao = { x: 0, y: 1 };
      }
    }

    // ESQUERDA (seta ← ou A)
    if (tecla === "arrowleft" || tecla === "a") {
      if (direcao.x !== 1) {
        proximaDirecao = { x: -1, y: 0 };
      }
    }

    // DIREITA (seta → ou D)
    if (tecla === "arrowright" || tecla === "d") {
      if (direcao.x !== -1) {
        proximaDirecao = { x: 1, y: 0 };
      }
    }

    // Espaço (space) para pausar/continuar rapidamente (opcional)
    if (tecla === " ") {
      alternarIniciarPausar();
    }
  }

  // =========================
  // 10) MELHOR PONTUAÇÃO (LOCALSTORAGE)
  // =========================

  function carregarMelhorPontuacao() {
    // Lê do navegador (salvo localmente)
    const salvo = localStorage.getItem("snake_melhor");

    // Se existir algo salvo, converte para número
    if (salvo !== null) {
      melhor = Number(salvo) || 0;
    }
  }

  function salvarMelhorPontuacao() {
    // Salva como texto (localStorage guarda strings)
    localStorage.setItem("snake_melhor", String(melhor));
  }

  // =========================
  // 11) EVENTOS (BOTÕES + TECLADO) E INÍCIO
  // =========================

  // Clique no botão iniciar/pausar
  btnIniciar.addEventListener("click", alternarIniciarPausar);

  // Clique no botão reiniciar
  btnReiniciar.addEventListener("click", reiniciar);

  // Teclado
  window.addEventListener("keydown", tratarTecla);

  // Inicia o jogo (carrega melhor pontuação e desenha o estado inicial)
  carregarMelhorPontuacao();
  reiniciar();
})();
