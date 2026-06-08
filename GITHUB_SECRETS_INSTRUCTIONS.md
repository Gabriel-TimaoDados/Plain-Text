# Configurar GitHub Secrets para CI/CD

## Passo 1: Acessar GitHub Secrets

1. Vá para seu repositório no GitHub
2. Clique em **Settings** → **Secrets and variables** → **Actions**
3. Clique em **New repository secret**

## Passo 2: Adicionar Secrets

### 1. VERCEL_TOKEN
- **Descrição**: Token de autenticação do Vercel
- **Como obter**: 
  - Acesse [vercel.com/account/tokens](https://vercel.com/account/tokens)
  - Clique em "Create Token"
  - Copie o token gerado
- **Valor**: Cole o token

### 2. VERCEL_ORG_ID
- **Descrição**: ID da organização no Vercel
- **Como obter**:
  - Acesse [vercel.com/account/settings](https://vercel.com/account/settings)
  - Procure por "Team ID" ou "Org ID"
- **Valor**: Cole o ID

### 3. VERCEL_PROJECT_ID
- **Descrição**: ID do projeto no Vercel
- **Como obter**:
  - Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
  - Clique no projeto "timao-dados"
  - Vá em Settings → General
  - Procure por "Project ID"
- **Valor**: Cole o ID

### 4. GCP_PROJECT
- **Descrição**: ID do projeto Google Cloud
- **Como obter**:
  - Acesse [console.cloud.google.com](https://console.cloud.google.com)
  - Selecione seu projeto
  - Copie o Project ID
- **Valor**: Cole o Project ID

### 5. GCP_SA_KEY
- **Descrição**: Chave de conta de serviço do Google Cloud (JSON)
- **Como obter**:
  - Acesse [console.cloud.google.com](https://console.cloud.google.com)
  - Vá em IAM & Admin → Service Accounts
  - Clique na conta de serviço
  - Vá em Keys → Add Key → Create new key
  - Selecione JSON e baixe
  - Copie o conteúdo do arquivo JSON
- **Valor**: Cole o JSON completo

### 6. SENTRY_AUTH_TOKEN
- **Descrição**: Token de autenticação do Sentry
- **Como obter**:
  - Acesse [sentry.io/settings/auth-tokens/](https://sentry.io/settings/auth-tokens/)
  - Clique em "Create New Token"
  - Selecione escopos: `project:releases`, `org:read`
  - Copie o token
- **Valor**: Cole o token

### 7. SENTRY_ORG
- **Descrição**: Slug da organização no Sentry
- **Como obter**:
  - Acesse [sentry.io/settings/](https://sentry.io/settings/)
  - Procure pelo slug da organização na URL
- **Valor**: Cole o slug (ex: "minha-org")

### 8. SENTRY_PROJECT
- **Descrição**: Slug do projeto no Sentry
- **Como obter**:
  - Acesse seu projeto no Sentry
  - Procure pelo slug do projeto na URL
- **Valor**: Cole o slug (ex: "timao-dados")

### 9. SLACK_WEBHOOK_URL
- **Descrição**: URL do webhook do Slack para notificações
- **Como obter**:
  - Acesse [api.slack.com/apps](https://api.slack.com/apps)
  - Selecione seu app
  - Vá em Incoming Webhooks
  - Clique em "Add New Webhook to Workspace"
  - Copie a URL do webhook
- **Valor**: Cole a URL completa

### 10. EXPO_TOKEN
- **Descrição**: Token de autenticação do Expo
- **Como obter**:
  - Execute: `eas login`
  - Execute: `eas credentials`
  - Copie o token exibido
- **Valor**: Cole o token

### 11. APPLE_ID
- **Descrição**: Apple ID para submissão na App Store
- **Como obter**:
  - Use seu Apple ID pessoal ou de empresa
- **Valor**: Cole seu Apple ID (email)

## Passo 3: Verificar Secrets

Após adicionar todos os secrets, você pode verificar em:
**Settings** → **Secrets and variables** → **Actions**

## Próximos Passos

1. Após configurar todos os secrets, faça um commit:
   ```bash
   git add .
   git commit -m "chore: v2.7.0 - Ready for publication with CI/CD"
   git push origin main
   ```

2. Os workflows automáticos serão ativados:
   - `test-and-build.yml` - Testa e faz build
   - `deploy.yml` - Faz deploy para produção

3. Acompanhe o progresso em: **Actions** → Selecione o workflow

## Troubleshooting

- **Erro de autenticação**: Verifique se o token está correto
- **Build falha**: Verifique os logs em Actions
- **Deploy não funciona**: Confirme que todos os secrets estão configurados
