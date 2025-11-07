#!/bin/bash

# Script rápido para testar endpoint funcional da BRDID
echo "🧪 Testando endpoint funcional da BRDID"
echo "========================================"

# Carrega TOKEN do .env
if [ -f .env ]; then
    export $(cat .env | grep BRDID_TOKEN | xargs)
fi

echo "📍 Testando: Buscar números por área local (Porto Alegre)"
echo ""

curl -X 'GET' \
  "https://brdid.com.br/br-did/api/public/buscar_numeros_by_area_local?TOKEN=${BRDID_TOKEN}&AREA_LOCAL=Porto%20Alegre" \
  -H 'accept: application/json' | jq '.[0:3]'

echo ""
echo "========================================"
echo "✅ Teste concluído!"
