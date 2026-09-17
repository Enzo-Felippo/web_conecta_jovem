/*
  calc.js
  Aqui fica a LÓGICA da calculadora:
  - ler valores digitados
  - validar
  - fazer a conta
  - mostrar o resultado na tela
*/

(() => {
  // ======= 1) Pegando elementos do HTML (pela ID) =======

  // Campo do primeiro número
  const inputNum1 = document.getElementById("num1");

  // Campo do segundo número
  const inputNum2 = document.getElementById("num2");

  // Onde vamos mostrar o resultado final
  const spanResultado = document.getElementById("resultado");

  // Onde vamos mostrar mensagens (ex.: erro)
  const pMensagem = document.getElementById("mensagem");

  // Botão "Limpar"
  const btnLimpar = document.getElementById("btnLimpar");

  // Todos os botões que têm operação (eles têm a classe "btn" e data-op)
  const botoesOperacao = document.querySelectorAll(".btn[data-op]");

  // ======= 2) Funções auxiliares (de apoio) =======

  /*
    Mostra uma mensagem para o usuário.
    - texto: o que vai aparecer
    - tipo: "erro" ou "ok" (para escolher a cor)
  */
  function mostrarMensagem(texto, tipo) {
    // Coloca o texto dentro do parágrafo
    pMensagem.textContent = texto;

    // Define a cor conforme o tipo da mensagem
    if (tipo === "erro") {
      pMensagem.style.color = "#b91c1c"; // vermelho escuro
    } else if (tipo === "ok") {
      pMensagem.style.color = "#166534"; // verde escuro
    } else {
      pMensagem.style.color = "#1f2a44"; // cor padrão
    }
  }

  /*
    Lê os valores dos inputs e converte para número.
    Retorna um objeto com:
    - n1: número 1
    - n2: número 2
    - valido: true/false (se deu para usar)
  */
  function lerNumeros() {
    // Pega o texto digitado (vem como string)
    const valor1 = inputNum1.value;
    const valor2 = inputNum2.value;

    // Verifica se algum campo está vazio
    if (valor1 === "" || valor2 === "") {
      return { valido: false, n1: null, n2: null };
    }

    // Converte string para número
    const n1 = Number(valor1);
    const n2 = Number(valor2);

    // Se algum deles virou NaN (Not a Number), é inválido
    if (Number.isNaN(n1) || Number.isNaN(n2)) {
      return { valido: false, n1: null, n2: null };
    }

    // Se chegou aqui, está tudo ok
    return { valido: true, n1: n1, n2: n2 };
  }

  /*
    Faz o cálculo baseado no operador recebido.
    operador pode ser: "+", "-", "*", "/"
  */
  function calcular(operador) {
    // Lê e valida os números
    const dados = lerNumeros();

    // Se não for válido, mostra mensagem e para
    if (!dados.valido) {
      mostrarMensagem("⚠️ Preencha os dois números corretamente.", "erro");
      spanResultado.textContent = "—";
      return; // encerra a função aqui
    }

    // Desestruturação: pega n1 e n2 do objeto
    const { n1, n2 } = dados;

    // Variável que vai guardar o resultado
    let resultado = 0;

    // Decide qual conta fazer
    if (operador === "+") {
      resultado = n1 + n2;
    } else if (operador === "-") {
      resultado = n1 - n2;
    } else if (operador === "*") {
      resultado = n1 * n2;
    } else if (operador === "/") {
      // Evita divisão por zero (isso gera Infinity)
      if (n2 === 0) {
        mostrarMensagem("⚠️ Não é possível dividir por zero.", "erro");
        spanResultado.textContent = "—";
        return;
      }
      resultado = n1 / n2;
    }

    // Mostra o resultado na tela
    // toString() garante que vamos exibir como texto
    spanResultado.textContent = resultado.toString();

    // Mensagem de sucesso (limpa erros anteriores)
    mostrarMensagem("✅ Cálculo realizado!", "ok");
  }

  /*
    Limpa os campos e reseta mensagens/resultado.
  */
  function limpar() {
    // Apaga valores dos inputs
    inputNum1.value = "";
    inputNum2.value = "";

    // Reseta resultado e mensagem
    spanResultado.textContent = "—";
    mostrarMensagem("", "");

    // Coloca o cursor no primeiro campo (ajuda na usabilidade)
    inputNum1.focus();
  }

  // ======= 3) Eventos (quando o usuário clica em algo) =======

  // Para cada botão de operação, adicionamos um "escutador" de clique
  botoesOperacao.forEach((botao) => {
    botao.addEventListener("click", () => {
      // Lê o operador do atributo data-op do botão
      const op = botao.dataset.op;

      // Chama calcular passando esse operador
      calcular(op);
    });
  });

  // Clique no botão limpar
  btnLimpar.addEventListener("click", limpar);

  // (Opcional) Ao carregar a página, já coloca o cursor no primeiro campo
  inputNum1.focus();
})();
