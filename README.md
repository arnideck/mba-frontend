# BI Conversacional - Documentação

Este projeto implementa uma interface de BI Conversacional usando Vue 3 + Vite, permitindo que usuários façam perguntas em linguagem natural e recebam visualizações de dados como resposta.

## Tecnologias Utilizadas

- **Frontend Framework**: Vue 3 + Vite
- **Componentes UI**: Tailwind + shadcn
- **Tabela**: Vue Good Table
- **Gráficos**: Chart.js via Vue wrapper
- **Exportação**: xlsx + jspdf
- **Requisições HTTP**: axios
- **Gerenciamento de estado**: Sistema reativo padrão do Vue (ref/reactive)
- **Controle de sessão**: JWT com localStorage

## Estrutura do Projeto

```
src/
├── assets/
├── components/
│   ├── ChatInput.vue
│   ├── ResultTable.vue
│   ├── ResultChart.vue
│   ├── ExportButtons.vue
│   └── LoadingStatus.vue
├── views/
│   └── Dashboard.vue
├── services/
│   └── api.js
├── App.vue
├── main.js
```

## Fluxo da Aplicação

1. O usuário digita uma pergunta no componente ChatInput
2. A pergunta é enviada via axios.post para a API do agente
3. A resposta traz:
   - SQL gerado
   - Dados do relatório
   - Sugestão de tipo de gráfico (bar, pie, line, etc)
4. Os dados são exibidos em:
   - Tabela (ResultTable)
   - Gráfico (ResultChart)
   - Botões para exportar (ExportButtons)

## Componentes

### ChatInput.vue
Componente para entrada de perguntas do usuário, com botão de envio e feedback visual durante o carregamento.

### ResultTable.vue
Exibe os dados retornados pela API em formato de tabela, com recursos de paginação e busca.

### ResultChart.vue
Visualiza os dados em diferentes tipos de gráficos (barra, linha, pizza, etc.) conforme sugerido pela API.

### ExportButtons.vue
Permite exportar os dados para formatos Excel e PDF.

### LoadingStatus.vue
Exibe indicador de carregamento durante as operações assíncronas.

## Deploy

O projeto está configurado para deploy automático via GitHub Actions. Quando um push é feito para a branch main, o workflow executa:

1. Checkout do código
2. Setup do Node.js
3. Instalação de dependências
4. Build do projeto
5. Deploy para GitHub Pages (branch gh-pages)

## Configuração Inicial

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Compilar para produção
npm run build
```

## Conexão com a API

O serviço api.js está configurado para se comunicar com o backend, incluindo autenticação JWT. A URL base da API deve ser configurada no arquivo .env:

```
VUE_APP_API_URL=https://sua-api.exemplo.com
```
