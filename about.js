fetch("/content/sobre/sobre.json")
  .then(res => res.json())
  .then(data => {
    const mediaContainer = document.getElementById("about-media");

    if (data.media_type === "video" && data.media_video) {
      mediaContainer.innerHTML = `
        <div class="media-wrapper tipo-video">
          <iframe
            src="${data.media_video}"
            frameborder="0"
            allowfullscreen
            class="media-element"
            title="Vídeo de apresentação de Luiz Brodo"
          ></iframe>
          ${data.media_description ? `<p class="media-description">${data.media_description}</p>` : ""}
        </div>
      `;
    } else if (data.media_type === "image" && data.media_image) {
      mediaContainer.innerHTML = `
        <div class="media-wrapper tipo-imagem">
          <img src="${data.media_image}" alt="${data.media_description || 'Foto de Luiz Brodo'}" class="media-element" />
          ${data.media_description ? `<p class="media-description">${data.media_description}</p>` : ""}
        </div>
      `;
    } else {
      mediaContainer.innerHTML = `<p class="media-description">Mídia não disponível</p>`;
    }

    // TEXTO PRINCIPAL
    const textContainer = document.getElementById("about-text");
    textContainer.innerHTML = `
      <h1 class="about-title">${data.title}</h1>
      <div class="about-description">${marked.parse(data.description || "")}</div>
      <div class="about-contatos">
          <a href="mailto:${data.contatos.email}" class="contato-link" title="Enviar e-mail para Luiz Brodo" aria-label="Enviar e-mail para Luiz Brodo">
              <img src="/images/e-mail.svg" alt="Ícone de e-mail"/>
          </a>
          <a href="${data.contatos.linkedin}" target="_blank" rel="noopener noreferrer" class="contato-link" title="LinkedIn de Luiz Brodo" aria-label="LinkedIn de Luiz Brodo">
              <img src="/images/in.svg" alt="Ícone de LinkedIn" />
          </a>
          <a href="https://wa.me/${data.contatos.celular.replace(/\D/g, '')}" target="_blank" class="contato-link" title="Whatsapp de Luiz Brodo" aria-label="WhatsApp de Luiz Brodo">
              <img src="/images/whatsapp.svg" alt="Ícone de Whatsapp" />
          </a>
      </div>
    `;

    // EXPERIÊNCIA
    const experienceContainer = document.getElementById("experience-list");
    experienceContainer.innerHTML = `
      <h2 class="subtitle-about">Por onde passei</h2>
      <ul class="experience-list">
        ${data.experiencia.map(item => `<li>${item}</li>`).join("")}
      </ul>
    `;

    // FORMAÇÃO
    const educationContainer = document.getElementById("education-list");
    educationContainer.innerHTML = `
      <h2 class="subtitle-about">Formação</h2>
      <ul class="education-list">
        ${data.formacao.map(item => `<li>${item}</li>`).join("")}
      </ul>
    `;

    // PRÊMIOS
    const prizesContainer = document.getElementById("prizes-list");
    let premiosHTML = `<h2 class="subtitle-about">Mimos</h2>`;
    data.premios.forEach(premio => {
      premiosHTML += `
        <div class="premio-bloco">
          <h3 class="premio-titulo">${premio.titulo}</h3>
          <ul class="premio-itens">
            ${premio.itens.map(item => `<li>${item}</li>`).join("")}
          </ul>
        </div>
      `;
    });
    prizesContainer.innerHTML = premiosHTML;
  });