#!/bin/bash

# 🚀 Script de comandos úteis para BRDID Proxy API

show_menu() {
    clear
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║       🚀 BRDID Proxy API - Menu de Comandos Úteis            ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "  1) 🔍 Verificar ambiente"
    echo "  2) 🏃 Iniciar servidor (dev)"
    echo "  3) 🧪 Executar testes de integração"
    echo "  4) 📡 Testar endpoint funcional"
    echo "  5) 📚 Abrir documentação Swagger"
    echo "  6) 📊 Ver status da API"
    echo "  7) 📝 Ver logs do servidor"
    echo "  8) 🛑 Parar servidor"
    echo "  9) 🔄 Reinstalar dependências"
    echo "  0) ❌ Sair"
    echo ""
    echo "────────────────────────────────────────────────────────────────"
}

verify_env() {
    echo "🔍 Verificando ambiente..."
    bash tests/verify-setup.sh
    read -p "Pressione Enter para continuar..."
}

start_server() {
    echo "🏃 Iniciando servidor..."
    npm run dev
}

run_tests() {
    echo "🧪 Executando testes de integração..."
    npm run test:integration
    read -p "Pressione Enter para continuar..."
}

test_endpoint() {
    echo "📡 Testando endpoint funcional..."
    echo ""
    if [ -f .env ]; then
        export $(grep BRDID_TOKEN .env | xargs)
    fi
    
    echo "Requisição:"
    echo "GET https://brdid.com.br/br-did/api/public/buscar_numeros_by_area_local"
    echo "    ?TOKEN=***"
    echo "    &AREA_LOCAL=Porto Alegre"
    echo ""
    echo "Resposta:"
    
    response=$(curl -s "https://brdid.com.br/br-did/api/public/buscar_numeros_by_area_local?TOKEN=${BRDID_TOKEN}&AREA_LOCAL=Porto%20Alegre")
    
    if command -v jq > /dev/null; then
        echo "$response" | jq '.[0:2]'
    else
        echo "$response" | head -c 500
        echo "..."
    fi
    
    echo ""
    read -p "Pressione Enter para continuar..."
}

open_docs() {
    echo "📚 Abrindo documentação Swagger..."
    echo ""
    echo "URL: http://localhost:3000/api-docs"
    echo ""
    
    if command -v xdg-open > /dev/null; then
        xdg-open http://localhost:3000/api-docs
    elif command -v open > /dev/null; then
        open http://localhost:3000/api-docs
    else
        echo "Abra manualmente em seu navegador: http://localhost:3000/api-docs"
    fi
    
    read -p "Pressione Enter para continuar..."
}

show_status() {
    echo "📊 Status da API..."
    echo ""
    cat API_STATUS.md | head -50
    echo ""
    echo "(Veja API_STATUS.md para informações completas)"
    echo ""
    read -p "Pressione Enter para continuar..."
}

show_logs() {
    echo "📝 Logs do servidor (últimas 50 linhas)..."
    echo ""
    if [ -f logs/server.log ]; then
        tail -50 logs/server.log
    else
        echo "Nenhum arquivo de log encontrado."
        echo "O servidor exibe logs diretamente no terminal quando executado com 'npm run dev'"
    fi
    echo ""
    read -p "Pressione Enter para continuar..."
}

stop_server() {
    echo "🛑 Parando servidor..."
    pkill -f "node.*server.js" || pkill -f "nodemon.*server.js"
    echo "✅ Servidor parado"
    sleep 2
}

reinstall_deps() {
    echo "🔄 Reinstalando dependências..."
    rm -rf node_modules package-lock.json
    npm install
    echo "✅ Dependências reinstaladas"
    read -p "Pressione Enter para continuar..."
}

# Loop principal
while true; do
    show_menu
    read -p "Escolha uma opção: " choice
    echo ""
    
    case $choice in
        1) verify_env ;;
        2) start_server ;;
        3) run_tests ;;
        4) test_endpoint ;;
        5) open_docs ;;
        6) show_status ;;
        7) show_logs ;;
        8) stop_server ;;
        9) reinstall_deps ;;
        0) echo "👋 Até logo!"; exit 0 ;;
        *) echo "❌ Opção inválida!"; sleep 2 ;;
    esac
done
