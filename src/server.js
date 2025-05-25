import express from 'express';
import ora from 'ora';
import path from 'path';
import boxen from 'boxen';
import chalk from 'chalk';
import pkg from 'enquirer';
import { returnMenu } from "../bin/cli.js"
const { Select, Input } = pkg;

export async function startServer(config) {
  const app = express();
  const spinner = ora('Iniciando servidor...').start();

  const port = config.port || 2222;
  let serverInstance;

  if (config.mode === '📁 Servir arquivos estáticos') {
    const staticPath = path.join(process.cwd(), config.folder || 'public');
    app.use(express.static(staticPath));
  }

  if (config.mode === '📄 Rodar arquivo específico') {
    app.get('/', (req, res) =>
      res.sendFile(path.join(process.cwd(), 'index.html'))
    );
  }

  if (config.mode === '🧪 Mostrar conteúdo customizado') {
    app.get('/', (req, res) => res.send(config.customContent || '<h3>Se você está vendo isso, significa que houve um problema, codigo de erro 248</h3>'));
  }

  serverInstance = app.listen(port, () => {
    spinner.succeed(`✅ Servidor rodando em: http://localhost:${port}`);
    showHeader();
    showControlPanel();
  });

  function showHeader() {
    console.clear();
    console.log(
      boxen(
        chalk.bold('🛰️  L2W - Solutions for Developers\n') +
          chalk.gray('Feito com 💛 por LipeDevv\n') +
          chalk.blue('GitHub: ') +
          chalk.underline('https://github.com/lipedevv/l2w'),
        {
          padding: 1,
          borderColor: 'yellow',
          borderStyle: 'round',
          margin: 1,
        }
      )
    );
  }

  async function showControlPanel() {
    while (true) {
      const panel = new Select({
        name: 'action',
        message:
          '✅ Servidor iniciado com sucesso!\nSelecione uma opção abaixo:',
        choices: ['🔁 Alterar método', '🛠️  Alterar porta', '🛑 Parar WebServer'],
      });

      const action = await panel.run();

      if (action === '🔁 Alterar método') {
        await serverInstance.close();
        const { Select } = await import('enquirer');
        const modePrompt = new Select({
          name: 'mode',
          message: 'Modo de funcionamento:',
          choices: [
            '📁 Servir arquivos estáticos',
            '📄 Rodar arquivo específico',
            '🧪 Mostrar conteúdo customizado',
          ],
        });
        const mode = await modePrompt.run();
        config.mode = mode;

        if (mode === '🧪 Mostrar conteúdo customizado') {
          const { Input } = await import('enquirer');
          const contentPrompt = new Input({
            name: 'content',
            message: 'Digite o conteúdo HTML para exibir:',
          });
          const content = await contentPrompt.run();
          config.content = content;
        }

        await startServer(config); // reinicia com novo modo
        return;
      }

      if (action === '🛠️ Alterar porta') {
        await serverInstance.close();
        const { Input } = await import('enquirer');
        const portPrompt = new Input({
          name: 'port',
          message: 'Informe a nova porta:',
          initial: config.port,
        });
        const newPort = await portPrompt.run();
        config.port = newPort;

        await startServer(config);
        return;
      }

      if (action === '🛑 Parar WebServer') {
        await serverInstance.close();
        console.log(chalk.yellow('🛑 Servidor parado.'));
        returnMenu();
        break;
      }
    }
  }
}