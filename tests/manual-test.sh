#!/bin/bash

# Script de teste manual da API BRDID
# Execute: bash tests/manual-test.sh

echo "============================================================"
echo "🧪 TESTES MANUAIS - BRDID PROXY API"
echo "============================================================"

# Carrega variáveis de ambiente
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Define variáveis
API_URL="http://localhost:${PORT:-3000}"
BRDID_URL="${BRDID_API_URL:-https://brdid.com.br/br-did/api/public}"
TOKEN="${BRDID_TOKEN}"

echo "📡 Proxy API URL: $API_URL"
echo "🔗 BRDID API URL: $BRDID_URL"
echo "🔑 Token: ${TOKEN:0:30}..."
echo "============================================================"
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para testar endpoint
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    
    echo -e "${YELLOW}Testando: $name${NC}"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" -X GET "$API_URL$endpoint")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✅ Status: $http_code${NC}"
        echo "Resposta: $(echo $body | jq '.' 2>/dev/null || echo $body | head -c 200)"
    else
        echo -e "${RED}❌ Status: $http_code${NC}"
        echo "Erro: $(echo $body | jq '.' 2>/dev/null || echo $body)"
    fi
    echo ""
}

# Função para testar BRDID diretamente
test_brdid_direct() {
    local name=$1
    local endpoint=$2
    local params=$3
    
    echo -e "${YELLOW}Testando BRDID direto: $name${NC}"
    
    url="$BRDID_URL$endpoint?TOKEN=$TOKEN$params"
    response=$(curl -s -w "\n%{http_code}" -X GET "$url" -H "accept: application/json")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✅ Status: $http_code${NC}"
        echo "Resposta: $(echo $body | jq '.' 2>/dev/null || echo $body | head -c 200)"
    else
        echo -e "${RED}❌ Status: $http_code${NC}"
        echo "Erro: $(echo $body | jq '.' 2>/dev/null || echo $body)"
    fi
    echo ""
}

echo "============================================================"
echo "🔍 TESTES DIRETOS NA API BRDID"
echo "============================================================"
echo ""

test_brdid_direct "Buscar números por área (Porto Alegre)" \
    "/buscar_numeros_by_area_local" \
    "&AREA_LOCAL=Porto%20Alegre"

test_brdid_direct "Buscar números por DDD (51)" \
    "/buscar_numeros_by_ddd" \
    "&DDD=51"

test_brdid_direct "Listar áreas locais" \
    "/listar_areas_locais" \
    ""

echo "============================================================"
echo "🔄 TESTES ATRAVÉS DO PROXY"
echo "============================================================"
echo ""

# Verifica se o servidor está rodando
if ! curl -s "$API_URL" > /dev/null 2>&1; then
    echo -e "${RED}❌ Servidor não está rodando em $API_URL${NC}"
    echo "Execute: npm run dev"
    exit 1
fi

echo -e "${GREEN}✅ Servidor está online${NC}"
echo ""

# Testa endpoints do proxy
test_endpoint "API Root" "GET" "/"
test_endpoint "Listar Localidades" "GET" "/api/localidades"
test_endpoint "Buscar Localidade (Porto Alegre)" "GET" "/api/localidades/Porto%20Alegre"
test_endpoint "Números Disponíveis (DDD 51)" "GET" "/api/did/disponiveis?ddd=51&quantity=5"
test_endpoint "Meus Números" "GET" "/api/did/meus-numeros"

echo "============================================================"
echo "✨ Testes concluídos!"
echo "============================================================"
