# ✅ Timão Dados v2.7.0 - Publication Final Checklist

## 🎯 Objetivo

Checklist completo para publicação de Timão Dados nas lojas e ativação de CI/CD.

---

## FASE 1: Configuração de Plataformas

### Sentry
- [ ] Conta criada em sentry.io
- [ ] Projeto "timao-dados" criado
- [ ] DSN obtido e salvo
- [ ] Email alerts configurado
- [ ] Slack integration ativada
- [ ] Release tracking habilitado

### Vercel
- [ ] Conta criada em vercel.com
- [ ] Repositório importado
- [ ] Variáveis de ambiente adicionadas
- [ ] Deploy automático configurado
- [ ] VERCEL_TOKEN gerado
- [ ] VERCEL_ORG_ID obtido
- [ ] VERCEL_PROJECT_ID obtido

### Google Cloud
- [ ] Projeto criado em console.cloud.google.com
- [ ] APIs habilitadas (Cloud Run, Build, Registry)
- [ ] Service Account criada
- [ ] Chave JSON gerada
- [ ] Cloud Run configurado
- [ ] GCP_PROJECT obtido
- [ ] GCP_SA_KEY codificado em base64

### Firebase
- [ ] Projeto criado em console.firebase.google.com
- [ ] Cloud Messaging configurado
- [ ] Realtime Database criado
- [ ] Config obtida
- [ ] FIREBASE_SERVER_KEY salvo

### API-Football
- [ ] Conta criada em api-football.com
- [ ] Chave API obtida
- [ ] API testada com curl

### Codecov
- [ ] Conta criada em codecov.io
- [ ] Repositório conectado
- [ ] Token obtido

### Snyk
- [ ] Conta criada em snyk.io
- [ ] Scanning configurado
- [ ] Token obtido

### Slack
- [ ] App criado em api.slack.com/apps
- [ ] Incoming Webhooks habilitado
- [ ] Webhook URL obtida
- [ ] Teste de webhook bem-sucedido

---

## FASE 2: Configuração do GitHub

### Secrets
- [ ] VERCEL_TOKEN adicionado
- [ ] VERCEL_ORG_ID adicionado
- [ ] VERCEL_PROJECT_ID adicionado
- [ ] GCP_PROJECT adicionado
- [ ] GCP_SA_KEY adicionado
- [ ] SENTRY_AUTH_TOKEN adicionado
- [ ] SENTRY_ORG adicionado
- [ ] SENTRY_PROJECT adicionado
- [ ] SLACK_WEBHOOK_URL adicionado
- [ ] CODECOV_TOKEN adicionado
- [ ] SNYK_TOKEN adicionado

### Workflows
- [ ] `.github/workflows/test-and-build.yml` criado
- [ ] `.github/workflows/deploy.yml` criado
- [ ] Workflows aparecem em Actions
- [ ] Permissões corretas configuradas

---

## FASE 3: Validação do Código

### Testes
- [ ] 286+ testes passando
- [ ] Cobertura > 80%
- [ ] Sem erros de TypeScript
- [ ] Sem warnings de linter

### Build
- [ ] `pnpm build` completa sem erros
- [ ] `pnpm build:web` completa sem erros
- [ ] Artifacts gerados corretamente
- [ ] Tamanho do bundle aceitável

### Segurança
- [ ] Snyk scan sem vulnerabilidades críticas
- [ ] Sem secrets no código
- [ ] HTTPS em todas as URLs
- [ ] Validação de dados com Zod

---

## FASE 4: Documentação

### Documentos Criados
- [ ] README.md atualizado
- [ ] FINAL_RELEASE_NOTES.md completo
- [ ] PUBLICATION_CHECKLIST.md completo
- [ ] PUBLICATION_GUIDE.md completo
- [ ] CI_CD_SETUP.md completo
- [ ] STORE_PUBLICATION.md completo
- [ ] GITHUB_SECRETS_SETUP.md completo
- [ ] PLATFORMS_SETUP.md completo
- [ ] PUBLICATION_FINAL_CHECKLIST.md (este arquivo)

