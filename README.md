# Revalor - Marketplace de Economia Circular (Backend/API)

Backend desenvolvido em **Node.js** com **Express** e banco de dados **MySQL** utilizando o ORM **Sequelize**.
O objetivo dessa API é prover as regras de negócio para o marketplace B2B **Revalor**, permitindo que Indústrias divulguem seus resíduos e Empresas compradoras realizem compras/transações seguras.

---

## 1. Arquitetura Utilizada

O projeto segue um padrão **MVC adaptado para APIs RESTful**, separando as responsabilidades para manter o código flexível, legível e de fácil manutenção:

*   **`src/config/`**: Arquivos de configuração externos. Aqui guardamos a configuração de como o banco de dados via Sequelize irá conectar, mapeando para o arquivo local `.env`.
*   **`src/models/`**: Representa a base de dados em forma de classes/objetos. Cada arquivo descreve os atributos de uma tabela (ex: `Usuario`, `Residuo`) e seus relacionamentos.
*   **`src/migrations/`**: Script de versionamento do banco de dados. Serve para criar, alterar e desfazer tabelas sistematicamente de forma padronizada via terminal.
*   **`src/controllers/`**: Recebe os dados de requisições HTTP, interpela os Services/Models se necessário, e retorna respostas HTTP padronizadas. 
*   **`src/services/`**: Concentra regras de negócio pesadas ou isoladas. Por exemplo, os cálculos e abstrações de transações ficam no Service.  
*   **`src/routes/`**: Define os Endpoints (`/api/register`, `/api/residuos`) e atrela cada rota ao seu devido Controlador, eventualmente injetando Middlewares no caminho.
*   **`src/middlewares/`**: Trechos de código que interceptam requisições. Usado para segurança: injetar regras CORS, validar JWT de autorização e separar domínios de `INDUSTRIA` vs `EMPRESA`.
*   **`src/app.js`**: Reúne os middlewares da aplicação base (CORS, body parser json) e atrela com o indexador de rotas.
*   **`server.js`**: O ponto de partida principal da aplicação. Responsável apenas por instanciar a escuta de portas do `app.js` e estabelecer teste rápido com o banco de dados.

---

## 2. Passo a Passo Inicial

Para testar ou rodar na sua máquina de desenvolvimento de forma integrada, siga as instruções estritas:

### 2.1. Preparando o Ambiente / Instalação
1. Certifique-se de que o **MySQL** está rodando em segundo plano nativamente ou via contêineres XAMPP / Docker.
2. Crie manualmente o seu banco de dados no seu cliente SGBD (ex: MySQL Workbench):
   ```sql
   CREATE DATABASE revalor_db;
   ```
3. Na pasta root `BACK-END`, crie ou verifique o arquivo `.env` para apontar ao seu banco de dados. Exemplo prático do `.env`:
   ```env
   PORT=3000

   # Configurações do MySQL (Ajustar a senha conforme o seu banco local)
   DB_HOST=127.0.0.1
   DB_USER=root
   DB_PASS=sua_senha_do_banco
   DB_NAME=revalor_db
   DB_DIALECT=mysql

   # Segredo para assinatura de Tokens JWT
   JWT_SECRET=revalor_super_secret_key_12345
   ```
4. Pelo terminal (dentro da pasta `BACK-END/`), instale todas as dependências do projeto listadas no `package.json`: 
   ```bash
   npm install
   ```

### 2.2. Executar as Migrations (Criar as tabelas no Banco de Dados)
Use a CLI do CLI Sequelize apontando para a execução local das migrations que vão disparar os `CREATE TABLES`:
```bash
npx sequelize-cli db:migrate
```

### 2.3. Executando o Servidor Node
Inicie o Express (irá rodar na `PORT` especificada no arquivo `.env`, o padrão é 3000):
```bash
node server.js
```
Ou para ambiente de dev rodando hot-reload:
```bash
npx nodemon server.js
```

Se tiver sucesso, exibe no seu terminal:  
*Servidor rodando na porta 3000*  
*Conexão com o banco de dados estabelecida com sucesso.*

---

## 3. Documentação das Rotas da API

Todas as rotas expostas estão prefixadas com `/api`.

### Autenticação 

