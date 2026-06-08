# 🔐 GitHub Secrets Setup Guide

## Visão Geral

Este guia descreve como configurar todos os secrets necessários no GitHub para ativar CI/CD automático.

---

## 1. Acessar GitHub Secrets

1. Acesse seu repositório no GitHub
2. Vá para **Settings** → **Secrets and variables** → **Actions**
3. Clique em **New repository secret**

---

## 2. Secrets Necessários

### 2.1 Vercel (Deploy Web)

#### VERCEL_TOKEN
```
Descrição: Token de autenticação Vercel
Obter em: https://vercel.com/account/tokens
Passos:
1. Acesse https://vercel.com/account/tokens
2. Clique em "Create Token"
3. Nome: "GitHub Actions"
4. Copie o token
```

#### VERCEL_ORG_ID
```
Descrição: ID da organização Vercel
Obter em: https://vercel.com/account/settings
Passos:
1. Acesse https://vercel.com/account/settings
2. Procure por "Team ID" ou "Org ID"
3. Copie o ID
```

#### VERCEL_PROJECT_ID
```
Descrição: ID do projeto Timão Dados no Vercel
Obter em: Vercel Dashboard
Passos:
1. Acesse https://vercel.com/dashboard
2. Selecione projeto "timao-dados"
3. Vá para Settings → General
4. Procure por "Project ID"
5. Copie o ID
```

### 2.2 Google Cloud (Deploy Server)

#### GCP_PROJECT
```
Descrição: ID do projeto Google Cloud
Obter em: https://console.cloud.google.com
Passos:
1. Acesse https://console.cloud.google.com
2. Clique no seletor de projeto (topo)
3. Copie o "Project ID"
```

#### GCP_SA_KEY
```
Descrição: Chave JSON da Service Account
Obter em: Google Cloud Console
Passos:
1. Acesse https://console.cloud.google.com
2. Vá para "Service Accounts"
3. Selecione "timao-dados-ci"
4. Vá para "Keys"
5. Clique em "Add Key" → "Create new key"
6. Selecione "JSON"
7. Copie todo o conteúdo JSON
8. Cole como secret (será base64 codificado automaticamente)
```

### 2.3 Sentry (Crash Reporting)

#### SENTRY_AUTH_TOKEN
```
Descrição: Token de autenticação Sentry
Obter em: https://sentry.io/settings/account/api/auth-tokens/
Passos:
1. Acesse https://sentry.io/settings/account/api/auth-tokens/
2. Clique em "Create New Token"
3. Selecione scopes: "project:releases", "org:read"
4. Copie o token
```

#### SENTRY_ORG
```
Descrição: Slug da organização Sentry
Obter em: Sentry Dashboard
Passos:
1. Acesse https://sentry.io
2. Clique no seu nome (canto superior direito)
3. Vá para "Organization Settings"
4. Procure por "Organization Slug"
5. Copie o slug
```

#### SENTRY_PROJECT
```
Descrição: Slug do projeto Sentry
Obter em: Sentry Dashboard
Passos:
1. Acesse https://sentry.io
2. Selecione projeto "timao-dados"
3. Vá para "Settings"
4. Procure por "Project Slug"
5. Copie o slug
```

### 2.4 Slack (Notificações)

#### SLACK_WEBHOOK_URL
```
Descrição: URL do webhook Slack
Obter em: Slack App Configuration
Passos:
1. Acesse https://api.slack.com/apps
2. Selecione seu app ou crie novo
3. Vá para "Incoming Webhooks"
4. Clique em "Add New Webhook to Workspace"
5. Selecione canal "#timao-dados-alerts"
6. Copie a URL do webhook
```

### 2.5 Codecov (Coverage)

#### CODECOV_TOKEN
```
Descrição: Token Codecov (opcional para repos públicos)
Obter em: https://codecov.io
Passos:
1. Acesse https://codecov.io
2. Conecte seu repositório GitHub
3. Vá para Settings
4. Copie o token (se necessário)
```

### 2.6 Snyk (Security)

#### SNYK_TOKEN
```
Descrição: Token Snyk para security scanning
Obter em: https://app.snyk.io/account/settings
Passos:
1. Acesse https://app.snyk.io/account/settings
2. Vá para "API Token"
3. Clique em "Show" ou "Regenerate"
4. Copie o token
```

---

## 3. Adicionar Secrets no GitHub

### Método 1: Interface Web

```
1. Vá para Settings → Secrets and variables → Actions
2. Clique em "New repository secret"
3. Nome: VERCEL_TOKEN
4. Value: (cole o token)
5. Clique em "Add secret"
6. Repita para cada secret
```

