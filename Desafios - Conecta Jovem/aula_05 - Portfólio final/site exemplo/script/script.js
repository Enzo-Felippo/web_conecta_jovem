/*
  script.js
  Interatividades do portfólio:
  1) Menu mobile: abrir/fechar
  2) Link ativo no menu conforme a seção visível
  3) Animação das barras de habilidades quando a seção aparece
  4) Ano automático no rodapé
  5) Feedback no formulário (sem back-end)
*/

(() => {
  // =========================
  // 1) ANO AUTOMÁTICO NO RODAPÉ
  // =========================
  const anoSpan = document.getElementById("ano");
  if (anoSpan) {
    // Pega o ano atual do computador e coloca no HTML
    anoSpan.textContent = new Date().getFullYear();
  }

  // =========================
  // 2) MENU MOBILE (ABRIR/FECHAR)
  // =========================
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      // Alterna a classe "aberto" para mostrar/ocultar o menu
      nav.classList.toggle("aberto");

      // Atualiza o aria-expanded (acessibilidade)
      const estaAberto = nav.classList.contains("aberto");
      menuToggle.setAttribute("aria-expanded", String(estaAberto));
    });

    // Fecha o menu quando clicar em algum link (em telas pequenas)
    nav.addEventListener("click", (event) => {
      const alvo = event.target;

      // Verifica se clicou em um link do menu
      if (alvo && alvo.classList && alvo.classList.contains("nav__link")) {
        nav.classList.remove("aberto");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // =========================
  // 3) LINK ATIVO CONFORME SEÇÃO VISÍVEL
  // =========================
  const links = Array.from(document.querySelectorAll(".nav__link"));
  const secoes = Array.from(document.querySelectorAll("main section"));

  function ativarLinkPorId(idSecao) {
    // Remove "ativo" de todos os links
    links.forEach((link) => link.classList.remove("ativo"));

    // Encontra o link que aponta para essa seção e marca como ativo
    const linkDaSecao = links.find((l) => l.getAttribute("href") === `#${idSecao}`);
    if (linkDaSecao) linkDaSecao.classList.add("ativo");
  }

  // Usamos IntersectionObserver para detectar a seção “mais em destaque”
  const observerSecoes = new IntersectionObserver(
    (entradas) => {
      // Filtra as seções que estão aparecendo na tela
      const visiveis = entradas.filter((e) => e.isIntersecting);

      // Se tiver pelo menos uma visível, escolhe a com maior interseção
      if (visiveis.length > 0) {
        // Ordena pela porcentagem de visibilidade (maior primeiro)
        visiveis.sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        // Pega o id da seção mais visível
        const id = visiveis[0].target.id;
        ativarLinkPorId(id);
      }
    },
    {
      // Ajusta quando consideramos “visível”
      threshold: [0.2, 0.35, 0.5, 0.7],
    }
  );

  // Observa cada seção
  secoes.forEach((secao) => observerSecoes.observe(secao));

  // =========================
  // 4) ANIMAÇÃO DAS BARRAS DE HABILIDADES
  // =========================
  const habilidadesSecao = document.getElementById("habilidades");
  const barras = Array.from(document.querySelectorAll(".skill__progresso"));
  const valores = Array.from(document.querySelectorAll(".skill__valor"));

  let habilidadesAnimadas = false; // evita animar várias vezes

  function animarHabilidades() {
    if (habilidadesAnimadas) return; // se já animou, não repete
    habilidadesAnimadas = true;

    // Para cada barra, pega o alvo do data-target e aplica no width
    barras.forEach((barra) => {
      const alvo = Number(barra.getAttribute("data-target")) || 0;
      barra.style.width = `${alvo}%`;
    });

    // Para cada número, anima de 0 até o valor final
    valores.forEach((item) => {
      const alvo = Number(item.getAttribute("data-target")) || 0;
      let atual = 0;

      // Intervalo pequeno para “contar” até o alvo
      const timer = setInterval(() => {
        atual += 1;
        item.textContent = `${atual}%`;

        // Quando chega, para
        if (atual >= alvo) {
          clearInterval(timer);
          item.textContent = `${alvo}%`;
        }
      }, 12);
    });
  }

  // Observa a seção de habilidades para animar só quando ela aparece
  if (habilidadesSecao) {
    const observerHabilidades = new IntersectionObserver(
      (entradas) => {
        // Se a seção apareceu, animamos
        if (entradas[0].isIntersecting) {
          animarHabilidades();
        }
      },
      { threshold: 0.25 }
    );

    observerHabilidades.observe(habilidadesSecao);
  }

  // =========================
  // 5) FORMULÁRIO: FEEDBACK (SEM ENVIO REAL)
  // =========================
  const form = document.getElementById("formContato");
  const feedback = document.getElementById("feedback");

  if (form && feedback) {
    form.addEventListener("submit", (event) => {
      // Impede recarregar a página (padrão do formulário)
      event.preventDefault();

      // Captura os valores digitados
      const nome = document.getElementById("nome").value.trim();
      const email = document.getElementById("email").value.trim();
      const mensagem = document.getElementById("mensagem").value.trim();

      // Validação simples (front-end)
      if (!nome || !email || !mensagem) {
        feedback.textContent = "⚠️ Preencha todos os campos para enviar sua mensagem.";
        feedback.style.color = "#ffcf5a"; // amarelo (alerta)
        return;
      }

      // Se passou, mostramos “sucesso” (simulado)
      feedback.textContent = "✅ Mensagem enviada! Em breve eu entro em contato.";
      feedback.style.color = "#2dff8f"; // verde neon (sucesso)

      // Limpa os campos (simula que “enviou”)
      form.reset();

      // Depois de alguns segundos, apagamos o feedback para ficar limpo
      setTimeout(() => {
        feedback.textContent = "";
      }, 3500);
    });
  }
})();
