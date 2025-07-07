let slug;
const params = new URLSearchParams(window.location.search);
if (params.has("slug")) {
  slug = params.get("slug");
} else {
  const pathParts = window.location.pathname.split("/");
  slug = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
}

fetch("/content/projetos/projetos.json")
  .then((res) => res.json())
  .then((data) => {
    const projeto = data.find((p) => p.slug === slug);
    const container = document.getElementById("projeto-content");

    if (!projeto) {
      container.innerHTML = `<p>Projeto não encontrado.</p>`;
      return;
    }

    // Título e descrição
    container.innerHTML = `
    <section class="hero-container fade-in">
      <div class="title-container">
        <h1 class="projeto-title">${projeto.titulo}</h1>
        ${projeto.subtitulo ? `<h2 class="projeto-subtitulo">${projeto.subtitulo}</h2>` : ""}
      </div>
      <div class="description-container">
        ${projeto.descricao ? `<p class="projeto-descricao">${projeto.descricao}</p>` : ""}
      </div>
    </section>
  `;

    // Renderizar blocos de conteudo
    projeto.conteudo.forEach((bloco) => {
      if (bloco.tipo === "video") {
        container.innerHTML += `
          <div class="projeto-video fade-in">
            <iframe
              src="${bloco.src}"
              frameborder="0"
              allowfullscreen
              class="media-element"
            ></iframe>
          </div>`;
      } else if (bloco.tipo === "imagem") {
        const tamanhoClasse = bloco.tamanho === "pequena" ? "imagem-pequena" : "";
        container.innerHTML += `
          <div class="projeto-imagem ${tamanhoClasse} fade-in">
            <img src="${bloco.src}" alt="Imagem do projeto" class="media-element" />
          </div>`;
      } else if (bloco.tipo === "texto") {
        container.innerHTML += `
          <p class="projeto-texto fade-in">${bloco.valor}</p>`;
      } else if (bloco.tipo === "galeria") {
        const galeriaImgs = bloco.imagens
          .map((img, index) => `<img src="${img}" alt="" class="fade-in" style="transition-delay: ${index * 100}ms;" />`)
          .join("");
        container.innerHTML += `
          <div class="galeria">${galeriaImgs}</div>`;
      } else if (bloco.tipo === "poster") {
        const posters = bloco.imagens
          .map((img, index) => `<img src="${img}" alt="Poster" class="fade-in" style="transition-delay: ${index * 100}ms;" />`)
          .join("");
        container.innerHTML += `
          <div class="poster-grid">${posters}</div>`;
      } else if (bloco.tipo === "galeria-video-horizontal" && Array.isArray(bloco.videos)) {
        const videos = bloco.videos
          .filter((v) => typeof v === "string" && v.length > 0)
          .map(
            (src, index) => `
              <iframe
                src="${src}"
                frameborder="0"
                allowfullscreen
                class="video-horizontal fade-in"
                style="transition-delay: ${index * 100}ms;"
              ></iframe>`
          )
          .join("");

        container.innerHTML += `<div class="video-horizontal-grid">${videos}</div>`;
      } else if (bloco.tipo === "galeria-bloco" && bloco.imagens.length === 3) {
        const [img1, img2, img3] = bloco.imagens;
        container.innerHTML += `
          <div class="galeria-bloco">
            <div class="col-esquerda">
              <img src="${img1}" alt="Imagem principal" class="fade-in" style="transition-delay: 0ms;" />
            </div>
            <div class="col-direita">
              <img src="${img2}" alt="Imagem secundária 1" class="fade-in" style="transition-delay: 100ms;" />
              <img src="${img3}" alt="Imagem secundária 2" class="fade-in" style="transition-delay: 200ms;" />
            </div>
          </div>
        `;
      }
    });

    const navSection = document.createElement("section");
    navSection.className = "projeto-nav fade-in";

    let linksHTML = `<a href="/" class="nav-link">All</a>`;

    data
      .slice()
      .filter((projeto) => projeto.ativo !== false)
      .sort((a, b) => (b.ordem ?? 0) - (a.ordem ?? 0))
      .forEach((p) => {
        const isActive = p.slug === projeto.slug ? "active" : "";
        linksHTML += `<a href="/projetos/${p.slug}" class="nav-link ${isActive}">${p.titulo}</a>`;
      });

    navSection.innerHTML = linksHTML;
    document.querySelector(".projeto-container").appendChild(navSection);

    setTimeout(() => {
      const fadeElements = document.querySelectorAll(".fade-in");

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("reveal");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.2,
        }
      );

      fadeElements.forEach((el) => observer.observe(el));
    }, 100);
  });
