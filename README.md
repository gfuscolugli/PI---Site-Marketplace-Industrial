# Revalor – Marketplace de Economia Circular

Projeto interdisciplinar focado no desenvolvimento do ecossistema **Revalor**, um marketplace B2B de economia circular. A plataforma permite que Indústrias divulguem seus resíduos industriais e Empresas compradoras realizem transações e aquisições seguras de forma sustentável.

O sistema possui uma arquitetura desacoplada distribuída em duas aplicações principais:
* **`/frontend`**: Aplicação cliente desenvolvida em **React** com **Vite** e estilizada via **Tailwind CSS**.
* **`/backend`**: API RESTful desenvolvida em **Node.js** com **Express** e persistência em **MySQL** via ORM **Sequelize**.

---

## 1. Estrutura de Diretórios e Arquitetura

O repositório organiza as camadas de software de forma isolada para garantir legibilidade e manutenibilidade:

📂 PI---Site-Marketplace-Industrial/
├── 📂 backend/     # API RESTful (Node.js, Express, Sequelize, MySQL)
└── 📂 frontend/    # Interface do Usuário (React, Vite, Tailwind CSS)

### 🧠 Arquitetura do Backend (`/backend`)
O lado do servidor segue uma variação do padrão **MVC (Model-View-Controller)** adaptado para responder dados estruturados (JSON):

* **`src/config/`**: Concentra os arquivos de configuração de dependências externas. Mapeia as credenciais do banco Sequelize consumindo o arquivo local `.env`.
* **`src/models/`**: Camada de persistência. Mapeia as entidades e tabelas relacionais em formato de classes JavaScript (`Usuario`, `Residuo`, `Transacao`).
* **`src/migrations/`**: Scripts de versionamento e evolução estrutural do banco de dados. Permitem recriar e subir o esquema sistematicamente via linha de comando.
* **`src/controllers/`**: Responsável por receber as requisições HTTP, delegar tarefas aos Services ou Models e devolver as respostas REST correspondentes.
* **`src/services/`**: Concentra as regras de negócio isoladas (ex: cálculo abstrato do checkout aplicando a **taxa de conveniência de 5%** sobre o montante).
* **`src/routes/`**: Expõe e centraliza os caminhos de Endpoints (`/api/auth/...`, `/api/residuos`), vinculando os middlewares necessários de segurança.
* **`src/middlewares/`**: Filtros interceptadores. Responsáveis pela validação das chaves JWT de sessão, controle de escopo de acessos (`INDUSTRIA` vs `EMPRESA`) e liberação de políticas de CORS.
* **`app.js`**: Reúne os middlewares de parsing globais (Express JSON e CORS) e acopla a árvore de rotas principais.
* **`server.js`**: Arquivo de inicialização (Entrypoint) do servidor HTTP. Dispara a escuta de portas da aplicação Express e testa a conectividade ativa com o dialeto MySQL.

---

## 2. Passo a Passo Inicial (Ambiente do Professor / Avaliador)

Para clonar e testar o ecossistema integrado rodando localmente na sua máquina de testes, siga rigorosamente as instruções abaixo:

### 2.1. Preparando o Ambiente / Instalação do Banco

1. Certifique-se de que o **MySQL Server** está ativo em segundo plano no seu computador na porta padrão `15343`.
2. Abra o seu cliente SGBD de preferência (ex: *MySQL Workbench*) e crie manualmente o esquema vazio da aplicação executando:
   CREATE DATABASE defaultdb;
3. Navegue até a pasta root `backend/`. Por motivos de segurança, as chaves reais são ignoradas pelo Git. Você deve **criar manualmente um arquivo chamado `.env`** nesse diretório. Copie a estrutura padrão de desenvolvimento abaixo e configure a senha de acesso ao seu MySQL local:
   
   PORT=3000
   DB_HOST=127.0.0.1
   DB_PORT=15343
   DB_USER=root
   DB_PASS=SUA_SENHA_LOCAL_DO_MYSQL_AQUI
   DB_NAME=defaultdb
   DB_DIALECT=mysql
   JWT_SECRET=revalor_super_secret_key_12345
   MERCADOPAGO_ACCESS_TOKEN=seu_token_aqui

---

## 3. Como Inicializar o Ecossistema Completamente

A aplicação necessita que o Frontend e o Backend rodem de forma concomitante. Utilize dois terminais paralelos em seu editor para disparar os processos:

