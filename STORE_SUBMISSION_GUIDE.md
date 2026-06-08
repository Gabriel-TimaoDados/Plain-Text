# 📱 App Store & Google Play Submission Guide - Timão Dados v2.7.0

## Visão Geral

Guia completo para submeter Timão Dados nas App Store (iOS) e Google Play (Android).

---

## 1. Preparação Pré-Submissão

### 1.1 Checklist Final

- ✅ Versão atualizada (2.7.0)
- ✅ Build gerado (IPA para iOS, AAB para Android)
- ✅ Testes completos passando
- ✅ Screenshots preparadas (5-8 por idioma)
- ✅ Descrição e keywords definidas
- ✅ Política de privacidade publicada
- ✅ Termos de serviço publicados
- ✅ Contato de suporte configurado
- ✅ Ícone e screenshots em alta resolução

### 1.2 Assets Necessários

```
Screenshots (PNG, 1170x2532 para iPhone):
- Tela 1: Widget de placar ao vivo
- Tela 2: Estatísticas em tempo real
- Tela 3: Previsões com IA
- Tela 4: Gráficos de desempenho
- Tela 5: Compartilhamento em redes sociais

Ícone (1024x1024):
- Logo do Timão Dados
- Fundo laranja
- Sem arredondamentos (sistema cuida)

Preview Video (opcional):
- Máx 30 segundos
- Mostra principais funcionalidades
```

---

## 2. Submissão na App Store (iOS)

### 2.1 Preparar Conta Apple Developer

```bash
# Requisitos:
# - Apple Developer Account ($99/ano)
# - Mac com Xcode
# - Apple ID com 2FA ativado
# - Certificado de desenvolvimento
# - Provisioning profile

# Acessar
https://appstoreconnect.apple.com
```

### 2.2 Criar App no App Store Connect

1. **Acessar App Store Connect**
   - https://appstoreconnect.apple.com
   - Login com Apple ID

2. **Criar Novo App**
   - Clique em "Meus Apps"
   - Clique em "+"
   - Selecione "Novo App"

3. **Preencher Informações**
   - **Nome do App:** Timão Dados
   - **Bundle ID:** space.manus.almanaque.do.timao
   - **SKU:** timao-dados-2024
   - **Plataformas:** iOS
   - **Acesso:** Completo

### 2.3 Preencher Informações do App

#### 2.3.1 Informações Gerais

```
Nome do App: Timão Dados
Subtitle: Acompanhe o Corinthians em Tempo Real
Descrição: 

Timão Dados é o aplicativo oficial para acompanhar o Corinthians 
em tempo real com:

• Widget de placar ao vivo com atualização em tempo real
• Estatísticas detalhadas de cada partida
• Previsões inteligentes com IA
• Gráficos interativos de desempenho
• Comparação de jogadores e técnicos
• Histórico de resultados e análises
• Calendário interativo com previsões
• Compartilhamento em redes sociais
• Notificações push de eventos importantes
• Sistema de favoritos personalizados

Desenvolvido com tecnologia de ponta para oferecer a melhor 
experiência ao torcedor corinthiano.

Palavras-chave: 
corinthians, futebol, placar, estatísticas, previsões, 
análises, técnicos, jogadores, notificações

Categoria: Esportes
Subcategoria: Futebol
```

#### 2.3.2 Informações de Preço

```
Preço: Gratuito (Free)
Disponibilidade: Todos os países
```

#### 2.3.3 Informações de Classificação

```
Violência: Nenhuma
Conteúdo Sexual: Nenhum
Profanidade: Nenhuma
Álcool/Tabaco: Nenhum
Drogas: Nenhuma
Jogos de Azar: Nenhum
Contato com Crianças: Nenhum
Dados Pessoais: Sim (Analytics)
```

### 2.4 Adicionar Screenshots

1. **Preparar Screenshots**
   - Resolução: 1170x2532 pixels
   - Formato: PNG ou JPG
   - Mínimo: 2, Máximo: 10

