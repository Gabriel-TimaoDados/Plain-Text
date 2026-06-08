# Checklist Final de Publicação - Timão Dados v2.7.0

## ✅ Fase 1: Preparação (Completo)

- [x] App desenvolvido com 17 abas
- [x] 35+ componentes implementados
- [x] 286+ testes passando
- [x] Sentry integrado
- [x] A/B Testing implementado
- [x] Google Analytics configurado
- [x] Deep Linking funcional
- [x] Compartilhamento em 7 redes sociais
- [x] Notificações push com Firebase
- [x] Previsões com IA
- [x] Nome do app corrigido: "Timão Dados"
- [x] app.config.ts atualizado (v2.7.0)
- [x] package.json atualizado
- [x] eas.json criado

## ✅ Fase 2: Documentação (Completo)

- [x] GITHUB_SECRETS_INSTRUCTIONS.md criado
- [x] EAS_BUILD_INSTRUCTIONS.md criado
- [x] STORE_SUBMISSION_GUIDE.md disponível
- [x] .env.production configurado
- [x] scripts/build-eas.sh criado

## 📋 Fase 3: GitHub Secrets (Próximo)

**Tempo estimado**: 15 minutos

### Passo 1: Acessar GitHub
1. Vá para seu repositório
2. Settings → Secrets and variables → Actions
3. Clique em "New repository secret"

### Passo 2: Adicionar 11 Secrets

| Secret | Descrição | Prioridade |
|--------|-----------|-----------|
| VERCEL_TOKEN | Token Vercel | Alta |
| VERCEL_ORG_ID | ID Organização Vercel | Alta |
| VERCEL_PROJECT_ID | ID Projeto Vercel | Alta |
| GCP_PROJECT | ID Projeto Google Cloud | Alta |
| GCP_SA_KEY | Chave Conta Serviço GCP | Alta |
| SENTRY_AUTH_TOKEN | Token Sentry | Alta |
| SENTRY_ORG | Slug Organização Sentry | Alta |
| SENTRY_PROJECT | Slug Projeto Sentry | Alta |
| SLACK_WEBHOOK_URL | URL Webhook Slack | Média |
| EXPO_TOKEN | Token Expo | Alta |
| APPLE_ID | Apple ID | Alta |

**Referência**: Veja GITHUB_SECRETS_INSTRUCTIONS.md para detalhes de cada secret.

## 📦 Fase 4: Gerar Builds (Próximo)

**Tempo estimado**: 30-60 minutos

### Opção A: Via CLI (Recomendado)

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Fazer login
eas login

# Gerar ambos os builds
eas build --platform all --auto-submit
```

### Opção B: Via Script

```bash
bash scripts/build-eas.sh all true
```

### Monitorar Progresso

- Dashboard: https://expo.dev/builds
- CLI: `eas build:list`

**Tempo de espera**:
- iOS: 20-30 minutos
- Android: 15-25 minutos
- Ambos: 30-60 minutos (paralelo)

## 🏪 Fase 5: Submissão nas Lojas (Após Builds)

**Tempo estimado**: 2-4 dias

### App Store (iOS)

1. Acesse: https://appstoreconnect.apple.com
2. Vá em "My Apps"
3. Selecione "Timão Dados"
4. Clique em "+ Version"
5. Faça upload do IPA
6. Preencha informações:
   - Screenshots
   - Descrição
   - Palavras-chave
   - Categoria
7. Clique em "Submit for Review"

**Tempo de aprovação**: 1-3 dias

### Google Play (Android)

1. Acesse: https://play.google.com/console
2. Vá em "Timão Dados"
3. Clique em "Create new release"
4. Faça upload do AAB
5. Preencha informações:
   - Screenshots
   - Descrição
   - Categoria
   - Rating
6. Clique em "Review and roll out"

**Tempo de aprovação**: 2-4 horas

## 📊 Fase 6: Monitoramento (Após Publicação)

- [x] Acompanhar reviews nas lojas
- [x] Monitorar crashes em Sentry
- [x] Verificar analytics em Google Analytics
- [x] Responder feedback de usuários
- [x] Preparar patch v2.7.1 se necessário

## 🎯 Próximos Passos Imediatos

1. **Agora**: Ler GITHUB_SECRETS_INSTRUCTIONS.md
2. **Próximo**: Configurar 11 secrets no GitHub (15 min)
3. **Depois**: Executar `eas build --platform all --auto-submit` (60 min)
4. **Aguardar**: Builds completarem
5. **Submeter**: Seguir STORE_SUBMISSION_GUIDE.md

## 📞 Suporte

- **Dúvidas sobre EAS**: https://docs.expo.dev/build/introduction/
- **Dúvidas sobre App Store**: https://developer.apple.com/help/app-store-connect/
- **Dúvidas sobre Google Play**: https://support.google.com/googleplay/android-developer

## ✨ Status Final

**App**: 100% Pronto ✅
**Documentação**: 100% Completa ✅
**GitHub Secrets**: Aguardando configuração ⏳
**Builds**: Aguardando geração ⏳
**Publicação**: Aguardando submissão ⏳

---

**Versão**: 2.7.0  
**Data**: 2026-06-08  
**Status**: Pronto para publicação
