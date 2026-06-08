# 🤖 Automated Publication Process - Timão Dados v2.7.0

## Visão Geral

Este documento descreve o processo automático de publicação do Timão Dados nas lojas App Store e Google Play.

---

## 1. Pré-requisitos

### 1.1 Contas Necessárias

- ✅ **GitHub Account** - Para CI/CD
- ✅ **Expo Account** - Para EAS Build
- ✅ **Apple Developer Account** - Para App Store ($99/ano)
- ✅ **Google Play Developer Account** - Para Google Play ($25 one-time)
- ✅ **Vercel Account** - Para deploy web
- ✅ **Google Cloud Account** - Para deploy servidor
- ✅ **Sentry Account** - Para crash reporting
- ✅ **Firebase Account** - Para notificações

### 1.2 Ferramentas Instaladas

```bash
# Node.js e npm
node --version  # v18+
npm --version

# Expo CLI
npm install -g expo-cli

# EAS CLI
npm install -g eas-cli

# GitHub CLI
gh --version

# Git
git --version
```

---

## 2. Configuração Inicial (Uma Única Vez)

### 2.1 Configurar EAS

```bash
cd /home/ubuntu/almanaque-do-timao

# Login no Expo
eas login

# Verificar autenticação
eas whoami

# Configurar projeto
eas build:configure

# Selecionar plataformas: iOS e Android
```

### 2.2 Configurar GitHub Secrets

```bash
# Executar script de setup
bash scripts/github-secrets-setup.sh

# Ou adicionar manualmente em:
# https://github.com/timao-dados/almanaque-do-timao/settings/secrets/actions
```

**Secrets necessários:**

| Secret | Descrição |
|--------|-----------|
| VERCEL_TOKEN | Token de autenticação do Vercel |
| VERCEL_ORG_ID | ID da organização no Vercel |
| VERCEL_PROJECT_ID | ID do projeto no Vercel |
| GCP_PROJECT | ID do projeto Google Cloud |
| GCP_SA_KEY | Chave JSON da Service Account |
| SENTRY_AUTH_TOKEN | Token de autenticação do Sentry |
| SENTRY_ORG | Organização no Sentry |
| SENTRY_PROJECT | Projeto no Sentry |
| SLACK_WEBHOOK_URL | URL do webhook do Slack |

### 2.3 Configurar Certificados iOS

```bash
# Criar/atualizar certificados
eas credentials

# Selecionar iOS
# Seguir instruções para criar certificados
```

### 2.4 Configurar Keystore Android

```bash
# Criar/atualizar keystore
eas credentials

# Selecionar Android
# Seguir instruções para criar keystore
```

---

## 3. Processo de Publicação Automática

### 3.1 Fazer Commit e Push

```bash
cd /home/ubuntu/almanaque-do-timao

# Adicionar mudanças
git add .

# Commit com mensagem descritiva
git commit -m "chore: v2.7.0 - Ready for publication

- Added comprehensive documentation
- Updated app version to 2.7.0
- Prepared for App Store and Google Play submission
- CI/CD pipeline configured
- All tests passing (286+)
- Sentry, Analytics, Deep Linking integrated"

# Push para main (ativa workflows)
git push origin main
```

### 3.2 Acompanhar CI/CD

```bash
# Ver status dos workflows
gh run list --repo timao-dados/almanaque-do-timao

# Ver logs de um workflow específico
gh run view RUN_ID --log

# Acompanhar em tempo real
gh run watch RUN_ID
```

### 3.3 Gerar Builds com EAS

```bash
# Build ambas plataformas com submissão automática
eas build --platform all --auto-submit

# Ou build separadamente
eas build --platform ios --auto-submit
eas build --platform android --auto-submit

# Acompanhar builds
eas build:list

# Ver detalhes de um build
eas build:view BUILD_ID
```

### 3.4 Monitorar Submissão

```bash
# Ver status de submissão
eas submit:list

# Ver detalhes de uma submissão
eas submit:view SUBMISSION_ID

# Acompanhar em tempo real
eas submit:view SUBMISSION_ID --logs
```

---

## 4. Workflows Automáticos

### 4.1 test-and-build.yml

**Acionado por:** Push em `main` ou Pull Request

**Ações:**
1. Instalar dependências
2. Executar linting
3. Executar testes
4. Build web
5. Upload de artifacts

**Tempo:** ~5-10 minutos

### 4.2 deploy.yml

**Acionado por:** Push em `main` (após test-and-build passar)

