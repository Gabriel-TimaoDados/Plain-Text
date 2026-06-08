# 📱 Store Publication Guide - Timão Dados v2.7.0

## 🎯 Objetivo

Guia completo para publicar Timão Dados nas App Store (iOS) e Google Play (Android).

---

## 1. Preparação Pré-Publicação

### 1.1 Checklist Final

- [ ] Versão bumped para 2.7.0
- [ ] Todos os testes passando (286+)
- [ ] Build sem erros
- [ ] Sentry configurado
- [ ] Firebase configurado
- [ ] API-Football testada
- [ ] Deep linking testado
- [ ] Compartilhamento testado
- [ ] Favoritos testados
- [ ] Notificações testadas

### 1.2 Configurações de Build

```bash
# Verificar versão
cat app.config.ts | grep version

# Verificar bundle IDs
# iOS: space.manus.almanaque.do.timao
# Android: space.manus.almanaque.do.timao

# Gerar build
pnpm build
```

---

## 2. Publicação iOS (App Store)

### 2.1 Pré-requisitos

- [ ] Apple Developer Account ($99/ano)
- [ ] Certificado de distribuição iOS
- [ ] Provisioning Profile para App Store
- [ ] App ID criado no Apple Developer

### 2.2 Gerar IPA

```bash
# Usando Expo EAS Build (recomendado)
npm install -g eas-cli

# Login
eas login

# Configurar projeto
eas build:configure

# Gerar IPA para App Store
eas build --platform ios --auto-submit

# Ou gerar localmente (requer Mac)
eas build --platform ios --local
```

### 2.3 Submeter na App Store

#### Via Expo EAS (Automático)
```bash
# Com --auto-submit, o EAS submete automaticamente
# Aguarde aprovação (1-3 dias)
```

#### Via Xcode (Manual)
```bash
# Abrir projeto
open ios/Podfile

# Ou usar Transporter
xcrun altool --upload-app -f app.ipa -t ios -u email@apple.com -p app-specific-password
```

### 2.4 App Store Connect

