#!/bin/bash

# GitHub Secrets Setup Script - Timão Dados v2.7.0
# Este script configura os secrets necessários no GitHub Actions

set -e

echo "🔐 GitHub Secrets Setup - Timão Dados v2.7.0"
echo "=============================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se GitHub CLI está instalado
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI não está instalado${NC}"
    echo "Instale com: brew install gh (macOS) ou apt-get install gh (Linux)"
    exit 1
fi

# Verificar se está autenticado no GitHub
if ! gh auth status &> /dev/null; then
    echo -e "${RED}❌ Não autenticado no GitHub${NC}"
    echo "Execute: gh auth login"
    exit 1
fi

echo -e "${BLUE}✓ GitHub CLI autenticado${NC}"
echo ""

# Obter informações do repositório
REPO=$(gh repo view --json nameWithOwner -q)
echo -e "${BLUE}Repositório: $REPO${NC}"
echo ""

# Array de secrets necessários
declare -a SECRETS=(
    "VERCEL_TOKEN:Token de autenticação do Vercel"
    "VERCEL_ORG_ID:ID da organização no Vercel"
    "VERCEL_PROJECT_ID:ID do projeto no Vercel"
    "GCP_PROJECT:ID do projeto Google Cloud"
    "GCP_SA_KEY:Chave JSON da Service Account do Google Cloud"
    "SENTRY_AUTH_TOKEN:Token de autenticação do Sentry"
    "SENTRY_ORG:Organização no Sentry"
    "SENTRY_PROJECT:Projeto no Sentry"
    "SLACK_WEBHOOK_URL:URL do webhook do Slack"
    "CODECOV_TOKEN:Token do Codecov (opcional)"
    "SNYK_TOKEN:Token do Snyk (opcional)"
)

echo -e "${YELLOW}Secrets a configurar:${NC}"
echo ""

for i in "${!SECRETS[@]}"; do
    IFS=':' read -r SECRET_NAME SECRET_DESC <<< "${SECRETS[$i]}"
    echo "  $((i+1)). $SECRET_NAME - $SECRET_DESC"
done

echo ""
echo -e "${YELLOW}⚠️  Você pode configurar os secrets de duas formas:${NC}"
echo ""
echo "1. Manualmente via GitHub UI:"
echo "   - Acesse: https://github.com/$REPO/settings/secrets/actions"
echo "   - Clique em 'New repository secret'"
echo "   - Adicione cada secret com seu valor"
echo ""
echo "2. Via CLI (recomendado se tiver os valores):"
echo "   - Execute este script e forneça os valores quando solicitado"
echo ""

read -p "Deseja configurar via CLI agora? (s/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo ""
    echo -e "${BLUE}Iniciando configuração de secrets...${NC}"
    echo ""
    
    for i in "${!SECRETS[@]}"; do
        IFS=':' read -r SECRET_NAME SECRET_DESC <<< "${SECRETS[$i]}"
        
        # Pular secrets opcionais se não quiser configurar
        if [[ "$SECRET_NAME" == "CODECOV_TOKEN" ]] || [[ "$SECRET_NAME" == "SNYK_TOKEN" ]]; then
            read -p "Configurar $SECRET_NAME? (s/n): " -n 1 -r
            echo ""
            if [[ ! $REPLY =~ ^[Ss]$ ]]; then
                continue
            fi
        fi
        
        read -sp "Valor de $SECRET_NAME ($SECRET_DESC): " SECRET_VALUE
        echo ""
        
        if [ -z "$SECRET_VALUE" ]; then
            echo -e "${YELLOW}⚠️  Pulando $SECRET_NAME (valor vazio)${NC}"
            continue
        fi
        
        # Adicionar secret
        echo "$SECRET_VALUE" | gh secret set "$SECRET_NAME" --repo "$REPO"
        echo -e "${GREEN}✓ $SECRET_NAME configurado${NC}"
    done
    
    echo ""
    echo -e "${GREEN}✓ Todos os secrets foram configurados!${NC}"
else
    echo ""
    echo -e "${BLUE}Configure os secrets manualmente em:${NC}"
    echo "https://github.com/$REPO/settings/secrets/actions"
    echo ""
    echo -e "${YELLOW}Secrets necessários:${NC}"
    for i in "${!SECRETS[@]}"; do
        IFS=':' read -r SECRET_NAME SECRET_DESC <<< "${SECRETS[$i]}"
        echo "  - $SECRET_NAME: $SECRET_DESC"
    done
fi

echo ""
echo -e "${BLUE}Próximos passos:${NC}"
echo "1. Fazer commit e push: git add . && git commit -m 'chore: v2.7.0 - Ready for publication' && git push"
echo "2. Gerar builds: eas build --platform all --auto-submit"
echo "3. Submeter nas lojas: Seguir STORE_SUBMISSION_GUIDE.md"
echo ""
echo -e "${GREEN}✓ Setup concluído!${NC}"