2. **Fazer Upload**
   - Seção "Screenshots"
   - Clique em "+"
   - Selecione arquivo
   - Adicione descrição (opcional)

3. **Exemplo de Screenshots**
   ```
   1. "Widget de Placar ao Vivo - Acompanhe em tempo real"
   2. "Estatísticas Detalhadas - Análise completa de cada jogo"
   3. "Previsões com IA - Inteligência artificial prevê resultados"
   4. "Gráficos Interativos - Desempenho da temporada"
   5. "Compartilhamento - Divulgue em redes sociais"
   ```

### 2.5 Adicionar Ícone do App

1. **Preparar Ícone**
   - Resolução: 1024x1024 pixels
   - Formato: PNG
   - Sem arredondamentos (iOS cuida)

2. **Fazer Upload**
   - Seção "Ícone do App"
   - Clique em "+"
   - Selecione arquivo

### 2.6 Adicionar Informações de Contato

```
Email de Suporte: support@timao-dados.app
URL de Suporte: https://timao-dados.app/support
URL de Política de Privacidade: https://timao-dados.app/privacy
URL de Termos de Serviço: https://timao-dados.app/terms
```

### 2.7 Configurar Informações de Versão

1. **Versão para Review**
   - Número da Versão: 2.7.0
   - Número da Build: 27
   - Data de Lançamento: Automática

2. **Informações da Versão**
   ```
   Novidades nesta versão:
   
   v2.7.0 - Release Completo
   ✨ Widget de placar ao vivo com atualização em tempo real
   📊 Gráficos interativos de desempenho
   🤖 Previsões com IA
   👥 Comparação de jogadores e técnicos
   📅 Calendário interativo
   🔔 Notificações push com Firebase
   📱 Compartilhamento em 7 redes sociais
   ⭐ Sistema de favoritos
   📈 Google Analytics integrado
   🚨 Sentry para crash reporting
   ```

### 2.8 Fazer Upload da Build

```bash
# Opção 1: Via Xcode
# Abrir projeto em Xcode
# Product → Archive
# Distribuir para App Store

# Opção 2: Via EAS
eas submit --platform ios --latest

# Opção 3: Via Transporter
# Baixar build IPA
# Abrir Transporter
# Arrastar IPA para Transporter
# Clicar em "Enviar"
```

### 2.9 Submeter para Review

1. **Preparar Submissão**
   - Clique em "Submeter para Review"
   - Selecione "Versão 2.7.0"
   - Clique em "Enviar"

2. **Informações de Review**
   ```
   Informações de Contato:
   - Nome: [Seu Nome]
   - Email: support@timao-dados.app
   - Telefone: [Seu Telefone]
   
   Notas para Review:
   "Timão Dados é um aplicativo de acompanhamento de futebol 
   que utiliza API pública de dados de futebol. Não contém 
   conteúdo inapropriado. Todas as funcionalidades foram testadas."
   
   Informações de Login (se necessário):
   - Usuário: demo@timao-dados.app
   - Senha: [Senha Demo]
   ```

3. **Acompanhar Status**
   - App Store Connect → Meus Apps
   - Seção "Versões"
   - Status será atualizado em tempo real

### 2.10 Tempo de Aprovação

- **Tempo Médio:** 1-3 dias
- **Máximo:** 7 dias
- **Motivos de Rejeição Comuns:**
  - Funcionalidade quebrada
  - Crashes ao abrir
  - Conteúdo inapropriado
  - Violação de políticas

---

## 3. Submissão no Google Play (Android)

### 3.1 Preparar Conta Google Play

```bash
# Requisitos:
# - Google Play Developer Account ($25 one-time)
# - Google Account
# - Build AAB (Android App Bundle)
# - Keystore configurado

# Acessar
https://play.google.com/console
```

### 3.2 Criar App no Google Play Console

1. **Acessar Google Play Console**
   - https://play.google.com/console
   - Login com Google Account

2. **Criar Novo App**
   - Clique em "Criar App"
   - Preencha informações