**Ações:**
1. Deploy web para Vercel
2. Deploy servidor para Google Cloud Run
3. Notificação no Slack
4. Atualizar Sentry

**Tempo:** ~10-15 minutos

---

## 5. Submissão Manual nas Lojas

### 5.1 App Store (iOS)

```bash
# Submeter build mais recente
eas submit --platform ios --latest

# Ou submeter build específico
eas submit --platform ios --build-id BUILD_ID

# Acompanhar submissão
eas submit:view SUBMISSION_ID --logs
```

**Tempo de aprovação:** 1-3 dias

### 5.2 Google Play (Android)

```bash
# Submeter build mais recente
eas submit --platform android --latest

# Ou submeter build específico
eas submit --platform android --build-id BUILD_ID

# Acompanhar submissão
eas submit:view SUBMISSION_ID --logs
```

**Tempo de aprovação:** 2-4 horas

---

## 6. Monitoramento Pós-Publicação

### 6.1 Sentry

```bash
# Acessar dashboard
https://sentry.io/organizations/timao-dados/

# Configurar alertas
# Settings → Alerts → Create Alert Rule
```

### 6.2 Google Analytics

```bash
# Acessar analytics
https://analytics.google.com/

# Monitorar eventos:
# - page_view
# - share
# - favorite
# - prediction
# - game_event
```

### 6.3 App Store Connect

```bash
# Acessar analytics
https://appstoreconnect.apple.com/

# Monitorar:
# - Downloads
# - Crashes
# - Reviews
# - Performance
```

### 6.4 Google Play Console

```bash
# Acessar analytics
https://play.google.com/console/

# Monitorar:
# - Installs
# - Crashes
# - Reviews
# - Performance
```

---

## 7. Troubleshooting

### Build Falha

```bash
# Limpar cache
rm -rf node_modules .expo
pnpm install

# Aumentar memória
NODE_OPTIONS=--max-old-space-size=4096 eas build --platform ios

# Ver logs detalhados
eas build:view BUILD_ID --logs
```

### Certificados Expirados

```bash
# Regenerar certificados
eas credentials --platform ios --clear
eas credentials --platform ios

# Ou para Android
eas credentials --platform android --clear
eas credentials --platform android
```

### Submissão Rejeitada

```bash
# Verificar motivo da rejeição
# App Store Connect ou Google Play Console

# Corrigir problema
# Fazer commit e push
# Gerar novo build
# Resubmeter
```

---

## 8. Checklist de Publicação

### Antes de Fazer Commit

- [ ] Versão atualizada (2.7.0)
- [ ] Testes passando (286+)
- [ ] Sem erros de TypeScript
- [ ] Sem warnings de linter
- [ ] Build local testada
- [ ] Assets verificados

### Após Fazer Push

- [ ] Workflows iniciados
- [ ] Testes passando
- [ ] Build completada
- [ ] Deploy realizado
- [ ] Notificação Slack recebida

### Após Gerar Builds EAS

- [ ] Build iOS completa
- [ ] Build Android completa
- [ ] Artifacts baixados
- [ ] Submissão iniciada

### Após Submissão

- [ ] App Store: Aguardando review (1-3 dias)
- [ ] Google Play: Aguardando review (2-4 horas)
- [ ] Monitorar Sentry para crashes
- [ ] Acompanhar reviews nas lojas

---

## 9. Timeline Esperada

| Etapa | Tempo |
|-------|-------|
| Commit & Push | 1 min |
| Workflows (testes + build) | 10-15 min |
| Deploy (Vercel + GCP) | 10-15 min |
| EAS Build (iOS + Android) | 30-60 min |
| Submissão App Store | 1-3 dias |
| Submissão Google Play | 2-4 horas |
| **Total até publicação** | **2-4 dias** |

---

## 10. Próximos Passos

1. **Configurar Secrets** - `bash scripts/github-secrets-setup.sh`
2. **Fazer Commit** - `git add . && git commit && git push`
3. **Acompanhar Workflows** - `gh run watch`
4. **Gerar Builds** - `eas build --platform all --auto-submit`
5. **Monitorar Submissão** - `eas submit:view`

---

## 11. Referências

- [EAS Build Documentation](https://docs.expo.dev/eas-update/introduction/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Google Play Console](https://play.google.com/console)
- [Vercel Documentation](https://vercel.com/docs)
- [Google Cloud Documentation](https://cloud.google.com/docs)

---

**Data:** 8 de Junho de 2026  
**Versão:** 2.7.0  
**Status:** ✅ PRONTO PARA PUBLICAÇÃO AUTOMÁTICA
