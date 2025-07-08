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

    // --------- Meta dinâmico ---------
document.title = `Luiz Brodo | ${projeto.titulo}`;

const metaDescription = document.querySelector('meta[name="description"]');
if (metaDescription) {
  metaDescription.setAttribute("content", projeto.descricao || projeto.titulo || `Projeto de Luiz Brodo`);
} else {
  const desc = document.createElement("meta");
  desc.name = "description";
  desc.content = projeto.descricao || projeto.titulo || `Projeto de Luiz Brodo`;
  document.head.appendChild(desc);
}

// Open Graph
const ogTitle = document.createElement("meta");
ogTitle.setAttribute("property", "og:title");
ogTitle.setAttribute("content", projeto.titulo);

const ogDescription = document.createElement("meta");
ogDescription.setAttribute("property", "og:description");
ogDescription.setAttribute("content", projeto.descricao || projeto.titulo || `Projeto de Luiz Brodo`);

const ogImage = document.createElement("meta");
ogImage.setAttribute("property", "og:image");
ogImage.setAttribute("content", window.location.origin + projeto.thumb);

const ogUrl = document.createElement("meta");
ogUrl.setAttribute("property", "og:url");
ogUrl.setAttribute("content", window.location.href);

const ogType = document.createElement("meta");
ogType.setAttribute("property", "og:type");
ogType.setAttribute("content", "article");

[ogTitle, ogDescription, ogImage, ogUrl, ogType].forEach((meta) =>
  document.head.appendChild(meta)
);

// Twitter
const twitterTitle = document.createElement("meta");
twitterTitle.name = "twitter:title";
twitterTitle.content = projeto.titulo;

const twitterDescription = document.createElement("meta");
twitterDescription.name = "twitter:description";
twitterDescription.content = projeto.descricao || projeto.titulo || `Projeto de Luiz Brodo`;

const twitterImage = document.createElement("meta");
twitterImage.name = "twitter:image";
twitterImage.content = window.location.origin + projeto.thumb;

const twitterCard = document.createElement("meta");
twitterCard.name = "twitter:card";
twitterCard.content = "summary_large_image";

[twitterTitle, twitterDescription, twitterImage, twitterCard].forEach((meta) =>
  document.head.appendChild(meta)
);

// Canonical
const canonical = document.createElement("link");
canonical.rel = "canonical";
canonical.href = window.location.href;
document.head.appendChild(canonical);

    const container = document.getElementById("projeto-content");

    if (!projeto) {
      container.innerHTML = `<p>Projeto não encontrado.</p>`;
      return;
    }

    const tituloHtml = marked.parse(projeto.titulo || "");
    const subtituloHtml = marked.parse(projeto.subtitulo || "");
    const descricaoHtml = marked.parse(projeto.descricao || "");

    container.innerHTML = `
      <section class="hero-container fade-in">
        <div class="title-container">
          <h1 class="projeto-title">${tituloHtml}</h1>
          ${projeto.subtitulo ? `<div class="projeto-subtitulo">${subtituloHtml}</div>` : ""}
        </div>
        <div class="description-container">
          ${projeto.descricao ? `<div class="projeto-descricao">${descricaoHtml}</div>` : ""}
        </div>
      </section>
    `;

    // Renderizar blocos de conteúdo
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
            <img src="${bloco.src}" alt="${bloco.alt || projeto.titulo}" class="media-element" />
          </div>`;
      } else if (bloco.tipo === "texto") {
        const textoHtml = marked.parse(bloco.valor || "");
        container.innerHTML += `
          <div class="projeto-texto fade-in">
            ${textoHtml}
          </div>`;
      } else if (bloco.tipo === "galeria") {
        const galeriaImgs = bloco.imagens
          .map((img, index) => `<img src="${img.image}" alt="${img.alt || projeto.titulo}" class="fade-in" style="transition-delay: ${index * 100}ms;" />`)
          .join("");
        container.innerHTML += `<div class="galeria">${galeriaImgs}</div>`;
      } else if (bloco.tipo === "poster") {
        const posters = bloco.imagens
          .map((img, index) => `<img src="${img.image}" alt="${img.alt || projeto.titulo}" class="fade-in" style="transition-delay: ${index * 100}ms;" />`)
          .join("");
        container.innerHTML += `<div class="poster-grid">${posters}</div>`;
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
              <img src="${img1.image}" alt="${img1.alt || projeto.titulo}" class="fade-in" style="transition-delay: 0ms;" />
            </div>
            <div class="col-direita">
              <img src="${img2.image}" alt="Imagem secundária 1" class="fade-in" style="transition-delay: 100ms;" />
              <img src="${img3.image}" alt="${img1.alt || projeto.titulo}" class="fade-in" style="transition-delay: 200ms;" />
            </div>
          </div>
        `;
      }
    });

    // Navegação entre projetos
    const navSection = document.createElement("section");
    navSection.className = "projeto-nav fade-in";

    let linksHTML = `<a href="/" class="nav-link" aria-label="Voltar para página inicial com todos os projetos">All</a>`;

    data
      .slice()
      .filter((projeto) => projeto.ativo !== false)
      .sort((a, b) => (b.ordem ?? 0) - (a.ordem ?? 0))
      .forEach((p) => {
        const isActive = p.slug === projeto.slug ? "active" : "";
        linksHTML += `<a href="/projetos/${p.slug}" class="nav-link ${isActive}" aria-label="Ver projeto ${p.titulo}">${p.titulo}</a>`;
      });

    navSection.innerHTML = linksHTML;
    document.querySelector(".projeto-container").appendChild(navSection);

    // Animações
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
        { threshold: 0.1 }
      );

      fadeElements.forEach((el) => observer.observe(el));
    }, 100);
  });
