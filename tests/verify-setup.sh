#!/bin/bash

# Script de verificação completa do ambiente
# Execute: bash tests/verify-setup.sh

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  🔍 VERIFICAÇÃO DO AMBIENTE - BRDID PROXY API                 ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

checks_passed=0
checks_total=0

# Função para verificar
check() {
    ((checks_total++))
    if eval "$2"; then
        echo -e "${GREEN}✅ $1${NC}"
        ((checks_passed++))
        return 0
    else
        echo -e "${RED}❌ $1${NC}"
        if [ ! -z "$3" ]; then
            echo -e "   ${YELLOW}→ $3${NC}"
        fi
        return 1
    fi
}

echo "📦 DEPENDÊNCIAS"
echo "────────────────────────────────────────────────────────────────"
check "Node.js instalado" "command -v node > /dev/null" "Instale Node.js: https://nodejs.org/"
check "npm instalado" "command -v npm > /dev/null" "Instale npm"
check "Pacotes instalados" "[ -d node_modules ]" "Execute: npm install"
echo ""

echo "⚙️  CONFIGURAÇÃO"
echo "────────────────────────────────────────────────────────────────"
check "Arquivo .env existe" "[ -f .env ]" "Execute: cp .env.example .env"
check "BRDID_TOKEN configurado" "grep -q 'BRDID_TOKEN=.' .env" "Configure BRDID_TOKEN no arquivo .env"
check "PORT configurado" "grep -q 'PORT=' .env"
echo ""

echo "📁 ESTRUTURA DO PROJETO"
echo "────────────────────────────────────────────────────────────────"
check "Diretório src/ existe" "[ -d src ]"
check "Arquivo server.js existe" "[ -f src/server.js ]"
check "Arquivo de serviço BRDID existe" "[ -f src/services/brdid.service.js ]"
check "Rotas configuradas" "[ -d src/routes ]"
check "Controllers configurados" "[ -d src/controllers ]"
echo ""

echo "🔗 CONECTIVIDADE"
echo "────────────────────────────────────────────────────────────────"
check "Internet disponível" "ping -c 1 google.com > /dev/null 2>&1" "Verifique sua conexão com a internet"

if [ -f .env ]; then
    export $(grep BRDID_TOKEN .env | xargs)
    if [ ! -z "$BRDID_TOKEN" ]; then
        check "API BRDID acessível" "curl -s 'https://brdid.com.br/br-did/api/public/buscar_numeros_by_area_local?TOKEN=${BRDID_TOKEN}&AREA_LOCAL=Porto%20Alegre' | grep -q 'NUMERO'" "Verifique se o TOKEN está correto"
    fi
fi
echo ""

echo "🧪 TESTES DISPONÍVEIS"
echo "────────────────────────────────────────────────────────────────"
check "Script de testes existe" "[ -f tests/integration.test.js ]"
check "Script de teste proxy existe" "[ -f tests/test-proxy.js ]"
check "Script de teste rápido existe" "[ -f tests/quick-test.sh ]"
echo ""

echo "════════════════════════════════════════════════════════════════"
echo ""
echo "📊 RESULTADO: $checks_passed/$checks_total verificações passaram"
echo ""

if [ $checks_passed -eq $checks_total ]; then
    echo -e "${GREEN}✨ TUDO PRONTO! Você pode iniciar o servidor:${NC}"
    echo ""
    echo "   npm run dev"
    echo ""
    echo "📚 Acesse a documentação em: http://localhost:3000/api-docs"
    echo ""
    exit 0
else
    echo -e "${YELLOW}⚠️  Alguns problemas foram encontrados.${NC}"
    echo "   Corrija os itens marcados com ❌ acima."
    echo ""
    exit 1
fi
