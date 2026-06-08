# 🚀 CI/CD Setup Guide - Timão Dados

## Visão Geral

Este documento descreve como configurar o CI/CD Pipeline para Timão Dados usando GitHub Actions, Sentry, Vercel e Google Cloud.

---

## 1. GitHub Actions Setup

### 1.1 Workflows Configurados

#### `test-and-build.yml`
- Executa testes em Node.js 18.x e 20.x
- Roda linter e type check
- Executa testes unitários
- Faz upload de cobertura para Codecov
- Faz build do servidor
- Executa scan de segurança com Snyk

**Trigger:** Push em `main` ou `develop`, Pull Requests

#### `deploy.yml`
- Deploy web para Vercel
- Deploy servidor para Google Cloud Run
- Notifica Sentry sobre release
- Envia notificação para Slack

**Trigger:** Push em `main`, tags `v*`, ou manual

### 1.2 Secrets Necessários

Configure os seguintes secrets no GitHub:

```
# Vercel
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID

# Google Cloud
GCP_PROJECT
GCP_SA_KEY

# Sentry
SENTRY_AUTH_TOKEN
SENTRY_ORG
SENTRY_PROJECT

# Slack
SLACK_WEBHOOK_URL

# Codecov
CODECOV_TOKEN

# Snyk
SNYK_TOKEN
```

---

## 2. Sentry Configuration

### 2.1 Criar Projeto no Sentry