### 🟢 Terminal 1: Servidor de API (Backend)
Entre na pasta do servidor, instale os pacotes necessários, sincronize as tabelas via Migrations e inicie o monitoramento via Nodemon:
cd backend
npm install
npx sequelize-cli db:migrate
npm run dev
*(Se a conexão for efetuada, o terminal indicará estável na porta 3000).*

### ⚛️ Terminal 2: Interface Web (Frontend)
Em um segundo terminal paralelo, acesse a pasta da interface, instale as dependências e inicialize o servidor de desenvolvimento do Vite:
cd frontend
npm install
npm run dev
*(O console exibirá o link do cliente disponível na porta padrão http://localhost:5173/).*
---

## 4. Documentação das Rotas da API

Todas as rotas expostas pela API estão obrigatoriamente prefixadas com `/api`.

> 🔒 *Rotas marcadas com o cadeado exigem o envio explícito do Token JWT no Header HTTP da requisição:* > `Authorization: Bearer <SEU_TOKEN_JWT>`

---

### Módulo de Autenticação

#### `POST /api/auth/register`
**Descrição:** Realiza o cadastro público de uma nova organização corporativa no marketplace.

**Body (JSON):**
{
  "nome": "Metalúrgica Stark",
  "email": "contato@stark.com",
  "senha": "password123",
  "tipo": "INDUSTRIA",
  "telefones": ["(11) 99999-1111", "(11) 3213-3333"]
}

**Resposta Esperada (210/201 Sucesso):**
{
  "message": "Usuário cadastrado com sucesso!",
  "usuario": { "id": 1, "nome": "Metalúrgica Stark", "email": "contato@stark.com", "tipo": "INDUSTRIA" }
}

---

#### `POST /api/auth/login`
**Descrição:** Autentica as credenciais e emite o Token de autorização.

**Body (JSON):**
{
  "email": "contato@stark.com",
  "senha": "password123"
}

**Resposta Esperada (200 Sucesso):**
{
  "message": "Login realizado com sucesso.",
  "token": "eyJhbGciOi...",
  "usuario": { "id": 1, "nome": "Metalúrgica Stark", "tipo": "INDUSTRIA" }
}

---

### Módulo de Resíduos (Catálogo e Criação)

#### 🔒 `GET /api/residuos`
**Descrição:** Fornece a listagem total e feed de resíduos industriais publicados e disponíveis para compra. Aceita filtros via Query String (`?estadoFisico=Sólido` ou `?categorias=Metal`).

#### 🔒 `POST /api/residuos`
**Descrição:** Utilizado exclusivamente por contas do tipo `INDUSTRIA` para registrar a disponibilidade de um lote de refugo técnico.

**Body (JSON):**
{
  "nome": "Cobre Descartado Nível A",
  "descricao": "Lotes de fios de cobre 100% puro remanescentes de estocagem XYZ.",
  "estadoFisico": "Sólido",
  "categorias": "Metal, Fios",
  "pesoDisponivel": 500.5,
  "valorPorKg": 15.0
}

---

### Módulo Financeiro e Transações

#### 🔒 `GET /api/transacoes/saldo`
**Descrição:** Consulta a carteira virtual interna da organização autenticada.

#### 🔒 `POST /api/transacoes/financeiro`
**Descrição:** Processa a entrada de créditos (Depósito fictício via PIX/Boleto) ou saques operacionais na conta corrente.

#### 🔒 `POST /api/transacoes/checkout`
**Descrição:** Executa a ordem de compra de um lote específico de material. Permitido apenas para contas cadastradas como `EMPRESA`.
* **Nota de Negócio:** O sistema injeta automaticamente uma **taxa administrativa de 5%** calculada sobre o valor do peso adquirido (as requisições devem computar o peso em frações de toneladas).

**Body (JSON):**
{
  "residuo_id": 1,
  "pesoComprado": 100.0
}

**Resposta Esperada (201 Criado):**
{
  "message": "Transação iniciada com sucesso!",
  "transacao": {
    "pesoComprado": 100,
    "valorBruto": 1500.0,
    "taxaPlataforma": 0.05,
    "valorTotal": 1575.0,
    "status": "CRIADA",
    "residuo_id": 1
  }
}

---

## 5. Arquivo de Serviço do Cliente (Integração Frontend Axios)

No lado do Frontend React, a comunicação assíncrona é abstraída de forma centralizada pelo pacote Axios no arquivo localizado em `frontend/src/services/api.js`:

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Aponta diretamente para a porta ativa do Express
});

// Interceptor global para capturar e anexar dinamicamente o token JWT de autenticação:
api.interceptors.request.use(async config => {
  const token = localStorage.getItem('revalor-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;