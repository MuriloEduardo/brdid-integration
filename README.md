# AtendimentoBR - BRDID Proxy API

> 📚 **Novo aqui?** Comece pelo [Guia de Início Rápido (QUICKSTART.md)](QUICKSTART.md)  
> 📖 **Documentação completa:** Veja o [Índice de Documentação (INDEX.md)](INDEX.md)

API Proxy serverless para integração com BRDID, provedor de números VoIP, WhatsApp e SMS. Esta API abstrai toda a complexidade da plataforma BRDID para a plataforma AtendimentoBR.

## 🚀 Funcionalidades

- **Localidades**: Consulta de DDDs e localidades disponíveis
- **DID (Números VoIP)**: 
  - Listagem de números disponíveis por DDD
  - Compra de números
  - Configuração de números
  - Gerenciamento de números ativos
- **WhatsApp**: 
  - Ativação de WhatsApp em números
  - Configuração de webhooks
  - Gerenciamento de números WhatsApp
- **SMS**: 
  - Envio de SMS
  - Listagem de SMS enviados e recebidos
  - Consulta de status de envio
- **Billing**: 
  - Consulta de saldo
  - Extrato de transações
  - Gerenciamento de faturas
- **Clientes**: 
  - Gerenciamento de subcontas
  - CRUD completo de clientes

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Conta ativa na BRDID com API Key e Secret

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd brdid-integration
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` com suas credenciais da BRDID:
```env
BRDID_API_URL=https://brdid.com.br/br-did/api/public
BRDID_TOKEN=seu_token_aqui
PORT=3000
NODE_ENV=development
```

**Nota**: O token já está configurado no `.env.example` para testes. Em produção, use suas próprias credenciais.

## 🚀 Executando o projeto

### Modo de desenvolvimento:
```bash
npm run dev
```

### Modo de produção:
```bash
npm start
```

A API estará disponível em `http://localhost:3000`

## 🧪 Testando a API

### Testes automatizados de integração com BRDID:
```bash
npm run test:integration
```

### Testes do proxy (requer servidor rodando):
Em um terminal, inicie o servidor:
```bash
npm run dev
```

Em outro terminal, execute os testes:
```bash
npm run test:proxy
```

### Teste rápido com curl:
```bash
# Teste direto na API BRDID
bash tests/quick-test.sh

# Com o servidor rodando, teste o proxy:
curl "http://localhost:3000/api/localidades/Porto%20Alegre"
curl "http://localhost:3000/api/did/disponiveis?areaLocal=Porto%20Alegre&quantity=5"
```

## 📚 Documentação

A documentação completa da API está disponível via Swagger UI após iniciar o servidor:

**URL da documentação**: `http://localhost:3000/api-docs`

## 🛣️ Principais Endpoints

### Localidades
- `GET /api/localidades` - Lista todas as localidades/DDDs
- `GET /api/localidades/:areaLocal` - Busca números em uma área local específica (ex: "Porto Alegre")

### DID (Números VoIP)
- `GET /api/did/disponiveis?areaLocal=Porto%20Alegre` - Lista números disponíveis por área local
- `GET /api/did/disponiveis?ddd=51` - Lista números disponíveis por DDD (se disponível)
- `GET /api/did/meus-numeros` - Lista seus números ativos
- `POST /api/did/comprar` - Compra um número
- `PUT /api/did/:numero/configurar` - Configura um número
- `DELETE /api/did/:numero` - Cancela um número

### WhatsApp
- `GET /api/whatsapp/numeros` - Lista números WhatsApp
- `POST /api/whatsapp/ativar` - Ativa WhatsApp em um número
- `PUT /api/whatsapp/:numero/configurar` - Configura número WhatsApp
- `DELETE /api/whatsapp/:numero` - Desativa WhatsApp

### SMS
- `POST /api/sms/enviar` - Envia um SMS
- `GET /api/sms/enviados` - Lista SMS enviados
- `GET /api/sms/recebidos` - Lista SMS recebidos
- `GET /api/sms/:smsId/status` - Consulta status de um SMS

