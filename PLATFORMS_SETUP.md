# 🌐 Platforms Setup Guide

## Visão Geral

Guia passo-a-passo para configurar contas em Sentry, Vercel e Google Cloud.

---

## 1. Sentry Setup

### 1.1 Criar Conta

1. Acesse [sentry.io](https://sentry.io)
2. Clique em "Sign Up"
3. Preencha formulário:
   - Email
   - Senha
   - Nome
4. Confirme email
5. Crie organização: "timao-dados"

### 1.2 Criar Projeto

1. Vá para Dashboard
2. Clique em "Create Project"
3. Selecione "React Native"
4. Nome: "timao-dados"
5. Team: (padrão)
6. Clique em "Create Project"

### 1.3 Obter DSN

1. Vá para Project Settings
2. Procure por "DSN (Client Key)"
3. Copie o DSN
4. Salve em variável de ambiente: `EXPO_PUBLIC_SENTRY_DSN`

### 1.4 Configurar Alertas

#### Email Alerts
1. Vá para Alerts
2. Clique em "Create Alert Rule"
3. Condição: "Error rate is above 10 in 1 hour"
4. Ação: "Send email to dev@timao-dados.app"
5. Salve

#### Slack Integration
1. Vá para Integrations
2. Procure por "Slack"
3. Clique em "Install"
4. Autorize no Slack
5. Selecione canal: "#timao-dados-alerts"
6. Configure notificações

### 1.5 Configurar Release Tracking

1. Vá para Project Settings → Release Tracking
2. Configure repositório: `https://github.com/timao-dados/almanaque-do-timao`
3. Habilite "Automatically create releases"

---

## 2. Vercel Setup

### 2.1 Criar Conta

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Sign Up"
3. Escolha "GitHub"
4. Autorize GitHub
5. Crie organização (opcional)

### 2.2 Importar Projeto

1. Vá para Dashboard
2. Clique em "Add New..."
3. Selecione "Project"
4. Selecione repositório "almanaque-do-timao"
5. Configure:
   - Framework: "Expo"
   - Root Directory: "./"
   - Build Command: "pnpm build:web"
   - Output Directory: "dist"

### 2.3 Adicionar Variáveis de Ambiente

1. Vá para Project Settings → Environment Variables
2. Adicione:
   - `EXPO_PUBLIC_API_FOOTBALL_KEY`
   - `EXPO_PUBLIC_FIREBASE_CONFIG`
   - `EXPO_PUBLIC_SENTRY_DSN`
   - `NODE_ENV=production`

### 2.4 Configurar Deploy Automático

1. Vá para Project Settings → Git
2. Habilite "Automatic Deployments"
3. Selecione branch: "main"
4. Habilite "Preview Deployments" para "develop"

### 2.5 Obter Tokens

```bash
# Login no Vercel CLI
npm install -g vercel
vercel login

# Obter VERCEL_TOKEN
vercel token create

# Obter VERCEL_ORG_ID
vercel whoami

# Obter VERCEL_PROJECT_ID
vercel projects ls | grep timao-dados
```

---

## 3. Google Cloud Setup

### 3.1 Criar Conta

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Clique em "Select a Project"
3. Clique em "New Project"
4. Nome: "Timão Dados"
5. Clique em "Create"

### 3.2 Habilitar APIs

1. Vá para "APIs & Services" → "Library"
2. Procure e habilite:
   - Cloud Run API
   - Cloud Build API
   - Container Registry API
   - Cloud Logging API

### 3.3 Criar Service Account

```bash
# Definir variáveis
PROJECT_ID="timao-dados"
SA_NAME="timao-dados-ci"

# Criar service account
gcloud iam service-accounts create $SA_NAME \
  --display-name="Timão Dados CI/CD" \
  --project=$PROJECT_ID

# Dar permissões
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member=serviceAccount:$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com \
  --role=roles/run.admin

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member=serviceAccount:$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com \
  --role=roles/storage.admin

# Criar chave JSON
gcloud iam service-accounts keys create key.json \
  --iam-account=$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com \
  --project=$PROJECT_ID

# Codificar em base64
cat key.json | base64 > key.json.b64
```

### 3.4 Configurar Cloud Run

```bash
# Criar serviço
gcloud run create timao-dados-server \
  --image gcr.io/$PROJECT_ID/timao-dados:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --project=$PROJECT_ID \
  --set-env-vars SENTRY_DSN=$SENTRY_DSN,DATABASE_URL=$DATABASE_URL
```

### 3.5 Configurar Container Registry

```bash
# Habilitar
gcloud services enable containerregistry.googleapis.com

# Configurar permissões
gcloud auth configure-docker
```

---

## 4. Firebase Setup

### 4.1 Criar Projeto

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Clique em "Add project"
3. Nome: "timao-dados"
4. Selecione projeto Google Cloud criado
5. Clique em "Create project"

### 4.2 Configurar Cloud Messaging

1. Vá para "Cloud Messaging"
2. Copie "Server API Key"
3. Salve em variável: `FIREBASE_SERVER_KEY`

### 4.3 Configurar Realtime Database

1. Vá para "Realtime Database"
2. Clique em "Create Database"
3. Selecione região: "South America (São Paulo)"
4. Selecione modo: "Start in production mode"
5. Clique em "Enable"

### 4.4 Obter Config

1. Vá para Project Settings
2. Clique em "Your apps"
3. Selecione app
4. Clique em "Config"
5. Copie objeto de configuração
6. Salve em `EXPO_PUBLIC_FIREBASE_CONFIG`

---

## 5. API-Football Setup

### 5.1 Criar Conta

1. Acesse [api-football.com](https://api-football.com)
2. Clique em "Sign Up"
3. Preencha formulário
4. Confirme email

### 5.2 Obter Chave API

1. Vá para Dashboard
2. Vá para "API Keys"
3. Copie chave
4. Salve em `EXPO_PUBLIC_API_FOOTBALL_KEY`

### 5.3 Testar API

```bash
# Testar conexão
curl -X GET "https://api-football-v1.p.rapidapi.com/v3/teams?search=corinthians" \
  -H "x-rapidapi-key: YOUR_API_KEY" \
  -H "x-rapidapi-host: api-football-v1.p.rapidapi.com"
```

---

## 6. Codecov Setup

### 6.1 Criar Conta

1. Acesse [codecov.io](https://codecov.io)
2. Clique em "Sign up"
3. Escolha "GitHub"
4. Autorize GitHub

### 6.2 Conectar Repositório

1. Vá para Dashboard
2. Clique em "Add repository"
3. Selecione "almanaque-do-timao"
4. Clique em "Activate"

### 6.3 Obter Token

1. Vá para Repository Settings
2. Procure por "Repository Upload Token"
3. Copie token
4. Salve em `CODECOV_TOKEN`

---

## 7. Snyk Setup

### 7.1 Criar Conta

1. Acesse [snyk.io](https://snyk.io)
2. Clique em "Sign up"
3. Escolha "GitHub"
4. Autorize GitHub

### 7.2 Configurar Scanning

1. Vá para Dashboard
2. Clique em "Add project"
3. Selecione "almanaque-do-timao"
4. Configure:
   - Frequency: "Daily"
   - Severity: "High and above"

### 7.3 Obter Token

1. Vá para Account Settings
2. Procure por "API Token"
3. Clique em "Show" ou "Regenerate"
4. Copie token
5. Salve em `SNYK_TOKEN`

---

## 8. Slack Setup

### 8.1 Criar App

1. Acesse [api.slack.com/apps](https://api.slack.com/apps)
2. Clique em "Create New App"
3. Selecione "From scratch"
4. Nome: "Timão Dados Alerts"
5. Workspace: (seu workspace)
6. Clique em "Create App"

### 8.2 Configurar Webhooks

1. Vá para "Incoming Webhooks"
2. Clique em "Add New Webhook to Workspace"
3. Selecione canal: "#timao-dados-alerts"
4. Clique em "Allow"
5. Copie URL do webhook
6. Salve em `SLACK_WEBHOOK_URL`

### 8.3 Testar Webhook

```bash
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"🚀 Timão Dados CI/CD ativado!"}' \
  YOUR_WEBHOOK_URL
```

---

## 9. Checklist de Configuração

- [ ] Sentry: Conta criada, projeto criado, DSN obtido
- [ ] Sentry: Alertas configurados (email e Slack)
- [ ] Vercel: Conta criada, projeto importado
- [ ] Vercel: Variáveis de ambiente adicionadas
- [ ] Vercel: Deploy automático configurado
- [ ] Google Cloud: Projeto criado, APIs habilitadas
- [ ] Google Cloud: Service Account criada, chave obtida
- [ ] Google Cloud: Cloud Run configurado
- [ ] Firebase: Projeto criado, Cloud Messaging configurado
- [ ] Firebase: Config obtida
- [ ] API-Football: Chave API obtida
- [ ] Codecov: Repositório conectado, token obtido
- [ ] Snyk: Scanning configurado, token obtido
- [ ] Slack: App criado, webhook obtido

---

## 10. Próximos Passos

1. Adicionar todos os secrets no GitHub (ver GITHUB_SECRETS_SETUP.md)
2. Fazer commit e push para ativar CI/CD
3. Acompanhar workflows em Actions
4. Verificar deploys em Vercel e Google Cloud
5. Monitorar alertas em Sentry e Slack

---

**Data:** 5 de Junho de 2026  
**Versão:** 2.7.0  
**Status:** ✅ PRONTO PARA CONFIGURAÇÃO
