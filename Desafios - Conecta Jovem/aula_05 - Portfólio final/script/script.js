(() => {

    // =========================
    // MENU MOBILE
    // =========================

    const menuToggle = document.getElementById("menuToggle");
    const nav = document.getElementById("nav");

    if (menuToggle && nav) {

        menuToggle.addEventListener("click", () => {

            // Abre/fecha o menu
            nav.classList.toggle("aberto");

            // Atualiza acessibilidade
            const estaAberto = nav.classList.contains("aberto");

            menuToggle.setAttribute(
                "aria-expanded",
                String(estaAberto)
            );
        });

        // Fecha ao clicar em um link
        nav.addEventListener("click", (event) => {

            const alvo = event.target;

            if (
                alvo &&
                alvo.classList &&
                alvo.classList.contains("nav__link")
            ) {
                nav.classList.remove("aberto");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }
        });
    }

})();

