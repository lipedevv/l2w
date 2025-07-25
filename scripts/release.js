#!/usr/bin/env node

import { execSync } from "child_process";

// Pega os argumentos depois de "--desc"
const args = process.argv.slice(2);
const descIndex = args.indexOf("--desc");
const desc = descIndex !== -1 ? args[descIndex + 1] : "release";

try {
  // Verifica se há alterações não comitadas
  const status = execSync("git status --porcelain").toString().trim();

  if (status) {
    console.log("📦 Alterações encontradas. Fazendo commit...");

    // Adiciona todas as alterações
    execSync("git add .", { stdio: "inherit" });

    // Faz o commit com a descrição passada
    execSync(`git commit -m "${desc}"`, { stdio: "inherit" });
  } else {
    console.log("✅ Nenhuma alteração encontrada. Continuando...");
  }

  // Cria nova versão (patch) com a descrição
  execSync(`npm version patch -m "${desc}"`, { stdio: "inherit" });

  // Envia as alterações para o Git
  execSync("git push", { stdio: "inherit" });
  execSync("git push --tags", { stdio: "inherit" });

  // Publica no NPM
  execSync("npm publish", { stdio: "inherit" });

} catch (err) {
  console.error("❌ Erro ao fazer release:", err);
  process.exit(1);
}