### Billing
- `GET /api/billing/saldo` - Consulta saldo da conta
- `GET /api/billing/extrato` - Lista transações
- `GET /api/billing/faturas` - Lista faturas
- `GET /api/billing/faturas/:faturaId` - Detalhes de uma fatura

### Clientes
- `GET /api/clientes` - Lista clientes
- `POST /api/clientes` - Cria novo cliente
- `GET /api/clientes/:clienteId` - Busca cliente específico
- `PUT /api/clientes/:clienteId` - Atualiza cliente
- `DELETE /api/clientes/:clienteId` - Remove cliente

## 📦 Estrutura do Projeto

```
brdid-integration/
├── src/
│   ├── config/           # Configurações (env, swagger)
│   ├── controllers/      # Controladores das rotas
│   ├── routes/           # Definição de rotas
│   ├── services/         # Serviços de integração (BRDID)
│   ├── app.js            # Configuração do Express
│   └── server.js         # Inicialização do servidor
├── .env.example          # Exemplo de variáveis de ambiente
├── .gitignore
├── package.json
└── README.md
```

## 🔒 Segurança

- As credenciais da BRDID são armazenadas em variáveis de ambiente
- A API utiliza Helmet para segurança HTTP
- CORS configurado para permitir requisições controladas
- Validação de entrada em todos os endpoints críticos

## 🌐 Exemplo de Uso

### Listar números disponíveis para compra (por área local):
```bash
curl "http://localhost:3000/api/localidades/Porto%20Alegre"
```

Ou pelo endpoint específico:
```bash
curl "http://localhost:3000/api/did/disponiveis?areaLocal=Porto%20Alegre&quantity=5"
```

### Resposta esperada:
```json
{
  "success": true,
  "data": [
    {
      "CODIGO": "3262947",
      "VALOR_MENSAL": "26.30",
      "VALOR_INSTALACAO": "26.30",
      "CN": "43",
      "NUMERO": "2018-1390",
      "GOLD": "0",
      "SUPER_GOLD": "0",
      "DIAMANTE": "0"
    }
  ]
}
```

### Comprar um número:
```bash
curl -X POST "http://localhost:3000/api/did/comprar" \
  -H "Content-Type: application/json" \
  -d '{
    "numero": "551199999999",
    "webhook": "https://api.atendimentobr.com/webhook/brdid"
  }'
```

### Enviar SMS:
```bash
curl -X POST "http://localhost:3000/api/sms/enviar" \
  -H "Content-Type: application/json" \
  -d '{
    "origem": "551199999999",
    "destino": "551188888888",
    "mensagem": "Olá! Mensagem de teste."
  }'
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

## 📞 Suporte

Para suporte e dúvidas, entre em contato com a equipe AtendimentoBR.

## ⚠️ Notas Importantes

### Endpoints da API BRDID

A API pública da BRDID tem endpoints limitados. Os seguintes endpoints estão **confirmados como funcionais**:

✅ **Funcionais:**
- `buscar_numeros_by_area_local` - Buscar números por área local (ex: "Porto Alegre")

⚠️ **Possivelmente indisponíveis na API pública:**
- `buscar_numeros_by_ddd` - Buscar por DDD
- `listar_areas_locais` - Listar todas as áreas
- `listar_meus_numeros` - Listar números da conta
- `verificar_saldo` - Verificar saldo
- Endpoints de compra e configuração (requerem autenticação específica)

### Autenticação

A API utiliza TOKEN como query parameter:
```
?TOKEN=seu_token_aqui
```

O token é automaticamente adicionado a todas as requisições pelo serviço proxy.

### Documentação Completa

Para informações detalhadas sobre todos os endpoints disponíveis na API BRDID, consulte:
- Documentação oficial: https://brdid.com.br/api-docs/
- Swagger UI do proxy: http://localhost:3000/api-docs

---

**Desenvolvido com ❤️ pela equipe AtendimentoBR**
