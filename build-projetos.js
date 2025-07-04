const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "content/projetos");

const arquivos = fs.readdirSync(dir).filter(file => file.endsWith(".json"));

const projetos = arquivos.map(file => {
  const content = fs.readFileSync(path.join(dir, file), "utf-8");
  return JSON.parse(content);
});

const outputPath = path.join(__dirname, "content/projetos.json");

fs.writeFileSync(outputPath, JSON.stringify(projetos, null, 2));

console.log(`projetos.json gerado com ${projetos.length} projetos.`);
