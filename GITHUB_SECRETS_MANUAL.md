# Configurar GitHub Secrets Manualmente

## Passo 1: Acessar Configurações do Repositório

1. Vá para seu repositório no GitHub: https://github.com/seu-usuario/almanaque-do-timao
2. Clique em **Settings** (Configurações)
3. No menu lateral esquerdo, clique em **Secrets and variables** → **Actions**

## Passo 2: Adicionar Cada Secret

Para cada secret abaixo, clique em **New repository secret** e preencha:

### 1. VERCEL_TOKEN
- **Nome**: `VERCEL_TOKEN`
- **Valor**: Token do Vercel (obtenha em https://vercel.com/account/tokens)
- Clique em **Add secret**

### 2. VERCEL_ORG_ID
- **Nome**: `VERCEL_ORG_ID`
- **Valor**: ID da organização Vercel (encontre em https://vercel.com/account/settings)
- Clique em **Add secret**

### 3. VERCEL_PROJECT_ID
- **Nome**: `VERCEL_PROJECT_ID`
- **Valor**: ID do projeto Vercel (encontre em Project Settings)
- Clique em **Add secret**

### 4. GCP_PROJECT
- **Nome**: `GCP_PROJECT`
- **Valor**: ID do projeto Google Cloud
- Clique em **Add secret**

### 5. GCP_SA_KEY
- **Nome**: `GCP_SA_KEY`
- **Valor**: Chave JSON da Conta de Serviço GCP (salve como string)
- Clique em **Add secret**

### 6. SENTRY_AUTH_TOKEN
- **Nome**: `SENTRY_AUTH_TOKEN`
- **Valor**: Token de autenticação Sentry (obtenha em https://sentry.io/settings/account/api/auth-tokens/)
- Clique em **Add secret**

### 7. SENTRY_ORG
- **Nome**: `SENTRY_ORG`
- **Valor**: Slug da organização Sentry (ex: "timao-dados")
- Clique em **Add secret**

### 8. SENTRY_PROJECT
- **Nome**: `SENTRY_PROJECT`
- **Valor**: Slug do projeto Sentry (ex: "almanaque-do-timao")
- Clique em **Add secret**

### 9. SLACK_WEBHOOK_URL
- **Nome**: `SLACK_WEBHOOK_URL`
- **Valor**: URL do webhook Slack (obtenha em https://api.slack.com/messaging/webhooks)
- Clique em **Add secret**

### 10. EXPO_TOKEN
- **Nome**: `EXPO_TOKEN`
- **Valor**: Token Expo (execute `eas login` e copie o token)
- Clique em **Add secret**

### 11. APPLE_ID
- **Nome**: `APPLE_ID`
- **Valor**: Apple ID para App Store (seu email Apple)
- Clique em **Add secret**

## Passo 3: Verificar Secrets Adicionados

1. Vá para **Settings** → **Secrets and variables** → **Actions**
2. Você deve ver 11 secrets listados:
   - ✅ VERCEL_TOKEN
   - ✅ VERCEL_ORG_ID
   - ✅ VERCEL_PROJECT_ID
   - ✅ GCP_PROJECT
   - ✅ GCP_SA_KEY
   - ✅ SENTRY_AUTH_TOKEN
   - ✅ SENTRY_ORG
   - ✅ SENTRY_PROJECT
   - ✅ SLACK_WEBHOOK_URL
   - ✅ EXPO_TOKEN
   - ✅ APPLE_ID

## Passo 4: Fazer Commit e Push

Após adicionar todos os secrets, faça commit:

```bash
cd /home/ubuntu/almanaque-do-timao
git add .
git commit -m "chore: v2.7.0 - Ready for publication with GitHub Secrets"
git push origin main
```

## Passo 5: Verificar Workflows

1. Vá para a aba **Actions** do seu repositório
2. Você deve ver os workflows sendo executados:
   - test-and-build.yml
   - deploy.yml

## ⚠️ Importante

- **Nunca** compartilhe seus secrets
- **Nunca** commite secrets no Git
- Use apenas em variáveis de ambiente seguras
- GitHub mascara secrets nos logs

## Próximos Passos

Após adicionar todos os secrets:

1. Execute: `eas build --platform all --auto-submit`
2. Aguarde 30-60 minutos
3. Acompanhe em https://expo.dev/builds
4. Submeta nas lojas conforme STORE_SUBMISSION_GUIDE.md

## Referências

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Vercel Tokens](https://vercel.com/account/tokens)
- [Google Cloud Service Accounts](https://cloud.google.com/iam/docs/service-accounts)
- [Sentry Auth Tokens](https://sentry.io/settings/account/api/auth-tokens/)
- [Slack Webhooks](https://api.slack.com/messaging/webhooks)
- [Expo Tokens](https://docs.expo.dev/build/setup/)