### Código Documentado
- [ ] Componentes com comentários
- [ ] Hooks com JSDoc
- [ ] Tipos TypeScript bem definidos
- [ ] README de cada pasta

---

## FASE 5: App Store (iOS)

### Pré-requisitos
- [ ] Apple Developer Account ativo
- [ ] Certificado de distribuição iOS
- [ ] Provisioning Profile criado
- [ ] App ID criado no Apple Developer

### Preparação
- [ ] App name: "Timão Dados"
- [ ] Bundle ID: "space.manus.almanaque.do.timao"
- [ ] Version: "2.7.0"
- [ ] Build: "27"

### Screenshots
- [ ] 5 screenshots para iPhone (1242x2208)
- [ ] 5 screenshots para iPad (2048x2732)
- [ ] Descrição em cada screenshot
- [ ] Imagens em alta qualidade

### Informações
- [ ] Descrição curta (80 caracteres)
- [ ] Descrição completa (4000 caracteres)
- [ ] Palavras-chave (10-20)
- [ ] Categoria: "Esportes"
- [ ] Classificação: "4+"
- [ ] Preço: "Grátis"

### Privacidade
- [ ] Privacy Policy URL adicionada
- [ ] Dados coletados declarados
- [ ] Permissões listadas

### Build & Submissão
- [ ] IPA gerado com EAS Build
- [ ] App Store Connect atualizado
- [ ] Submissão para review realizada
- [ ] Aguardando aprovação (1-3 dias)

---

## FASE 6: Google Play (Android)

### Pré-requisitos
- [ ] Google Play Developer Account ativo
- [ ] Keystore para assinatura criado
- [ ] Google Play Console acesso

### Preparação
- [ ] App name: "Timão Dados"
- [ ] Package: "space.manus.almanaque.do.timao"
- [ ] Version: "2.7.0"
- [ ] Version Code: "27"

### Screenshots
- [ ] 4-8 screenshots (1080x1920)
- [ ] Descrição em cada screenshot
- [ ] Imagens em alta qualidade

### Informações
- [ ] Descrição curta (80 caracteres)
- [ ] Descrição completa (4000 caracteres)
- [ ] Palavras-chave
- [ ] Categoria: "Esportes"
- [ ] Classificação de conteúdo completa

### Privacidade
- [ ] Privacy Policy URL adicionada
- [ ] Dados coletados declarados
- [ ] Permissões listadas

### Build & Submissão
- [ ] AAB gerado com EAS Build
- [ ] Google Play Console atualizado
- [ ] Submissão para review realizada
- [ ] Aguardando aprovação (2-4 horas)

---

## FASE 7: Pós-Publicação

### Monitoramento
- [ ] Sentry dashboard acessível
- [ ] Google Analytics funcionando
- [ ] Alertas Slack recebendo notificações
- [ ] Logs sendo coletados

### App Store
- [ ] App publicado na App Store
- [ ] Página do app acessível
- [ ] Reviews sendo recebidas
- [ ] Respostas a reviews preparadas

### Google Play
- [ ] App publicado no Google Play
- [ ] Página do app acessível
- [ ] Reviews sendo recebidas
- [ ] Respostas a reviews preparadas

### Marketing
- [ ] Anúncio em redes sociais
- [ ] Email para usuários
- [ ] Press release (opcional)
- [ ] Blog post (opcional)

---

## FASE 8: Primeira Semana

### Monitoramento
- [ ] Verificar crashes no Sentry
- [ ] Acompanhar downloads
- [ ] Responder reviews
- [ ] Monitorar performance

### Bugs & Fixes
- [ ] Reportar bugs encontrados
- [ ] Priorizar correções críticas
- [ ] Preparar patch release (2.7.1)
- [ ] Testar em múltiplos devices

