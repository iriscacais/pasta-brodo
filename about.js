
fetch("/content/sobre/sobre.json")
  .then(res => res.json())
  .then(data => {
    const mediaContainer = document.getElementById("about-media");

    if (data.media.type === "embed") {
      mediaContainer.innerHTML = `
        <div class="media-wrapper tipo-video">
          <iframe
            src="${data.media.src}"
            frameborder="0"
            allowfullscreen
            class="media-element"
          ></iframe>
          <p class="media-description">${data.media.description}</p>
        </div>
      `;
    } else if (data.media.type === "image") {
      mediaContainer.innerHTML = `
        <div class="media-wrapper tipo-imagem">
          <img src="${data.media.src}" alt="Foto de Luiz Brodo" class="media-element" />
          <p class="media-description">${data.media.description}</p>
        </div>
      `;
    } else {
      mediaContainer.innerHTML = `<p class="media-description">Mídia não disponível</p>`;
    }

    const textContainer = document.getElementById("about-text");

    textContainer.innerHTML = `
    <h1 class="about-title">${data.title}</h1>
    <p class="about-description">${data.description}</p>
    <div class="about-contatos">
        <a href="mailto:${data.contatos.email}" class="contato-link" title="Enviar e-mail para Luiz Brodo">
            <img src="/images/e-mail.svg" alt="Ícone de e-mail"/>
        </a>
        <a href="${data.contatos.linkedin}" target="_blank" rel="noopener noreferrer" class="contato-link" title="LinkedIn de Luiz Brodo">
            <img src="/images/in.svg" alt="Ícone de LinkedIn" />
        </a>
        <a href="https://wa.me/${data.contatos.celular.replace(/\D/g, '')}" target="_blank" class="contato-link" title="Whatsapp de Luiz Brodo">
            <img src="/images/whatsapp.svg" alt="Ícone de Whatsapp" />
        </a>
  </div>
    `;

   // EXPERIÊNCIA
const experienceContainer = document.getElementById("experience-list");

let experienciaHTML = `
  <h2 class="subtitle-about">Por onde passei</h2>
  <ul class="experience-list">
    ${data.experiencia.map(item => `<li>${item}</li>`).join("")}
  </ul>
`;

experienceContainer.innerHTML = experienciaHTML;

// FORMAÇÃO
const educationContainer = document.getElementById("education-list");

let formacaoHTML = `
  <h2 class="subtitle-about">Formação</h2>
  <ul class="education-list">
    ${data.formacao.map(item => `<li>${item}</li>`).join("")}
  </ul>
`;

educationContainer.innerHTML = formacaoHTML;

const prizesContainer = document.getElementById("prizes-list");

let premiosHTML = `
  <h2 class="subtitle-about">Mimos</h2>
`;

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