3. **Preencher Informações Básicas**
   - **Nome do App:** Timão Dados
   - **Idioma Padrão:** Português (Brasil)
   - **Tipo de App:** Aplicativo
   - **Categoria:** Esportes
   - **Classificação de Conteúdo:** Geral

### 3.3 Preencher Informações do App

#### 3.3.1 Descrição

```
Título: Timão Dados - Acompanhe o Corinthians

Descrição Breve (80 caracteres):
Placar ao vivo, estatísticas e previsões do Corinthians

Descrição Completa (4000 caracteres):
Timão Dados é o aplicativo oficial para acompanhar o Corinthians 
em tempo real com:

• Widget de placar ao vivo com atualização em tempo real
• Estatísticas detalhadas de cada partida
• Previsões inteligentes com IA
• Gráficos interativos de desempenho
• Comparação de jogadores e técnicos
• Histórico de resultados e análises
• Calendário interativo com previsões
• Compartilhamento em redes sociais
• Notificações push de eventos importantes
• Sistema de favoritos personalizados

Desenvolvido com tecnologia de ponta para oferecer a melhor 
experiência ao torcedor corinthiano.

Palavras-chave:
corinthians, futebol, placar, estatísticas, previsões, 
análises, técnicos, jogadores, notificações
```

#### 3.3.2 Classificação de Conteúdo

```
Violência: Nenhuma
Conteúdo Sexual: Nenhum
Profanidade: Nenhuma
Álcool/Tabaco: Nenhum
Drogas: Nenhuma
Jogos de Azar: Nenhum
Contato com Crianças: Nenhum
Dados Pessoais: Sim (Analytics)
```

### 3.4 Adicionar Screenshots

1. **Preparar Screenshots**
   - Resolução: 1080x1920 pixels (ou 1440x2560)
   - Formato: PNG ou JPG
   - Mínimo: 2, Máximo: 8

2. **Fazer Upload**
   - Seção "Screenshots"
   - Clique em "+"
   - Selecione arquivo

### 3.5 Adicionar Ícone e Banner

```
Ícone do App (512x512):
- Logo do Timão Dados
- Fundo laranja
- Sem arredondamentos

Feature Graphic (1024x500):
- Banner promocional
- Mostra principais funcionalidades
```

### 3.6 Adicionar Informações de Contato

```
Email de Suporte: support@timao-dados.app
URL de Suporte: https://timao-dados.app/support
URL de Política de Privacidade: https://timao-dados.app/privacy
URL de Termos de Serviço: https://timao-dados.app/terms
```

### 3.7 Fazer Upload da Build

```bash
# Opção 1: Via Google Play Console
# Seção "Versão de Produção"
# Clique em "Criar Versão"
# Faça upload do AAB

# Opção 2: Via EAS
eas submit --platform android --latest

# Opção 3: Manual
# Baixar build AAB
# Acessar Google Play Console
# Arrastar AAB para upload
```

### 3.8 Configurar Testes

1. **Teste Interno**
   - Clique em "Teste Interno"
   - Crie versão de teste
   - Convide testadores internos

2. **Teste Fechado**
   - Clique em "Teste Fechado"
   - Crie versão de teste
   - Convide testadores específicos

3. **Teste Aberto**
   - Clique em "Teste Aberto"
   - Disponibilize para todos
   - Colete feedback

### 3.9 Submeter para Review

1. **Preparar Submissão**
   - Seção "Versão de Produção"
   - Clique em "Criar Versão"
   - Faça upload do AAB
   - Preencha notas de lançamento

2. **Notas de Lançamento**
   ```
   v2.7.0 - Release Completo
   ✨ Widget de placar ao vivo com atualização em tempo real
   📊 Gráficos interativos de desempenho
   🤖 Previsões com IA
   👥 Comparação de jogadores e técnicos
   📅 Calendário interativo
   🔔 Notificações push com Firebase
   📱 Compartilhamento em 7 redes sociais
   ⭐ Sistema de favoritos
   📈 Google Analytics integrado
   🚨 Sentry para crash reporting
   ```