### Método 2: GitHub CLI

```bash
# Login
gh auth login

# Adicionar secrets
gh secret set VERCEL_TOKEN --body "seu-token-aqui"
gh secret set VERCEL_ORG_ID --body "seu-org-id"
gh secret set VERCEL_PROJECT_ID --body "seu-project-id"
gh secret set GCP_PROJECT --body "seu-project-id"
gh secret set GCP_SA_KEY --body "$(cat key.json | base64)"
gh secret set SENTRY_AUTH_TOKEN --body "seu-token"
gh secret set SENTRY_ORG --body "seu-org"
gh secret set SENTRY_PROJECT --body "seu-project"
gh secret set SLACK_WEBHOOK_URL --body "https://hooks.slack.com/..."
gh secret set CODECOV_TOKEN --body "seu-token"
gh secret set SNYK_TOKEN --body "seu-token"
```

---

## 4. Verificar Secrets

```bash
# Listar todos os secrets
gh secret list

# Verificar se um secret foi adicionado
gh secret list | grep VERCEL_TOKEN
```

---

## 5. Testar CI/CD

### 5.1 Fazer Commit e Push

```bash
# Fazer commit
git add .
git commit -m "Configure CI/CD pipeline"

# Push para main
git push origin main

# Ou push para develop para testar
git push origin develop
```

### 5.2 Acompanhar Workflow

1. Acesse seu repositório no GitHub
2. Vá para **Actions**
3. Selecione o workflow "Test and Build"
4. Acompanhe a execução em tempo real

### 5.3 Verificar Logs

```bash
# Ver logs do último workflow
gh run list --limit 1

# Ver detalhes de um workflow específico
gh run view RUN_ID --log
```

---

## 6. Troubleshooting

### Workflow falha com "Secret not found"

```
Solução:
1. Verifique o nome do secret (case-sensitive)
2. Certifique-se de que foi adicionado no repositório correto
3. Aguarde alguns segundos após adicionar o secret
4. Reexecute o workflow
```

### Build falha no Vercel

```
Solução:
1. Verifique VERCEL_TOKEN está correto
2. Verifique VERCEL_ORG_ID está correto
3. Verifique VERCEL_PROJECT_ID está correto
4. Verifique permissões da Service Account
```

### Deploy falha no Google Cloud

```
Solução:
1. Verifique GCP_SA_KEY é válido JSON
2. Verifique GCP_PROJECT está correto
3. Verifique Service Account tem permissões
4. Verifique Cloud Run API está habilitada
```

### Sentry não recebe eventos

```
Solução:
1. Verifique SENTRY_AUTH_TOKEN está correto
2. Verifique SENTRY_ORG está correto
3. Verifique SENTRY_PROJECT está correto
4. Verifique projeto existe em Sentry
```

---

## 7. Segurança

### Boas Práticas

- ✅ Use tokens com escopo mínimo necessário
- ✅ Regenere tokens periodicamente
- ✅ Não compartilhe secrets
- ✅ Revogue tokens antigos
- ✅ Use diferentes tokens para dev/prod
- ❌ Não commite secrets no repositório
- ❌ Não exponha secrets em logs
- ❌ Não use secrets em workflows públicos

### Revogar Secrets

Se um secret foi comprometido:

```bash
# Revogar token Vercel
vercel token delete TOKEN_ID

# Revogar token Sentry
# Acesse https://sentry.io/settings/account/api/auth-tokens/

# Revogar token Snyk
# Acesse https://app.snyk.io/account/settings

# Regenerar Google Cloud key
gcloud iam service-accounts keys delete KEY_ID \
  --iam-account=timao-dados-ci@PROJECT_ID.iam.gserviceaccount.com
```

---

## 8. Checklist Final

- [ ] VERCEL_TOKEN adicionado
- [ ] VERCEL_ORG_ID adicionado
- [ ] VERCEL_PROJECT_ID adicionado
- [ ] GCP_PROJECT adicionado
- [ ] GCP_SA_KEY adicionado
- [ ] SENTRY_AUTH_TOKEN adicionado
- [ ] SENTRY_ORG adicionado
- [ ] SENTRY_PROJECT adicionado
- [ ] SLACK_WEBHOOK_URL adicionado
- [ ] CODECOV_TOKEN adicionado (opcional)
- [ ] SNYK_TOKEN adicionado (opcional)
- [ ] Workflow "Test and Build" executado com sucesso
- [ ] Workflow "Deploy" pronto para produção

---

**Data:** 5 de Junho de 2026  
**Versão:** 2.7.0  
**Status:** ✅ PRONTO PARA CONFIGURAÇÃO