1. Acesse [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Vá para "Meus Apps"
3. Selecione "Timão Dados"
4. Preencha informações:
   - **Nome:** Timão Dados
   - **Descrição:** Acompanhe o Corinthians em tempo real com placar ao vivo, estatísticas, previsões com IA e muito mais!
   - **Palavras-chave:** corinthians, futebol, placar, estatísticas, previsões
   - **Categoria:** Esportes
   - **Classificação:** 4+
   - **Preço:** Grátis

### 2.5 Screenshots e Ícones

- [ ] App Icon (1024x1024)
- [ ] Screenshots para iPhone (5.5", 6.5", 6.7")
- [ ] Screenshots para iPad (2048x2732)
- [ ] Preview video (opcional)

### 2.6 Informações de Privacidade

1. Vá para "Privacy"
2. Preencha Privacy Policy URL
3. Declare coleta de dados:
   - Analytics (Google Analytics)
   - Crash data (Sentry)
   - User ID (opcional)

### 2.7 Submeter para Review

1. Clique em "Submit for Review"
2. Selecione "Export Compliance" (se necessário)
3. Confirme submissão
4. Aguarde resposta (1-3 dias)

---

## 3. Publicação Android (Google Play)

### 3.1 Pré-requisitos

- [ ] Google Play Developer Account ($25 one-time)
- [ ] Keystore para assinatura
- [ ] Google Play Console acesso

### 3.2 Gerar APK/AAB

```bash
# Usando Expo EAS Build (recomendado)
eas build --platform android --auto-submit

# Ou gerar localmente
eas build --platform android --local
```

### 3.3 Google Play Console

1. Acesse [play.google.com/console](https://play.google.com/console)
2. Crie novo app:
   - **Nome:** Timão Dados
   - **Idioma padrão:** Português (Brasil)
   - **Categoria:** Esportes
   - **Tipo:** App

### 3.4 Configurar Loja

#### Informações do App
- [ ] Descrição curta (80 caracteres)
- [ ] Descrição completa (4000 caracteres)
- [ ] Screenshots (2-8 por orientação)
- [ ] Ícone do app (512x512)
- [ ] Banner promocional (1024x500)
- [ ] Vídeo promocional (YouTube URL)

#### Classificação de Conteúdo
1. Preencha questionário
2. Obtenha classificação
3. Salve resultado

#### Informações Privacidade
1. Declare política de privacidade
2. Declare permissões necessárias
3. Declare coleta de dados

### 3.5 Configurar Lançamento

1. Vá para "Releases" → "Production"
2. Crie novo lançamento:
   - Faça upload do AAB
   - Adicione notas de lançamento
   - Revise permissões
   - Clique "Review"

### 3.6 Submeter para Review

1. Clique "Start rollout to Production"
2. Selecione 100% de rollout
3. Confirme submissão
4. Aguarde aprovação (2-4 horas)

---

## 4. Informações da Loja

### 4.1 Descrição Curta (80 caracteres)

```
Timão Dados - Acompanhe o Corinthians em tempo real
```

### 4.2 Descrição Completa

```
Timão Dados é o app definitivo para acompanhar o Corinthians!

🎯 FUNCIONALIDADES PRINCIPAIS:

📊 Placar Ao Vivo
- Atualização em tempo real durante partidas
- Animações de gol com confete e som
- Estatísticas detalhadas do jogo

📈 Análises Completas
- Gráficos de desempenho da temporada
- Histórico mensal de resultados
- Comparação de jogadores

🤖 Previsões com IA
- Análise inteligente de próximos jogos
- Previsões baseadas em histórico
- Confiança de acerto

🏆 Histórico de Técnicos
- Desempenho de cada técnico
- Comparação de estatísticas
- Evolução ao longo do tempo

📅 Calendário Interativo
- Todos os jogos da temporada
- Cores indicando resultado
- Previsões para próximos jogos

⭐ Favoritos
- Salve jogadores, técnicos e previsões
- Notificações personalizadas
- Acesso rápido

📱 Compartilhamento
- Compartilhe em WhatsApp, Telegram, Twitter, Instagram, Facebook, LinkedIn
- Links diretos para jogos e previsões
- Deep linking para fácil navegação

🔔 Notificações Push
- Alertas de gols
- Cartões vermelhos
- Substituições importantes

📊 Estatísticas Detalhadas
- Posse de bola
- Chutes e passes
- Cartões e substituições

✨ CARACTERÍSTICAS:

✅ 17 abas de navegação completas
✅ Integração com API-Football
✅ Firebase Cloud Messaging
✅ Google Analytics
✅ Sentry crash reporting
✅ A/B Testing para otimização
✅ Modo escuro/claro automático
✅ Suporte a iOS e Android
✅ 100% grátis, sem anúncios

🚀 DESENVOLVIDO COM:
- React Native + Expo
- TypeScript
- NativeWind (Tailwind CSS)
- Firebase
- Sentry

Baixe agora e não perca nenhum detalhe do Corinthians! ⚽

Política de Privacidade: https://timao-dados.app/privacy
Termos de Uso: https://timao-dados.app/terms
```

### 4.3 Palavras-chave (10-20)

```
corinthians, futebol, placar, estatísticas, previsões, 
análises, técnicos, jogadores, campeonato, ao vivo,
notificações, compartilhamento, favoritos, calendário
```

---

## 5. Screenshots

### 5.1 Telas Principais para Screenshots

1. **Home** - Placar ao vivo
2. **Próximos** - Próximos jogos
3. **Análises** - Gráficos de desempenho
4. **Jogadores** - Estatísticas de jogadores
5. **Previsões** - Previsões com IA
6. **Favoritos** - Itens salvos

### 5.2 Dimensões

| Plataforma | Dimensão | Quantidade |
|-----------|----------|-----------|
| iOS (5.5") | 1242x2208 | 2-5 |
| iOS (6.5") | 1284x2778 | 2-5 |
| Android | 1080x1920 | 2-8 |

---

## 6. Ícones e Imagens

### 6.1 App Icon

- **Tamanho:** 1024x1024 px
- **Formato:** PNG
- **Fundo:** Laranja (cor do Corinthians)
- **Design:** Simples e reconhecível

### 6.2 Banner Promocional (Android)

- **Tamanho:** 1024x500 px
- **Formato:** PNG
- **Conteúdo:** Logo + slogan

---

## 7. Após Publicação

### 7.1 Monitoramento

- [ ] Verificar Sentry para crashes
- [ ] Monitorar Google Analytics
- [ ] Acompanhar reviews
- [ ] Responder feedback

### 7.2 Atualizações

```bash
# Bump version
npm version patch  # 2.7.0 → 2.7.1
npm version minor  # 2.7.0 → 2.8.0
npm version major  # 2.7.0 → 3.0.0

# Build e submeter novamente
eas build --platform ios --auto-submit
eas build --platform android --auto-submit
```

### 7.3 Responder Reviews

1. App Store Connect → Reviews
2. Google Play Console → Ratings & Reviews
3. Responda profissionalmente
4. Agradeça feedback positivo
5. Resolva problemas reportados

---

## 8. Troubleshooting

### Build falha

```bash
# Limpar cache
rm -rf node_modules .expo
pnpm install

# Rebuild
eas build --platform ios --clean
```

### Submissão rejeitada (iOS)

- Verificar guidelines da App Store
- Revisar screenshots
- Testar em device real
- Resubmeter

### Submissão rejeitada (Android)

- Verificar política do Google Play
- Revisar privacidade
- Testar em device real
- Resubmeter

---

## 9. Checklist Final

- [ ] Versão 2.7.0 confirmada
- [ ] Todos os testes passando
- [ ] Screenshots prontos
- [ ] Descrição revisada
- [ ] Ícones corretos
- [ ] Política de privacidade publicada
- [ ] Termos de uso publicados
- [ ] Sentry funcionando
- [ ] Firebase funcionando
- [ ] Deep linking testado
- [ ] Notificações testadas
- [ ] iOS submetido
- [ ] Android submetido
- [ ] Aguardando aprovação

---

## 10. Links Úteis

- [App Store Connect](https://appstoreconnect.apple.com)
- [Google Play Console](https://play.google.com/console)
- [Expo EAS Build](https://docs.expo.dev/eas-update/introduction/)
- [Apple App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policies](https://play.google.com/about/developer-content-policy/)

---

**Data:** 5 de Junho de 2026  
**Versão:** 2.7.0  
**Status:** ✅ PRONTO PARA PUBLICAÇÃO