3. **Revisar e Enviar**
   - Revise todas as informações
   - Clique em "Enviar para Review"
   - Aguarde aprovação

### 3.10 Tempo de Aprovação

- **Tempo Médio:** 2-4 horas
- **Máximo:** 24 horas
- **Motivos de Rejeição Comuns:**
  - Funcionalidade quebrada
  - Crashes ao abrir
  - Conteúdo inapropriado
  - Violação de políticas

---

## 4. Após Publicação

### 4.1 Monitorar Crashes

```bash
# Sentry Dashboard
https://sentry.io/organizations/timao-dados/

# Google Play Console
# Seção "Qualidade"
# Acompanhe crashes e ANRs
```

### 4.2 Responder Reviews

```
App Store:
- Acompanhe reviews diariamente
- Responda a críticas construtivas
- Agradeça reviews positivos

Google Play:
- Acompanhe reviews diariamente
- Responda a críticas construtivas
- Agradeça reviews positivos
```

### 4.3 Monitorar Analytics

```bash
# Google Analytics
https://analytics.google.com/

# App Store Analytics
# App Store Connect → Analytics

# Google Play Analytics
# Google Play Console → Estatísticas
```

### 4.4 Planejar Próximas Versões

```
v2.7.1 (Patch - 1 semana)
- Correções de bugs
- Melhorias de performance

v2.8.0 (Minor - 2-3 semanas)
- Novas funcionalidades
- Melhorias de UX

v3.0.0 (Major - 1-2 meses)
- Redesign completo
- Novas plataformas
```

---

## 5. Troubleshooting

### App Rejeitado na App Store

**Problema:** "Funcionalidade quebrada"
```
Solução:
1. Teste completamente em iPhone real
2. Verifique todos os botões e fluxos
3. Teste com internet lenta
4. Teste com diferentes versões de iOS
5. Resubmeta com nota detalhada
```

**Problema:** "Crashes ao abrir"
```
Solução:
1. Verifique logs em Xcode
2. Teste em múltiplos dispositivos
3. Verifique permissões necessárias
4. Teste com dados reais da API
5. Resubmeta após correção
```

### App Rejeitado no Google Play

**Problema:** "Conteúdo inapropriado"
```
Solução:
1. Revise descrição e screenshots
2. Remova conteúdo questionável
3. Adicione contexto apropriado
4. Resubmeta com explicação
```

**Problema:** "Violação de políticas"
```
Solução:
1. Revise políticas do Google Play
2. Corrija violações identificadas
3. Resubmeta com notas detalhadas
4. Contate suporte se necessário
```

---

## 6. Checklist Final de Submissão

### App Store (iOS)
- [ ] Versão 2.7.0 atualizada
- [ ] Build IPA gerada
- [ ] Screenshots em alta resolução
- [ ] Descrição completa e keywords
- [ ] Ícone 1024x1024
- [ ] Política de privacidade publicada
- [ ] Termos de serviço publicados
- [ ] Email de suporte configurado
- [ ] Informações de contato preenchidas
- [ ] Classificação de conteúdo completa
- [ ] Submissão enviada

### Google Play (Android)
- [ ] Versão 2.7.0 atualizada
- [ ] Build AAB gerada
- [ ] Screenshots em alta resolução
- [ ] Descrição completa e keywords
- [ ] Ícone 512x512 e banner 1024x500
- [ ] Política de privacidade publicada
- [ ] Termos de serviço publicados
- [ ] Email de suporte configurado
- [ ] Informações de contato preenchidas
- [ ] Classificação de conteúdo completa
- [ ] Submissão enviada

---

## 7. Próximos Passos

1. **Gerar Builds** - `eas build --platform all`
2. **Fazer Upload** - Seguir guias acima
3. **Submeter** - Enviar para review
4. **Acompanhar** - Monitorar status
5. **Publicar** - Ativar quando aprovado

---

**Data:** 5 de Junho de 2026  
**Versão:** 2.7.0  
**Status:** ✅ PRONTO PARA SUBMISSÃO
