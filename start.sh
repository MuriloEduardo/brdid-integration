#!/bin/bash

# 🚀 Script de primeira execução - BRDID Proxy API
# Execute: bash start.sh

clear

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║      🚀 BRDID Proxy API - AtendimentoBR                       ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Verifica se é primeira execução
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📋 Primeira execução detectada!${NC}"
    echo ""
    echo "Configurando ambiente..."
    cp .env.example .env
    echo -e "${GREEN}✅ Arquivo .env criado${NC}"
    echo ""
fi

# Verifica dependências
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Instalando dependências...${NC}"
    npm install
    echo ""
fi

# Verifica ambiente
echo -e "${BLUE}🔍 Verificando ambiente...${NC}"
echo ""
bash tests/verify-setup.sh

if [ $? -eq 0 ]; then
    echo ""
    echo "════════════════════════════════════════════════════════════════"
    echo ""
    echo -e "${GREEN}✨ Tudo pronto! Escolha uma opção:${NC}"
    echo ""
    echo "  1) 🚀 Iniciar servidor agora"
    echo "  2) 🧪 Executar testes primeiro"
    echo "  3) 📚 Ver documentação"
    echo "  4) ❌ Sair"
    echo ""
    read -p "Escolha (1-4): " choice
    
    case $choice in
        1)
            echo ""
            echo -e "${GREEN}🚀 Iniciando servidor...${NC}"
            echo ""
            echo "Acesse a documentação em: http://localhost:3000/api-docs"
            echo ""
            npm run dev
            ;;
        2)
            echo ""
            echo -e "${GREEN}🧪 Executando testes...${NC}"
            echo ""
            npm run test:integration
            echo ""
            echo "Deseja iniciar o servidor agora? (s/n)"
            read -p "> " start_server
            if [ "$start_server" = "s" ]; then
                npm run dev
            fi
            ;;
        3)
            echo ""
            echo -e "${BLUE}📚 Documentação disponível:${NC}"
            echo ""
            echo "  • INDEX.md       - Índice completo"
            echo "  • QUICKSTART.md  - Guia de início rápido"
            echo "  • README.md      - Documentação completa"
            echo "  • SUMMARY.md     - Sumário executivo"
            echo ""
            echo "Para iniciar o servidor, execute: npm run dev"
            ;;
        *)
            echo ""
            echo "Para iniciar depois, execute: npm run dev"
            ;;
    esac
else
    echo ""
    echo -e "${YELLOW}⚠️ Corrija os problemas acima antes de continuar.${NC}"
fi
