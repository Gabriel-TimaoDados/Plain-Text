# 🔨 EAS Build Guide - Timão Dados v2.7.0

## Visão Geral

Guia completo para gerar builds iOS (IPA) e Android (AAB) usando Expo EAS Build.

---

## 1. Pré-requisitos

### Verificar Instalação

```bash
# Verificar Node.js
node --version  # v18+ recomendado

# Verificar npm/pnpm
pnpm --version  # v9+

# Verificar Expo CLI
npx expo --version  # v50+

# Instalar EAS CLI
npm install -g eas-cli
eas --version
```

### Contas Necessárias

- [ ] Conta Expo (https://expo.dev)
- [ ] Apple Developer Account ($99/ano)
- [ ] Google Play Developer Account ($25 one-time)
- [ ] GitHub account (para CI/CD)

---

## 2. Configuração Inicial do EAS

### 2.1 Login no EAS

```bash
# Login
eas login

# Verificar autenticação
eas whoami
```

### 2.2 Configurar Projeto

```bash
# Inicializar EAS no projeto
eas build:configure

# Selecionar plataformas: iOS e Android
# Responder às perguntas de configuração
```

### 2.3 Verificar Configuração

```bash
# Listar configurações
cat eas.json

# Deve conter:
# {
#   "build": {
#     "preview": { "android": {...}, "ios": {...} },
#     "production": { "android": {...}, "ios": {...} }
#   }
# }
```

---

## 3. Preparar App para Build

### 3.1 Atualizar Versão

```bash
# Editar app.config.ts
# Alterar version: "2.7.0"
# Alterar versionCode/versionNumber se necessário

# Ou usar npm version
npm version patch  # 2.7.0 → 2.7.1
npm version minor  # 2.7.0 → 2.8.0
npm version major  # 2.7.0 → 3.0.0
```

### 3.2 Verificar Assets

```bash
# Verificar ícones
ls -la assets/images/
# Deve conter:
# - icon.png (1024x1024)
# - splash-icon.png (1024x1024)
# - android-icon-foreground.png
# - android-icon-background.png
# - android-icon-monochrome.png
# - favicon.png
```

### 3.3 Limpar e Instalar Dependências

```bash
# Limpar cache
rm -rf node_modules .expo
pnpm install

# Verificar build
pnpm build
pnpm build:web
```

### 3.4 Verificar Configurações

```bash
# Verificar app.config.ts
cat app.config.ts | grep -E "name|version|slug|bundleIdentifier|package"

# Deve mostrar:
# - name: "Timão Dados"
# - version: "2.7.0"
# - slug: "almanaque-do-timao"
# - bundleIdentifier: "space.manus.almanaque.do.timao"
# - package: "space.manus.almanaque.do.timao"
```

---

## 4. Gerar Build iOS (IPA)

### 4.1 Configurar Certificados

```bash
# Criar/atualizar certificados
eas credentials

# Selecionar iOS
# Selecionar "Manage your credentials"
# Seguir instruções para criar certificados

# Ou usar certificados existentes
eas credentials --platform ios
```

### 4.2 Gerar IPA

#### Opção 1: Build Automático (Recomendado)

```bash
# Build para App Store (production)
eas build --platform ios --auto-submit

# Ou build sem auto-submit
eas build --platform ios

# Acompanhar build
eas build:list

# Ver logs
eas build:view BUILD_ID
```

#### Opção 2: Build Local (Mac)

```bash
# Requer Mac com Xcode
eas build --platform ios --local

# Resultado: app.ipa gerado em dist/
```

### 4.3 Verificar IPA

```bash
# Listar builds
eas build:list --platform ios

# Ver detalhes
eas build:view BUILD_ID

# Deve mostrar:
# - Status: FINISHED
# - Artifacts: app.ipa URL
```

---

## 5. Gerar Build Android (AAB)

### 5.1 Configurar Keystore

```bash
# Criar/atualizar keystore
eas credentials

# Selecionar Android
# Selecionar "Manage your credentials"
# Seguir instruções para criar keystore

# Ou usar keystore existente
eas credentials --platform android
```

### 5.2 Gerar AAB

#### Opção 1: Build Automático (Recomendado)

```bash
# Build para Google Play (production)
eas build --platform android --auto-submit

# Ou build sem auto-submit
eas build --platform android

# Acompanhar build
eas build:list

# Ver logs
eas build:view BUILD_ID
```

#### Opção 2: Build Local

```bash
# Build local (requer Android SDK)
eas build --platform android --local

# Resultado: app.aab gerado em dist/
```

### 5.3 Verificar AAB

```bash
# Listar builds
eas build:list --platform android

# Ver detalhes
eas build:view BUILD_ID

# Deve mostrar:
# - Status: FINISHED
# - Artifacts: app.aab URL
```

---

## 6. Build Simultâneo (iOS + Android)

```bash
# Build ambas plataformas
eas build --platform all

# Ou com auto-submit
eas build --platform all --auto-submit

# Acompanhar
eas build:list
```

---

## 7. Troubleshooting

### Build Falha com "Out of Memory"

```bash
# Aumentar limite de memória
NODE_OPTIONS=--max-old-space-size=4096 eas build --platform ios
NODE_OPTIONS=--max-old-space-size=4096 eas build --platform android
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

### Build Falha com "Provisioning Profile"

```bash
# Verificar provisioning profiles
eas credentials --platform ios

# Regenerar se necessário
eas credentials --platform ios --clear
eas credentials --platform ios
```

### Build Falha com "Keystore"

```bash
# Verificar keystore
eas credentials --platform android

# Regenerar se necessário
eas credentials --platform android --clear
eas credentials --platform android
```

---

## 8. Monitorar Build

### 8.1 Ver Status em Tempo Real

```bash
# Listar builds recentes
eas build:list --limit 10

# Ver build específico
eas build:view BUILD_ID

# Acompanhar logs
eas build:view BUILD_ID --logs
```

### 8.2 Notificações

```bash
# Configurar notificações por email
eas build --platform ios --notify

# Ou via webhook
eas build --platform ios --webhook-url https://seu-webhook.com
```

---

## 9. Baixar Artifacts

### 9.1 Baixar IPA

```bash
# Listar builds iOS
eas build:list --platform ios

# Copiar URL do artifact
# Ou usar EAS CLI
eas build:view BUILD_ID --json | jq '.artifacts.buildUrl'

# Baixar manualmente via URL
curl -O https://url-do-ipa.com/app.ipa
```

### 9.2 Baixar AAB

```bash
# Listar builds Android
eas build:list --platform android

# Copiar URL do artifact
# Ou usar EAS CLI
eas build:view BUILD_ID --json | jq '.artifacts.buildUrl'

# Baixar manualmente via URL
curl -O https://url-do-aab.com/app.aab
```

---

## 10. Submissão Automática

### 10.1 App Store (iOS)

```bash
# Build com submissão automática
eas build --platform ios --auto-submit

# Monitorar submissão
eas submit --platform ios --latest

# Ver status
eas submit:list --platform ios
```

### 10.2 Google Play (Android)

```bash
# Build com submissão automática
eas build --platform android --auto-submit

# Monitorar submissão
eas submit --platform android --latest

# Ver status
eas submit:list --platform android
```

---

## 11. Submissão Manual

### 11.1 App Store (iOS)

```bash
# Submeter IPA manualmente
eas submit --platform ios --path ./app.ipa

# Ou submeter build mais recente
eas submit --platform ios --latest
```

### 11.2 Google Play (Android)

```bash
# Submeter AAB manualmente
eas submit --platform android --path ./app.aab

# Ou submeter build mais recente
eas submit --platform android --latest
```

---

## 12. Checklist de Build

- [ ] Versão atualizada em app.config.ts
- [ ] Assets verificados (ícones, splash)
- [ ] Dependências instaladas (`pnpm install`)
- [ ] Build local testado (`pnpm build`)
- [ ] Certificados iOS configurados
- [ ] Keystore Android configurado
- [ ] EAS CLI instalado e autenticado
- [ ] eas.json configurado
- [ ] Build iOS iniciado
- [ ] Build Android iniciado
- [ ] Builds completados com sucesso
- [ ] Artifacts baixados
- [ ] Submissão iniciada

---

## 13. Próximos Passos

1. **Seguir STORE_PUBLICATION.md** - Submeter nas lojas
2. **Monitorar Builds** - Acompanhar em eas.dev
3. **Preparar Release Notes** - Documentar mudanças
4. **Comunicar Lançamento** - Anunciar nas redes sociais

---

## 14. Referências

- [EAS Build Documentation](https://docs.expo.dev/eas-update/introduction/)
- [EAS CLI Commands](https://docs.expo.dev/eas-update/commands/)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Google Play Console](https://play.google.com/console)

---

**Data:** 5 de Junho de 2026  
**Versão:** 2.7.0  
**Status:** ✅ PRONTO PARA BUILD
