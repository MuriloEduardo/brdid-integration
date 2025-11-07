# AtendimentoBR - BRDID Proxy API

API Proxy para integração com BRDID, provedor de números VoIP, WhatsApp e SMS. Esta API abstrai a complexidade da plataforma BRDID com uma interface REST consistente e documentação Swagger automática.

## 🚀 Funcionalidades

### 📍 Localidades (1 endpoint)
- Busca localidades com DIDs disponíveis

### 📞 DID - Números VoIP (8 endpoints)
- Busca números disponíveis por área local (limitado a 100)
- Consulta dados de DID específico
- Aquisição de novos DIDs
- Cancelamento de DIDs
- Configuração de encaminhamento (Siga-me)
- Configuração de webhook WhatsApp
- Consulta de logs de chamadas (CDRs)

### 💬 WhatsApp (1 endpoint)
- Configuração de webhook para captura de código de verificação

### 📱 SMS (3 endpoints)
- Envio de SMS em lote (até 20.000 destinos)
- Cadastro de layouts de mensagem
- Consulta de layouts aprovados

### 💰 Billing Clientes (5 endpoints)
- Criação e listagem de planos
- Criação e listagem de clientes
- Vinculação de DIDs e planos a clientes

**Total: 17 endpoints reais verificados contra a API oficial BRDID**

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Conta ativa na BRDID com TOKEN de API

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

**Nota Importante**: O TOKEN da BRDID tem formato `base64string:hexhash` (separado por dois pontos).

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

### Verificação do ambiente:
```bash
npm run verify
```

### Testes de integração:
```bash
npm run test:integration
```

### Teste rápido:
```bash
# Com o servidor rodando:
curl "http://localhost:3000/api/localidades"
curl "http://localhost:3000/api/did/numeros?areaLocal=Porto%20Alegre"
```

## 📚 Documentação Swagger

A documentação completa da API está disponível via Swagger UI:

**URL**: `http://localhost:3000/api-docs`

A documentação é gerada automaticamente a partir dos comentários JSDoc nas rotas.

## 🛣️ Endpoints Disponíveis

### Localidades
```
GET /api/localidades
```
Busca todas as localidades com DIDs disponíveis.

### DID (Números VoIP)
```
GET    /api/did/numeros?areaLocal=Porto%20Alegre
GET    /api/did/:numero
POST   /api/did
DELETE /api/did
POST   /api/did/siga-me
DELETE /api/did/siga-me
GET    /api/did/cdrs?numero=X&periodo=MMAAAA
```

### WhatsApp
```
POST /api/whatsapp/configurar
```
Configura webhook para capturar código de verificação do WhatsApp Business.

### SMS
```
POST /api/sms
POST /api/sms/layouts
GET  /api/sms/layouts?idLayout=X
```

### Billing Clientes
```
POST /api/billing/planos
GET  /api/billing/planos
POST /api/billing/clientes
GET  /api/billing/clientes
POST /api/billing/vincular
```

## 📦 Estrutura do Projeto

```
brdid-integration/
├── src/
│   ├── config/           # Configurações (env, swagger)
│   ├── controllers/      # Controladores (6 arquivos)
│   ├── routes/           # Rotas com Swagger JSDoc (7 arquivos)
│   ├── services/         # brdid.service.js (singleton)
│   ├── app.js            # Setup Express
│   └── server.js         # Inicialização HTTP
├── tests/                # Testes de integração
├── .env.example          # Template de variáveis
├── .gitignore
├── package.json
└── README.md
```

## � Autenticação

A API BRDID usa **TOKEN como query parameter** (não header). O proxy gerencia isso automaticamente:

```javascript
// Configurado em brdid.service.js
this.client.interceptors.request.use((config) => {
  config.params.TOKEN = this.token;  // Adiciona automaticamente
  return config;
});
```

**Importante**: Usuários do proxy **não** precisam enviar o TOKEN - ele é injetado automaticamente em todas as requisições para a API BRDID.

## 🌐 Exemplos de Uso

### Listar localidades disponíveis:
```bash
curl "http://localhost:3000/api/localidades"
```

### Buscar números disponíveis:
```bash
curl "http://localhost:3000/api/did/numeros?areaLocal=Porto%20Alegre"
```

### Consultar DID específico:
```bash
curl "http://localhost:3000/api/did/51999999999"
```

### Adquirir novo DID:
```bash
curl -X POST "http://localhost:3000/api/did" \
  -H "Content-Type: application/json" \
  -d '{
    "cn": "51",
    "numero": "999999999",
    "sipTrunk": 0
  }'
```

### Enviar SMS:
```bash
curl -X POST "http://localhost:3000/api/sms" \
  -H "Content-Type: application/json" \
  -d '{
    "numeros": "5199999999,5188888888",
    "idLayout": 123
  }'
```

## 📊 Formato de Resposta

Todas as respostas seguem o padrão:

### Sucesso:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operação realizada com sucesso"
}
```

### Erro:
```json
{
  "success": false,
  "error": "Descrição do erro"
}
```

## 🔍 Verificação de Endpoints

Todos os 17 endpoints foram verificados contra a especificação oficial da API BRDID:
- **Documentação oficial**: https://brdid.com.br/api-docs
- **Spec JSON**: https://brdid.com.br/api-docs/brdid-api.json

## 🛠️ Scripts Disponíveis

```bash
npm start              # Inicia servidor em produção
npm run dev            # Inicia com nodemon (auto-reload)
npm run verify         # Verifica configuração do ambiente
npm run test:integration # Testa integração com BRDID
npm run test:proxy     # Testa endpoints do proxy
```

## ⚠️ Limitações Conhecidas

- Endpoint `buscar_numeros_by_area_local` limitado a 100 DIDs por requisição (limitação da API BRDID)
- TOKEN deve estar no formato `base64:hash`
- Alguns endpoints de billing podem requerer permissões especiais na conta BRDID

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e propriedade da AtendimentoBR.

## 📞 Suporte

Para questões sobre a API BRDID, consulte a documentação oficial em https://brdid.com.br/api-docs
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
