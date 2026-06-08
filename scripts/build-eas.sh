#!/bin/bash

# Script para gerar builds com EAS
# Uso: bash scripts/build-eas.sh [ios|android|all]

set -e

PLATFORM=${1:-all}
AUTO_SUBMIT=${2:-true}

echo "🚀 Timão Dados - EAS Build Script"
echo "=================================="
echo ""
echo "Plataforma: $PLATFORM"
echo "Auto-submit: $AUTO_SUBMIT"
echo ""

# Verificar se EAS CLI está instalado
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI não está instalado!"
    echo "Instale com: npm install -g eas-cli"
    exit 1
fi

# Verificar se está logado no Expo
echo "🔐 Verificando autenticação Expo..."
if ! eas whoami &> /dev/null; then
    echo "❌ Não autenticado no Expo!"
    echo "Execute: eas login"
    exit 1
fi

echo "✅ Autenticado no Expo"
echo ""

# Gerar build
if [ "$AUTO_SUBMIT" = "true" ]; then
    echo "📦 Gerando build com auto-submit..."
    eas build --platform "$PLATFORM" --auto-submit
else
    echo "📦 Gerando build sem auto-submit..."
    eas build --platform "$PLATFORM"
fi

echo ""
echo "✅ Build iniciado!"
echo ""
echo "📊 Acompanhe o progresso em:"
echo "   https://expo.dev/builds"
echo ""
echo "Ou execute:"
echo "   eas build:list"
echo ""
