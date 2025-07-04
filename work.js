fetch("/content/projetos/projetos.json")
  .then(res => res.json())
  .then(data => {
    const grid = document.getElementById("projects-grid");

    const cardsHTML = data
    .filter(projeto => projeto.ativo !== false)
    .slice() // cria uma cópia para não modificar o original
    .reverse()
      .map(
        (projeto) => `
        <a href="/projeto.html?slug=${projeto.slug}" class="project-card">
          <div class="card-thumb" style="background-image: url('${projeto.thumb}')">
            <div class="card-overlay">
              <h2 class="card-title">${projeto.titulo}</h2>
            </div>
          </div>
        </a>
      `
      )
      .join("");

    grid.innerHTML = cardsHTML;
  });
