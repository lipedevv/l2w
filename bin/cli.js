#!/usr/bin/env node

import pkg from 'enquirer';
const { Select, Input } = pkg;
import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import boxen from 'boxen';
import { startServer } from '../src/server.js';
import fs from 'fs';
import path from 'path';

function showBanner() {
  console.clear();
  console.log(
    boxen(
      chalk.bold('🛰️  L2W - Solutions for Developers\n') +
        chalk.gray('Feito com 💛 por LipeDevv\n') +
        chalk.blue('GitHub: ') + chalk.underline('https://github.com/lipedevv/l2w'),
      {
        padding: 1,
        borderColor: 'yellow',
        borderStyle: 'round',
        margin: 1
      }
    )
  );
}

function getDirectories(source) {
  return fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

async function mainMenu() {
  const animation = chalkAnimation.karaoke('🚀 Iniciando o L2W CLI...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  animation.stop();

  showBanner();

  const optionPrompt = new Select({
    name: 'option',
    message: '🎯 Escolha uma opção:',
    choices: ['🌐 Iniciar WebServer', '🔍 Sobre', '🛶 Sair']
  });

  const option = await optionPrompt.run();

  if (option === '🌐 Iniciar WebServer') {
    const portPrompt = new Input({
      name: 'port',
      message: 'Informe a porta:',
      initial: '2222'
    });
    const port = await portPrompt.run();

    const modePrompt = new Select({
      name: 'mode',
      message: 'Modo de funcionamento:',
      choices: [
        '📁 Servir arquivos estáticos',
        '📄 Rodar arquivo específico',
        '🧪 Mostrar conteúdo customizado'
      ]
    });
    const mode = await modePrompt.run();

    const config = { port, mode };

    if (mode === '📁 Servir arquivos estáticos') {
      const folders = getDirectories(process.cwd());
      const choices = [
        {
          name: '📌 Pasta atual',
          message: chalk.bold.green('📌 Pasta atual'),
          value: process.cwd()
        },
        ...folders.map(folder => ({
          name: folder,
          message: folder,
          value: folder
        }))
      ];

      const folderPrompt = new Select({
        name: 'folder',
        message: '📁 Escolha a pasta a ser servida:\u200b',
        choices
      });

      config.folder = await folderPrompt.run();
    }

    if (mode === '🧪 Mostrar conteúdo customizado') {
      const contentPrompt = new Input({
        message: 'Digite o conteúdo customizado a ser exibido:',
        initial: '<h1>🛰️ L2W Funcionando Corretamente!</h1>'
      });
      config.customContent = await contentPrompt.run();
    }

    startServer(config);
  }

  if (option === '🔍 Sobre') {
    console.log(
      boxen(
        chalk.green('L2W - Solutions for Developers\n') +
          'Feito por: LipeDevv\n' +
          'Repositório: https://github.com/lipedevv/l2w',
        {
          padding: 1,
          borderColor: 'green',
          borderStyle: 'double'
        }
      )
    );
  }

  if (option === '🛶 Sair') {
    console.log(chalk.yellow('👋 Até mais!'));
    process.exit(0);
  }
}

export async function returnMenu() {
  console.clear();
  const animation = chalkAnimation.rainbow('🚀 Retomando o L2W CLI');
  await new Promise(resolve => setTimeout(resolve, 2000));
  animation.stop();

  showBanner();

  const optionPrompt = new Select({
    name: 'option',
    message: '🎯 Escolha uma opção:',
    choices: ['🌐 Iniciar WebServer', '🔍 Sobre', '🛶 Sair']
  });

  const option = await optionPrompt.run();

  if (option === '🌐 Iniciar WebServer') {
    const portPrompt = new Input({
      name: 'port',
      message: 'Informe a porta:',
      initial: '2222'
    });
    const port = await portPrompt.run();

    const modePrompt = new Select({
      name: 'mode',
      message: 'Modo de funcionamento:',
      choices: [
        '📁 Servir arquivos estáticos',
        '📄 Rodar arquivo específico',
        '🧪 Mostrar conteúdo customizado'
      ]
    });
    const mode = await modePrompt.run();

    const config = { port, mode };

    if (mode === '📁 Servir arquivos estáticos') {
      const folders = getDirectories(process.cwd());
      const choices = [
        {
          name: '📌 Pasta atual',
          message: chalk.bold.green('📌 Pasta atual'),
          value: process.cwd()
        },
        ...folders.map(folder => ({
          name: folder,
          message: folder,
          value: folder
        }))
      ];

      const folderPrompt = new Select({
        name: 'folder',
        message: '📁 Escolha a pasta a ser servida:\u200b',
        choices
      });

      config.folder = await folderPrompt.run();
    }

    if (mode === '🧪 Mostrar conteúdo customizado') {
      const contentPrompt = new Input({
        message: 'Digite o conteúdo customizado a ser exibido:',
        initial: '<h1>🛰️ L2W Funcionando Corretamente!</h1>'
      });
      config.customContent = await contentPrompt.run();
    }

    startServer(config);
  }

  if (option === '🔍 Sobre') {
    console.log(
      boxen(
        chalk.green('L2W - Solutions for Developers\n') +
          'Feito por: LipeDevv\n' +
          'Repositório: https://github.com/lipedevv/l2w',
        {
          padding: 1,
          borderColor: 'green',
          borderStyle: 'double'
        }
      )
    );
  }

  if (option === '🛶 Sair') {
    console.log(chalk.yellow('👋 Até mais!'));
    process.exit(0);
  }
}

await mainMenu();
