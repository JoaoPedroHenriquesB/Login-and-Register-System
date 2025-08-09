# Deploy no Render - Instruções

## ✅ Correções Aplicadas

1. **package.json** - Corrigido caminho do servidor
2. **Inicialização automática** - Banco de dados criado automaticamente
3. **Logs melhorados** - Para debug mais fácil
4. **Health check** - Rota `/health` para monitoramento

## 🚀 Passos para Deploy

### 1. Commit e Push das Alterações
```bash
git add .
git commit -m "Fix: Corrigir configuração para Render"
git push origin main
```

### 2. Configurar no Render Dashboard

1. **Acesse**: https://dashboard.render.com
2. **New Web Service** → Conecte seu repositório GitHub
3. **Configurações**:
   - **Name**: `login-api` (ou outro nome)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

### 3. Configurar Banco PostgreSQL

1. **New PostgreSQL** no Render
2. **Configurações**:
   - **Name**: `login-db`
   - **Database**: `login_register`
   - **User**: `login_user`
   - **Plan**: `Free`

### 4. Configurar Variáveis de Ambiente

No seu Web Service, adicione:
```
NODE_ENV=production
DB_URL=[URL_DO_SEU_POSTGRESQL_DO_RENDER]
```

**⚠️ Importante**: Copie a **External Database URL** do seu PostgreSQL e cole em `DB_URL`

### 5. Deploy

1. Clique em **Deploy Latest Commit**
2. Aguarde o build completar
3. Teste a API acessando: `https://seu-app.onrender.com/`

## 🧪 Testando

### Teste da API
```bash
# Health check
curl https://seu-app.onrender.com/health

# Teste básico
curl https://seu-app.onrender.com/
```

### Teste de Registro
```bash
curl -X POST https://seu-app.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"teste","email":"teste@email.com","password":"123456"}'
```

## 🔧 Troubleshooting

### Se o deploy falhar:

1. **Verifique os logs** no Render Dashboard
2. **Confirme as variáveis** de ambiente
3. **Teste localmente**:
   ```bash
   npm install
   npm start
   ```

### Logs importantes para verificar:
- ✅ "Conectado ao banco de dados PostgreSQL"
- ✅ "Tabela users criada/verificada no PostgreSQL"
- ✅ "SERVIDOR RODANDO EM: http://localhost:PORT"

## 📝 Próximos Passos

Após o deploy bem-sucedido:

1. **Atualize a URL** no frontend (script.js) se necessário
2. **Teste login/registro** via GitHub Pages
3. **Configure domínio customizado** (opcional)

## 🆘 Se ainda houver problemas

Verifique:
- [ ] Todas as dependências estão no package.json
- [ ] Variável DB_URL está configurada corretamente
- [ ] Banco PostgreSQL está ativo no Render
- [ ] Logs não mostram erros de conexão