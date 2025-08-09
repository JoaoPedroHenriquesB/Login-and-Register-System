# 🔐 Sistema de Login e Registro

> **Projeto de Estudo** - Sistema completo de autenticação web com frontend e backend separados

## 🎯 Objetivos de Aprendizado

- **Frontend**: HTML5, CSS3 e JavaScript vanilla
- **Backend**: Node.js com Express.js
- **Banco de Dados**: PostgreSQL (produção) e MySQL (desenvolvimento)
- **Segurança**: Hash de senhas com bcrypt
- **Deploy**: GitHub Pages + Render
- **Arquitetura**: Separação entre frontend e backend (API REST)

## 🚀 Funcionalidades

### ✅ Implementadas
- [x] **Registro de usuários** com validação de campos
- [x] **Login seguro** com autenticação
- [x] **Hash de senhas** usando bcrypt
- [x] **Interface responsiva** e moderna
- [x] **Validação de dados** no frontend e backend
- [x] **Tratamento de erros** com mensagens claras
- [x] **CORS configurado** para comunicação entre domínios
- [x] **Deploy automatizado** em plataformas gratuitas

### 🔄 Alternância entre Formulários
- Interface única com transição suave entre login e registro
- Validação em tempo real dos campos
- Feedback visual para o usuário

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna e responsiva
- **JavaScript ES6+** - Interatividade e comunicação com API

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **bcryptjs** - Hash seguro de senhas
- **cors** - Configuração de CORS
- **body-parser** - Parse de requisições JSON

### Banco de Dados
- **PostgreSQL** - Produção (Render)
- **MySQL** - Desenvolvimento local
- **Configuração híbrida** - Detecta ambiente automaticamente

### Deploy e Hospedagem
- **GitHub Pages** - Frontend estático
- **Render** - Backend Node.js + PostgreSQL
- **Git** - Controle de versão

## 📁 Estrutura do Projeto

```
sistema-de-login/
├── Frontend/
│   ├── script.js          # Lógica do frontend
│   └── style.css          # Estilos CSS
├── Backend/
│   ├── Database/
│   │   ├── db.js          # Configuração do banco
│   │   └── init.js        # Inicialização automática
│   ├── routes/
│   │   └── auth.js        # Rotas de autenticação
│   └── server.js          # Servidor Express
├── index.html             # Página principal
├── package.json           # Dependências e scripts
├── .env                   # Variáveis de ambiente (local)
└── README.md             # Documentação
```

## 🔧 Instalação e Uso

### Pré-requisitos
- Node.js (v14 ou superior)
- MySQL (para desenvolvimento local)
- Git

### 1. Clone o repositório
```bash
git clone https://github.com/JoaoPedroHenriquesB/Login-and-Register-System.git
cd sistema-de-login
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o ambiente local
Crie um arquivo `.env` na raiz do projeto:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=login_register
```

### 4. Execute o servidor
```bash
npm start
```

### 5. Acesse a aplicação
- **Frontend**: Abra `index.html` no navegador
- **Backend**: http://localhost:3001
- **API Health**: http://localhost:3001/health

## 🌐 Deploy

### Frontend (GitHub Pages)
1. Faça push do código para o GitHub
2. Ative GitHub Pages nas configurações do repositório
3. Acesse: `https://seu-usuario.github.io/nome-do-repo`

### Backend (Render)
1. Conecte o repositório ao Render
2. Configure as variáveis de ambiente:
   - `NODE_ENV=production`
   - `DB_URL=sua_url_postgresql`
3. Deploy automático a cada push

## 📡 API Endpoints

### Autenticação

#### POST `/auth/register`
Registra um novo usuário
```json
{
  "username": "usuario",
  "email": "email@exemplo.com",
  "password": "senha123"
}
```

#### POST `/auth/login`
Autentica um usuário
```json
{
  "username": "usuario",
  "password": "senha123"
}
```

### Utilitários

#### GET `/`
Status da API
```json
{
  "message": "API do sistema de login está rodando!",
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### GET `/health`
Health check
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔒 Segurança

- **Hash de senhas** com bcrypt (salt rounds: 10)
- **Validação de entrada** no frontend e backend
- **CORS configurado** para domínios específicos
- **Sanitização de dados** antes de inserir no banco
- **Tratamento de erros** sem exposição de dados sensíveis

## 🎨 Interface

### Design
- **Tema escuro** com contraste adequado
- **Layout centralizado** e responsivo
- **Transições suaves** entre formulários
- **Feedback visual** para ações do usuário

### Responsividade
- Compatível com desktop, tablet e mobile
- Layout flexível que se adapta a diferentes tamanhos de tela

## 📚 Aprendizados

### Conceitos Aplicados
1. **Arquitetura REST** - Separação clara entre frontend e backend
2. **Autenticação** - Implementação segura de login/registro
3. **Deploy Full-Stack** - Hospedagem em plataformas diferentes
4. **Configuração de Ambiente** - Variáveis de ambiente e configurações
5. **Tratamento de Erros** - Feedback adequado para o usuário
6. **CORS** - Comunicação entre domínios diferentes

### Desafios Superados
- Configuração de CORS para comunicação entre GitHub Pages e Render
- Configuração híbrida de banco de dados (MySQL local + PostgreSQL produção)
- Deploy e configuração de variáveis de ambiente
- Tratamento adequado de erros de rede e banco de dados

## 🤝 Contribuição

Este é um projeto de estudo, mas sugestões e melhorias são bem-vindas!

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 👨‍💻 Autor

**João Pedro Henriques Balbino**
- GitHub: https://github.com/JoaoPedroHenriquesB
- Email: joaopedrohbalbino@gmail.com

---

⭐ **Se este projeto te ajudou nos estudos, deixe uma estrela!**

## 📝 Notas de Desenvolvimento

### Versão Atual: 1.0.0
- Sistema básico de login/registro funcional
- Deploy em produção configurado
- Documentação completa

### Próximas Melhorias (Roadmap)
- [ ] Implementar JWT para sessões
- [ ] Adicionar recuperação de senha
- [ ] Dashboard do usuário após login
- [ ] Testes automatizados
- [ ] Validação de email
- [ ] Rate limiting para segurança
