#!/bin/bash

# 🚀 Timão Dados CI/CD Setup Script
# Este script configura automaticamente GitHub Secrets

set -e

echo "🚀 Timão Dados CI/CD Setup"
echo "============================"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se gh CLI está instalado
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI não está instalado${NC}"
    echo "Instale com: brew install gh"
    exit 1
fi

# Verificar se está autenticado no GitHub
if ! gh auth status &> /dev/null; then
    echo -e "${RED}❌ Não autenticado no GitHub${NC}"
    echo "Execute: gh auth login"
    exit 1
fi

echo -e "${GREEN}✓ GitHub CLI autenticado${NC}"
echo ""

# Função para adicionar secret
add_secret() {
    local name=$1
    local value=$2
    local description=$3
    
    if [ -z "$value" ]; then
        echo -e "${YELLOW}⚠ Pulando $name (valor vazio)${NC}"
        return
    fi
    
    echo "Adicionando $name..."
    gh secret set "$name" --body "$value" 2>/dev/null
    echo -e "${GREEN}✓ $name adicionado${NC}"
}

echo "📝 Configurando Secrets..."
echo ""

# Vercel
echo "🔵 Vercel"
read -p "VERCEL_TOKEN: " VERCEL_TOKEN
read -p "VERCEL_ORG_ID: " VERCEL_ORG_ID
read -p "VERCEL_PROJECT_ID: " VERCEL_PROJECT_ID

add_secret "VERCEL_TOKEN" "$VERCEL_TOKEN"
add_secret "VERCEL_ORG_ID" "$VERCEL_ORG_ID"
add_secret "VERCEL_PROJECT_ID" "$VERCEL_PROJECT_ID"

echo ""
echo "🔵 Google Cloud"
read -p "GCP_PROJECT: " GCP_PROJECT
read -p "Caminho para GCP_SA_KEY (key.json): " GCP_SA_KEY_PATH

if [ -f "$GCP_SA_KEY_PATH" ]; then
    GCP_SA_KEY=$(cat "$GCP_SA_KEY_PATH" | base64)
    add_secret "GCP_PROJECT" "$GCP_PROJECT"
    add_secret "GCP_SA_KEY" "$GCP_SA_KEY"
else
    echo -e "${RED}❌ Arquivo $GCP_SA_KEY_PATH não encontrado${NC}"
fi

echo ""
echo "🔵 Sentry"
read -p "SENTRY_AUTH_TOKEN: " SENTRY_AUTH_TOKEN
read -p "SENTRY_ORG: " SENTRY_ORG
read -p "SENTRY_PROJECT: " SENTRY_PROJECT

add_secret "SENTRY_AUTH_TOKEN" "$SENTRY_AUTH_TOKEN"
add_secret "SENTRY_ORG" "$SENTRY_ORG"
add_secret "SENTRY_PROJECT" "$SENTRY_PROJECT"

echo ""
echo "🔵 Slack"
read -p "SLACK_WEBHOOK_URL: " SLACK_WEBHOOK_URL
add_secret "SLACK_WEBHOOK_URL" "$SLACK_WEBHOOK_URL"

echo ""
echo "🔵 Codecov (opcional)"
read -p "CODECOV_TOKEN (deixe em branco para pular): " CODECOV_TOKEN
add_secret "CODECOV_TOKEN" "$CODECOV_TOKEN"

echo ""
echo "🔵 Snyk (opcional)"
read -p "SNYK_TOKEN (deixe em branco para pular): " SNYK_TOKEN
add_secret "SNYK_TOKEN" "$SNYK_TOKEN"

echo ""
echo "📋 Listando secrets adicionados..."
gh secret list

echo ""
echo -e "${GREEN}✅ Setup completo!${NC}"
echo ""
echo "Próximos passos:"
echo "1. Fazer commit: git add . && git commit -m 'Configure CI/CD'"
echo "2. Push: git push origin main"
echo "3. Acompanhar: gh run list"
echo ""