1. Acesse [sentry.io](https://sentry.io)
2. Crie uma nova organização ou use existente
3. Crie um novo projeto para "React Native"
4. Copie o DSN fornecido

### 2.2 Configurar Alertas

#### Email Alerts
1. Vá para Project Settings → Alerts
2. Crie novo alert rule:
   - **Condition:** Error rate > 10 in 1 hour
   - **Action:** Send email to dev@timao-dados.app

#### Slack Integration
1. Vá para Integrations → Slack
2. Autorize o Slack workspace
3. Configure canal: `#timao-dados-alerts`

### 2.3 Variáveis de Ambiente

```bash
EXPO_PUBLIC_SENTRY_DSN=https://your-key@sentry.io/project-id
SENTRY_AUTH_TOKEN=your-auth-token
SENTRY_ORG=your-org
SENTRY_PROJECT=timao-dados
```

---

## 3. Vercel Setup (Web Deployment)

### 3.1 Criar Projeto no Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Importe repositório GitHub
3. Configure variáveis de ambiente:
   - `EXPO_PUBLIC_API_FOOTBALL_KEY`
   - `EXPO_PUBLIC_FIREBASE_CONFIG`
   - `EXPO_PUBLIC_SENTRY_DSN`

### 3.2 Configurar Deploy Automático

1. Vá para Project Settings → Git
2. Enable "Automatic Deployments" para `main`
3. Configure Preview Deployments para `develop`

### 3.3 Obter Tokens

```bash
# Login no Vercel CLI
vercel login

# Obter tokens
VERCEL_TOKEN=$(vercel token create)
VERCEL_ORG_ID=$(vercel whoami --token $VERCEL_TOKEN | grep -oP 'org_id: \K[^,]*')
VERCEL_PROJECT_ID=$(vercel projects ls --token $VERCEL_TOKEN | grep timao-dados | awk '{print $1}')
```

---

## 4. Google Cloud Setup (Server Deployment)

### 4.1 Criar Projeto no Google Cloud

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Crie novo projeto: `timao-dados`
3. Habilite APIs:
   - Cloud Run API
   - Cloud Build API
   - Container Registry API

### 4.2 Criar Service Account

```bash
# Criar service account
gcloud iam service-accounts create timao-dados-ci \
  --display-name="Timão Dados CI/CD"

# Dar permissões
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member=serviceAccount:timao-dados-ci@PROJECT_ID.iam.gserviceaccount.com \
  --role=roles/run.admin

# Criar chave JSON
gcloud iam service-accounts keys create key.json \
  --iam-account=timao-dados-ci@PROJECT_ID.iam.gserviceaccount.com

# Codificar em base64
cat key.json | base64
```

### 4.3 Configurar Cloud Run

```bash
# Deploy manual (teste)
gcloud run deploy timao-dados-server \
  --image gcr.io/PROJECT_ID/timao-dados:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars SENTRY_DSN=$SENTRY_DSN,DATABASE_URL=$DATABASE_URL
```

---

## 5. Codecov Setup

### 5.1 Integrar Codecov

1. Acesse [codecov.io](https://codecov.io)
2. Conecte repositório GitHub
3. Copie token (se privado)

### 5.2 Configurar Coverage

```bash
# No arquivo package.json
"test": "vitest run --coverage"

# Gerar coverage
pnpm test
```

---

## 6. Snyk Setup (Security Scanning)

### 6.1 Configurar Snyk

1. Acesse [snyk.io](https://snyk.io)
2. Conecte repositório GitHub
3. Crie token de autenticação

### 6.2 Executar Scan Local

```bash
# Instalar Snyk CLI
npm install -g snyk

# Login
snyk auth

# Scan
snyk test
```

---

## 7. Slack Integration

### 7.1 Criar Webhook

1. Acesse [api.slack.com/apps](https://api.slack.com/apps)
2. Crie novo app
3. Habilite "Incoming Webhooks"
4. Crie novo webhook para `#timao-dados-alerts`
5. Copie URL do webhook

### 7.2 Testar Webhook

```bash
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"Test message"}' \
  YOUR_WEBHOOK_URL
```

---

## 8. Executar Localmente

### 8.1 Simular CI/CD

```bash
# Instalar act (GitHub Actions local runner)
brew install act

# Executar workflow
act -j test
act -j build
act -j deploy
```

### 8.2 Testar Build

```bash
# Build server
pnpm build

# Build web
pnpm build:web

# Verificar saída
ls -la dist/
```

---

## 9. Monitoramento

### 9.1 Sentry Dashboard

- **Crash Rate:** Monitorar taxa de crashes
- **Performance:** Verificar transações lentas
- **Releases:** Acompanhar releases
- **Issues:** Resolver problemas reportados

### 9.2 Vercel Analytics

- **Performance:** Monitorar Core Web Vitals
- **Deployments:** Histórico de deploys
- **Usage:** Monitorar requisições

### 9.3 Google Cloud Monitoring

- **Cloud Run:** CPU, memória, latência
- **Cloud Build:** Tempo de build, falhas
- **Logs:** Erros e warnings

---

## 10. Troubleshooting

### Build falha com "Out of memory"

```bash
# Aumentar limite de memória
NODE_OPTIONS=--max-old-space-size=4096 pnpm build
```

### Tests timeout

```bash
# Aumentar timeout
pnpm test -- --testTimeout=10000
```

### Deploy falha no Vercel

```bash
# Verificar logs
vercel logs --follow

# Redeployar
vercel --prod
```

### Sentry não recebe eventos

```bash
# Verificar DSN
echo $EXPO_PUBLIC_SENTRY_DSN

# Testar conexão
curl -X POST https://sentry.io/api/0/projects/YOUR_ORG/YOUR_PROJECT/events/
```

---

## 11. Checklist de Publicação

- [ ] Todos os testes passando
- [ ] Cobertura de código > 80%
- [ ] Sem vulnerabilidades no Snyk
- [ ] Build completa sem erros
- [ ] Sentry configurado e testado
- [ ] Vercel deploy bem-sucedido
- [ ] Google Cloud Run deploy bem-sucedido
- [ ] Slack notificações funcionando
- [ ] Release notes atualizadas
- [ ] Versão bumped em package.json

---

## 12. Próximos Passos

1. **Integrar com GitHub Releases** - Criar releases automáticas
2. **Adicionar E2E Tests** - Cypress ou Playwright
3. **Implementar Blue-Green Deployment** - Zero downtime
4. **Configurar Rollback Automático** - Em caso de falha
5. **Adicionar Performance Budgets** - Monitorar tamanho do bundle

---

**Última atualização:** 5 de Junho de 2026  
**Versão:** 2.7.0  
**Status:** ✅ Pronto para Produção
