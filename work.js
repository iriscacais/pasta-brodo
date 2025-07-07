fetch("/content/projetos/projetos.json")
  .then(res => res.json())
  .then(data => {
    const grid = document.getElementById("projects-grid");

    const cardsHTML = data
      .filter(projeto => projeto.ativo !== false)
      .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
      .reverse()
      .map(
        (projeto) => `
        <a href="/projetos/${projeto.slug}" class="project-card">
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

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    // 👇 Seleciona todos os .project-card DEPOIS do HTML ter sido inserido
    const cards = document.querySelectorAll(".project-card");
    cards.forEach(card => observer.observe(card));
  });
