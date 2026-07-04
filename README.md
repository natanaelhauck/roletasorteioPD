# Roleta de Sorteio — Projeto Desenvolve Itabira

Frontend React + Vite para realizar sorteios presenciais do Projeto Desenvolve. A aplicação funciona inteiramente no navegador, sem backend, e salva participantes, fila de prêmios, configurações e histórico no `localStorage`.

## Instalação

Requer Node.js 18 ou superior.

```bash
npm install
```

## Build e execução recomendada para o evento

Na máquina que será ligada ao projetor:

```bash
npm run build
npm run preview
```

Abra o endereço local exibido no terminal, normalmente `http://localhost:4173`.

Para o evento, prefira sempre `npm run preview` após o build. Essa opção serve exatamente os arquivos de produção que serão usados e evita recompilações durante o sorteio. Use o navegador em tela cheia (`F11`) e não limpe os dados do site durante o evento, pois participantes, prêmios e histórico ficam salvos no navegador.

O modo de desenvolvimento continua disponível:

```bash
npm run dev
```

## Checklist antes de começar

1. Execute `npm install`, `npm run build` e `npm run preview`.
2. Abra a aplicação no mesmo navegador que será usado no evento.
3. Importe a lista definitiva de alunos.
4. Revise a ordem e a quantidade dos prêmios.
5. Faça um sorteio de teste e restaure participantes, prêmios e histórico depois.
6. Ative a tela cheia e confira o enquadramento no projetor.

## Participantes

Há três formas de preencher a roleta:

1. **Um nome:** digite um participante e clique no botão `+`.
2. **Colar lista:** selecione “Colar lista”, cole um nome por linha e clique em “Adicionar lista”.
3. **CSV:** clique em “Importar arquivo CSV”. O app usa a primeira coluna de cada linha e aceita separadores por vírgula ou ponto e vírgula.

Nomes repetidos são descartados automaticamente, ignorando diferenças entre maiúsculas, minúsculas, acentos e espaços extras.

## Fila de prêmios

A fila começa com:

- 3 unidades de **Fone HAVIT GameNote Fuxi-HD5**
- 3 unidades de **Mouse Redragon Cobra M711**
- 1 unidade de **Teclado Redragon Fizz RGB**

O primeiro item da fila é sempre o próximo prêmio. Quando a roleta termina, esse item é removido e registrado no histórico. No painel “Prêmios” é possível:

- adicionar um prêmio manualmente;
- editar ou remover itens;
- alterar a ordem pelas setas;
- restaurar a lista padrão.

A fila permanece salva após atualizar ou fechar a página.

## Imagens dos prêmios

As imagens locais ficam em:

```text
public/assets/premios/fone.webp
public/assets/premios/mouse.avif
public/assets/premios/teclado.avif
```

Para trocar uma imagem, substitua o arquivo mantendo o mesmo nome e formato. O app não usa imagens externas. Se um arquivo estiver ausente ou inválido, será exibido automaticamente um placeholder com gradiente e ícone.

A logo horizontal está em:

```text
public/assets/LogoPDhorizontal@2x.png
```

## Durante o sorteio

1. Confira o nome do próximo prêmio ao lado do botão “Sortear”.
2. Mantenha “Remover vencedor da próxima rodada” marcado para evitar ganhadores repetidos.
3. Clique em “Sortear” e aguarde a roda parar.
4. No resultado, use “Sortear próximo” para seguir diretamente ou “Fechar” para revisar os painéis.
5. Ao final, use “Exportar CSV” para salvar o histórico.

## Desempenho e funcionamento offline

As fontes e imagens utilizadas pela interface são locais; depois de instalar as dependências, o sorteio não depende de serviços externos. O primeiro acesso pode levar um instante para decodificar a logo e a primeira imagem do prêmio. As imagens seguintes usam carregamento sob demanda e formatos compactos (`WebP` e `AVIF`).

O build de produção é otimizado pelo Vite. A pasta `dist/` é gerada por `npm run build` e não deve ser editada manualmente.
