# Roleta de Sorteio — Projeto Desenvolve

Frontend React + Vite para realizar sorteios presenciais do Projeto Desenvolve. A aplicação funciona inteiramente no navegador, sem backend, e salva participantes, prêmio, configurações e histórico no `localStorage`.

## Instalação

Requer Node.js 18 ou superior.

```bash
npm install
```

## Como rodar

Ambiente de desenvolvimento:

```bash
npm run dev
```

Abra o endereço exibido pelo Vite. Para validar ou gerar a versão de produção:

```bash
npm run build
npm run preview
```

## Logo

A logo horizontal está em:

```text
public/assets/LogoPDhorizontal@2x.png
```

Para substituí-la, mantenha o mesmo nome e caminho. Arquivos PNG com fundo transparente funcionam melhor sobre o fundo escuro da interface.

## Importar alunos

Há três formas de preencher a roleta:

1. **Um nome:** digite um participante e clique no botão `+`.
2. **Colar lista:** selecione a aba “Colar lista”, cole um nome por linha e clique em “Adicionar lista”.
3. **CSV:** clique em “Importar arquivo CSV”. O app usa a primeira coluna de cada linha e aceita separadores por vírgula ou ponto e vírgula.

Nomes repetidos são descartados automaticamente, ignorando diferenças entre maiúsculas, minúsculas, acentos e espaços extras.

## Uso no dia do evento

1. Abra a aplicação antes do início e confira a lista de participantes.
2. Importe a lista definitiva via texto ou CSV.
3. Informe o prêmio da rodada, por exemplo “Mouse gamer”.
4. Deixe “Remover vencedor da próxima rodada” marcado para evitar ganhadores repetidos.
5. Clique em “Sortear” e aguarde a roleta parar.
6. Feche o destaque do vencedor para iniciar a próxima rodada.
7. Ao final, use “Exportar CSV” no histórico para salvar os resultados.

Os dados permanecem no mesmo navegador após fechar ou atualizar a página. Use “Limpar” ou “Usar exemplos” para preparar uma nova sessão. Para projetores, prefira o modo de tela cheia do navegador (`F11`).