### Feedback
- [ ] Coletar feedback de usuários
- [ ] Analisar analytics
- [ ] Planejar features para v2.8.0
- [ ] Documentar learnings

---

## FASE 9: Primeira Mês

### Análise
- [ ] Revisar métricas de uso
- [ ] Analisar crashes e erros
- [ ] Avaliar performance
- [ ] Coletar feedback

### Melhorias
- [ ] Implementar sugestões de usuários
- [ ] Otimizar performance
- [ ] Corrigir bugs reportados
- [ ] Melhorar UX baseado em dados

### Planejamento
- [ ] Roadmap para próximos 3 meses
- [ ] Features prioritárias
- [ ] Melhorias técnicas
- [ ] Expansão para outros times

---

## FASE 10: Lançamento de Atualizações

### Versão 2.7.1 (Patch)
- [ ] Bugs críticos corrigidos
- [ ] Performance melhorada
- [ ] Testes completos
- [ ] Release notes preparadas
- [ ] Submissão para lojas

### Versão 2.8.0 (Minor)
- [ ] Novas features implementadas
- [ ] Testes completos
- [ ] Documentação atualizada
- [ ] Release notes preparadas
- [ ] Submissão para lojas

---

## Resumo de Tarefas

| Fase | Status | Responsável | Data |
|------|--------|-------------|------|
| Configuração de Plataformas | ⏳ | Dev | - |
| Configuração do GitHub | ⏳ | Dev | - |
| Validação do Código | ✅ | Dev | 5/6/2026 |
| Documentação | ✅ | Dev | 5/6/2026 |
| App Store | ⏳ | Dev | - |
| Google Play | ⏳ | Dev | - |
| Pós-Publicação | ⏳ | Dev/Marketing | - |
| Primeira Semana | ⏳ | Dev/Support | - |
| Primeira Mês | ⏳ | Dev/Product | - |
| Atualizações | ⏳ | Dev | - |

---

## Contatos Importantes

| Serviço | URL | Contato |
|---------|-----|---------|
| Sentry | https://sentry.io | dev@timao-dados.app |
| Vercel | https://vercel.com | dev@timao-dados.app |
| Google Cloud | https://console.cloud.google.com | dev@timao-dados.app |
| Firebase | https://console.firebase.google.com | dev@timao-dados.app |
| App Store | https://appstoreconnect.apple.com | dev@timao-dados.app |
| Google Play | https://play.google.com/console | dev@timao-dados.app |
| GitHub | https://github.com | dev@timao-dados.app |
| Slack | https://slack.com | dev@timao-dados.app |

---

## Notas Importantes

- ⚠️ Não compartilhe secrets com ninguém
- ⚠️ Regenere tokens periodicamente
- ⚠️ Revogue tokens antigos
- ⚠️ Monitore crashes em produção
- ⚠️ Responda reviews regularmente
- ⚠️ Mantenha documentação atualizada
- ⚠️ Faça backups regulares
- ⚠️ Teste em múltiplos devices

---

## Próximos Passos Imediatos

1. **Hoje:**
   - [ ] Ler PLATFORMS_SETUP.md
   - [ ] Ler GITHUB_SECRETS_SETUP.md
   - [ ] Criar contas nas plataformas

2. **Amanhã:**
   - [ ] Adicionar secrets no GitHub
   - [ ] Fazer commit e push
   - [ ] Acompanhar workflows

3. **Esta Semana:**
   - [ ] Gerar IPA para App Store
   - [ ] Gerar APK/AAB para Google Play
   - [ ] Submeter para review

4. **Próxima Semana:**
   - [ ] Aguardar aprovação
   - [ ] Publicar nas lojas
   - [ ] Monitorar em Sentry

---

**Data:** 5 de Junho de 2026  
**Versão:** 2.7.0  
**Status:** ✅ PRONTO PARA PUBLICAÇÃO

**Última Atualização:** 5 de Junho de 2026  
**Próxima Revisão:** Após publicação nas lojas
