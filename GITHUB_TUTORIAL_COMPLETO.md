# Tutorial Completo: GitHub e GitHub Secrets para Timão Dados

## Parte 1: Criar Conta no GitHub

### Passo 1: Acessar GitHub
1. Abra seu navegador
2. Vá para: **https://github.com**
3. Clique em **Sign up** (Inscrever-se) no canto superior direito

### Passo 2: Preencher Dados
1. **Email**: Digite seu email
2. **Senha**: Crie uma senha forte (mínimo 8 caracteres)
3. **Nome de usuário**: Escolha um nome único (ex: "seu-nome-timao")
4. Clique em **Create account** (Criar conta)

### Passo 3: Verificar Email
1. GitHub enviará um email de confirmação
2. Abra seu email
3. Clique no link de confirmação
4. Pronto! Sua conta está criada

---

## Parte 2: Criar um Repositório

### Passo 1: Ir para Dashboard
1. Após fazer login, clique na sua foto no canto superior direito
2. Clique em **Your repositories** (Seus repositórios)

### Passo 2: Criar Novo Repositório
1. Clique no botão verde **New** (Novo)
2. Preencha:
   - **Repository name**: `almanaque-do-timao` ou `timao-dados`
   - **Description**: "App de dados do Corinthians"
   - **Public**: Deixe como está (ou escolha Private se preferir)
3. Clique em **Create repository** (Criar repositório)

### Passo 3: Você verá instruções
GitHub mostrará instruções para adicionar seu código. Vamos fazer isso!

---

## Parte 3: Enviar Seu Código para GitHub

### Passo 1: Abrir Terminal
1. Abra o terminal/cmd no seu computador
2. Navegue até a pasta do projeto:
```bash
cd /home/ubuntu/almanaque-do-timao
```

### Passo 2: Configurar Git (primeira vez)
```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@example.com"
```

### Passo 3: Inicializar Git (se não tiver feito)
```bash
git init
```

### Passo 4: Adicionar Todos os Arquivos
```bash
git add .
```

### Passo 5: Fazer Commit
```bash
git commit -m "Initial commit: Timão Dados v2.7.0"
```

### Passo 6: Adicionar URL do Repositório
No GitHub, você verá uma URL como: `https://github.com/seu-usuario/almanaque-do-timao.git`

Execute:
```bash
git remote add origin https://github.com/seu-usuario/almanaque-do-timao.git
```

### Passo 7: Fazer Push (Enviar para GitHub)
```bash
git branch -M main
git push -u origin main
```

**Pronto!** Seu código está no GitHub! 🎉

---

## Parte 4: Configurar GitHub Secrets

### Passo 1: Ir para Configurações do Repositório
1. No GitHub, vá para seu repositório
2. Clique em **Settings** (Configurações) no menu superior
3. No menu lateral esquerdo, clique em **Secrets and variables** → **Actions**

### Passo 2: Criar Primeiro Secret (EXPO_TOKEN)

#### Como obter EXPO_TOKEN:
1. Abra o terminal
2. Execute:
```bash
npm install -g eas-cli
eas login
```
3. Quando pedir token, ele será exibido no terminal
4. Copie o token

#### Adicionar no GitHub:
1. Clique em **New repository secret** (Novo secret do repositório)
2. **Name**: `EXPO_TOKEN`
3. **Secret**: Cole o token que copiou
4. Clique em **Add secret** (Adicionar secret)

### Passo 3: Criar Segundo Secret (VERCEL_TOKEN)

#### Como obter VERCEL_TOKEN:
1. Vá para: https://vercel.com/account/tokens
2. Clique em **Create Token**
3. **Token name**: `github-actions`
4. Copie o token

#### Adicionar no GitHub:
1. Clique em **New repository secret**
2. **Name**: `VERCEL_TOKEN`
3. **Secret**: Cole o token
4. Clique em **Add secret**

### Passo 4: Criar Terceiro Secret (SENTRY_AUTH_TOKEN)

#### Como obter SENTRY_AUTH_TOKEN:
1. Vá para: https://sentry.io/settings/account/api/auth-tokens/
2. Clique em **Create New Token**
3. Copie o token

#### Adicionar no GitHub:
1. Clique em **New repository secret**
2. **Name**: `SENTRY_AUTH_TOKEN`
3. **Secret**: Cole o token
4. Clique em **Add secret**

### Passo 5: Adicionar Secrets Simples

Para estes, você pode usar valores de exemplo:

#### SENTRY_ORG
1. Clique em **New repository secret**
2. **Name**: `SENTRY_ORG`
3. **Secret**: `timao-dados`
4. Clique em **Add secret**

#### SENTRY_PROJECT
1. Clique em **New repository secret**
2. **Name**: `SENTRY_PROJECT`
3. **Secret**: `almanaque-do-timao`
4. Clique em **Add secret**

#### SLACK_WEBHOOK_URL (opcional)
1. Clique em **New repository secret**
2. **Name**: `SLACK_WEBHOOK_URL`
3. **Secret**: `https://hooks.slack.com/services/YOUR/WEBHOOK/URL` (ou deixe vazio)
4. Clique em **Add secret**

---

## Parte 5: Verificar Secrets Adicionados

1. Vá para **Settings** → **Secrets and variables** → **Actions**
2. Você deve ver os secrets listados:
   - ✅ EXPO_TOKEN
   - ✅ VERCEL_TOKEN
   - ✅ SENTRY_AUTH_TOKEN
   - ✅ SENTRY_ORG
   - ✅ SENTRY_PROJECT
   - ✅ SLACK_WEBHOOK_URL

**Nota**: GitHub não mostra o valor dos secrets por segurança!

---

## Parte 6: Fazer Commit e Push com Secrets

Após adicionar todos os secrets:

```bash
cd /home/ubuntu/almanaque-do-timao
git add .
git commit -m "chore: Add GitHub Secrets configuration"
git push origin main
```

---

## Parte 7: Verificar Workflows Automáticos

1. No GitHub, clique na aba **Actions**
2. Você deve ver os workflows sendo executados:
   - `test-and-build`
   - `deploy`

3. Clique em um workflow para ver o progresso

---

## Resumo: O que você fez

✅ Criou conta no GitHub  
✅ Criou repositório  
✅ Enviou seu código para GitHub  
✅ Configurou 6 secrets  
✅ Ativou workflows automáticos  

---

## Próximos Passos

Agora que tudo está configurado no GitHub, você pode:

1. **Gerar Builds com EAS**:
```bash
eas build --platform all --auto-submit
```

2. **Acompanhar Builds**:
   - Dashboard: https://expo.dev/builds
   - CLI: `eas build:list`

3. **Submeter nas Lojas**:
   - Siga STORE_SUBMISSION_GUIDE.md

---

## Dúvidas Frequentes

### P: Perdi meu token, o que faço?
**R**: Crie um novo token no site (Vercel, Sentry, Expo) e atualize o secret no GitHub.

### P: Posso compartilhar meus secrets?
**R**: **NÃO!** Secrets são como senhas. Nunca compartilhe!

### P: Como atualizar um secret?
**R**: Clique no secret, clique em **Update**, mude o valor e salve.

### P: Posso deletar um secret?
**R**: Sim, clique no secret e clique em **Delete**.

### P: Quanto custa GitHub?
**R**: GitHub é **GRATUITO** para repositórios públicos e privados!

---

## Links Úteis

- GitHub: https://github.com
- Expo: https://expo.dev
- Vercel: https://vercel.com
- Sentry: https://sentry.io
- Documentação GitHub: https://docs.github.com

---

**Parabéns! Você agora sabe usar GitHub!** 🎉