#### `POST /api/auth/register`
**Descrição:** Rota não autenticada que cadastra um novo usuário.
**Body:**
```json
{
  "nome": "Metalúrgica Stark",
  "email": "contato@stark.com",
  "senha": "password123",
  "tipo": "INDUSTRIA",
  "telefones": ["(11) 99999-1111", "(11) 3213-3333"]
}
```
**Resposta 201 (Sucesso):** 
```json
{
  "message": "Usuário cadastrado com sucesso!",
  "usuario": { "id": 1, "nome": "Metalúrgica Stark", "email": "...", "tipo": "INDUSTRIA" }
}
```

#### `POST /api/auth/login`
**Descrição:** Obtém Token JWT de um usuário recém cadastrado.
**Body:**
```json
{
  "email": "contato@stark.com",
  "senha": "password123"
}
```
**Resposta 200 (Sucesso):** O token DEVE ser salvo em localStorage.
```json
{
  "message": "Login realizado com sucesso.",
  "token": "eyJhbGciOi...",
  "usuario": { "id": 1, "nome": "Metalúrgica Stark", "tipo": "INDUSTRIA" }
}
```

---

### Resíduos (Catálogo e Criação)

> **ATENÇÃO**: As próximas rotas precisam do header HTTP Authorization.
> Para enviá-lo pelo front, set o cabeçalho request para: `{ "Authorization": "Bearer SEU_TOKEN" }` 

#### `GET /api/residuos`
**Descrição:** Permite leitura livre do feed de resíduos disponíveis.
**Parâmetros de Permissão:** Qualquer Perfil autenticado (INDUSTRIA e EMPRESA).
**Query Strings Aceitas (Filtros):** `?estadoFisico=Sólido` ou `?categorias=Metal`
**Resposta 200:** Array JSON com cada resíduo.

#### `POST /api/residuos`
**Descrição:** Utilizado por Indústrias para cadastrar um material disponível à venda.
**Parâmetros de Permissão:** APENAS Usuários do TIPO = `INDUSTRIA`.
**Body:**
```json
{
  "nome": "Cobre Descartado Nível A",
  "descricao": "Lotes de fios de cobre 100% puro remanescentes de estocagem XYZ.",
  "estadoFisico": "Sólido",
  "categorias": "Metal, Fios",
  "pesoDisponivel": 500.5,
  "valorPorKg": 15.0
}
```

---

### Transações e Cesta de Checkout

#### `POST /api/transacoes/checkout`
**Descrição:** Dispara uma ação de compra de uma Empresa adquirindo certo peso do lote de uma Industria.
**Parâmetros de Permissão:** APENAS Usuários do TIPO = `EMPRESA`.
**Regras Injetadas Backend:** O Service Backend autoinjeta uma **TAXA DE SERVIÇO DE 5%** em cima do peso comprado versus preço atual.
**Body:**
```json
{
  "residuo_id": 1,
  "pesoComprado": 100.0
}
```
**Resposta 201 (Sucesso):** Resposta comprova valor Bruto vs Valor Total calculado com o Add-On embutido pelo service.
```json
{
  "message": "Transação iniciada com sucesso!",
  "transacao": {
    "pesoComprado": 100,
    "valorBruto": 1500.0,
    "taxaPlataforma": 0.05,
    "valorTotal": 1575.0,
    "status": "CRIADA",
    "residuo_id": 1,
    "...": "..."
  }
}
```

---

## 4. Conectar a API ao Frontend React / Vite

Para ligar essa maravilha ao seu React no Frontend (que roda em `http://localhost:5173`), preparamos o **Middleware de CORS** (ver em `src/app.js`) para aceitar exclusivamente origens partindo desse host local.

No seu React, você utilizará o pacote bibliotecário universal `axios` ou a base unificada de `fetch`. Exemplo base recomendável a ser feito lá:

1. Instale Axios no Front: `npm install axios`
2. Crie uma abstração global de Base-URL no Front: `api.js`

```javascript
// no Frontend: src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Esta URL se conecta ao Express Backend
});

// Interceptor p/ anexar dinamicamente o LocalStorage JWT nas rotas de Catálogo:
api.interceptors.request.use(async config => {
  const token = localStorage.getItem('revalor-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```
