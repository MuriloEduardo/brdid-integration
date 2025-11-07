# BRDID Proxy API - AI Agent Instructions

## Architecture Overview

This is a **proxy API** that abstracts the BRDID telephony provider API for AtendimentoBR. It wraps BRDID's VoIP/WhatsApp/SMS services with a consistent REST interface and auto-generated Swagger documentation.

**Key Pattern**: Single service (`brdid.service.js`) → Multiple controllers → Routes with Swagger JSDoc → Express app

```
Client → Express Router → Controller → BRDIDService → BRDID API (external)
```

## Critical Authentication Pattern

BRDID API uses **TOKEN as query parameter**, NOT headers. See `src/services/brdid.service.js`:

```javascript
// Axios interceptor ALWAYS adds TOKEN to query params
this.client.interceptors.request.use((config) => {
  if (!config.params) config.params = {};
  config.params.TOKEN = this.token;  // Query param, not header!
  return config;
});
```

**Never** use Authorization headers with BRDID - they use `?TOKEN=xxx` format.

## Service Layer Architecture

`BRDIDService` (singleton) handles ALL external API calls. Key patterns:

1. **Direct API mapping**: All 17 methods map 1:1 to real BRDID endpoints
2. **No graceful degradation**: All endpoints are verified to exist in official API
3. **Consistent error format**: Always throw `{ success: false, error: string, statusCode: number }`

Example from `src/services/brdid.service.js`:
```javascript
async buscarNumerosByAreaLocal(areaLocal) {
  return this.request('GET', '/buscar_numeros_by_area_local', null, {
    AREA_LOCAL: areaLocal
  });
}
```

## Controller Response Pattern

**ALL controllers** must return this exact JSON structure:

```javascript
// Success
res.json({ success: true, data: result, message?: string });

// Error
res.status(statusCode).json({ success: false, error: string });
```

See `src/controllers/did.controller.js` for examples. Never return raw data without the wrapper.

## Swagger Documentation

Routes use **inline JSDoc comments** for auto-documentation. Pattern in `src/routes/*.routes.js`:

```javascript
/**
 * @swagger
 * /api/did/disponiveis:
 *   get:
 *     summary: Lista números DID disponíveis
 *     tags: [DID]
 *     parameters:
 *       - in: query
 *         name: areaLocal
 *         schema: { type: string }
 *         example: "Porto Alegre"
 */
router.get('/disponiveis', didController.listarNumerosDisponiveis);
```

When adding endpoints, **always** add Swagger JSDoc above the route definition.

## BRDID API - Real Endpoints (17 Total)

**All endpoints verified from official API**: https://brdid.com.br/api-docs/brdid-api.json

### Localidades (1)
- `GET /buscar_localidades` - Busca localidades com DIDS disponíveis

### DID (8)
- `GET /buscar_numeros_by_area_local` - Busca DIDs por área local (limitado a 100)
- `GET /consultar_did` - Busca dados do DID
- `POST /adquirir_novo_did` - Contrata DID e encaminha para Sip Trunk
- `POST /cancelar_did` - Cancela um DID existente
- `POST /whatsapp_configurar` - Configura webhook para capturar código WhatsApp
- `POST /configurar_siga_me` - Configurar encaminhamento de ligações
- `POST /desconfigurar_siga_me` - Desconfigurar encaminhamento
- `GET /get_dids_cdrs` - Busca Logs de Chamadas por Número

### SMS (3)
- `POST /enviar_sms` - Envia SMS para até 20.000 destinos
- `POST /cadastrar_layout_sms` - Cadastra novo layout de mensagem
- `GET /consultar_layout_sms` - Consulta layouts aprovados

### Billing Clientes (5)
- `POST /criar_plano` - Cria um novo plano
- `GET /listar_planos` - Lista Planos Billing
- `POST /criar_cliente` - Cria novo cliente no grupo de Billing
- `GET /listar_clientes` - Lista grupo de clientes
- `POST /montar_cliente_plano_dids` - Vincula DIDs e plano a cliente

## Testing Workflow

1. **Environment check**: `npm run verify` (runs `tests/verify-setup.sh`)
2. **Integration tests**: `npm run test:integration` (tests BRDID API directly)
3. **Proxy tests**: `npm run test:proxy` (requires running server)
4. **Quick test**: `bash tests/quick-test.sh` (tests working endpoint)

**Test pattern** (see `tests/integration.test.js`):
```javascript
class BRDIDIntegrationTests {
  logResult(testName, success, data, error) {
    // Structured logging with icons
    const icon = success ? '✅' : '❌';
    console.log(`${icon} ${testName}`);
  }
}
```

Tests are custom classes, **not Jest/Mocha** - they log results with emoji indicators.

## Environment Configuration

Required vars in `.env`:
```bash
BRDID_API_URL=https://brdid.com.br/br-did/api/public
BRDID_TOKEN=xxx  # Token format: "base64string:hexhash"
PORT=3000
```

**Critical**: Token format is `base64:hash`, separated by colon. Example in `.env.example`.

## Adding New Endpoints

1. Add method to `src/services/brdid.service.js` with error handling
2. Create controller method in `src/controllers/[category].controller.js`
3. Add route with Swagger JSDoc in `src/routes/[category].routes.js`
4. Export route in `src/routes/index.js` if new category
5. Test with `npm run test:integration`

**Example** (adding new DID endpoint):
```javascript
// 1. Service (src/services/brdid.service.js)
async consultarDID(numero) {
  return this.request('GET', '/consultar_did', null, { NUMERO: numero });
}

// 2. Controller (src/controllers/did.controller.js)
async consultarDID(req, res) {
  try {
    const result = await brdidService.consultarDID(req.params.numero);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, error: error.error });
  }
}

// 3. Route with Swagger (src/routes/did.routes.js)
/**
 * @swagger
 * /api/did/{numero}:
 *   get:
 *     summary: Busca dados do DID
 *     tags: [DID]
 */
router.get('/:numero', didController.consultarDID);
```

## Project Structure Convention

```
src/
├── config/          # Environment & Swagger config (dotenv loaded here)
├── controllers/     # One per resource (6 files: did, whatsapp, sms, etc)
├── routes/          # One per resource + index.js (7 files)
├── services/        # ONLY brdid.service.js (singleton pattern)
├── app.js           # Express setup, middleware, error handlers
└── server.js        # HTTP server startup (imports app.js)

tests/               # Custom test classes (not Jest framework)
```

**No models/middlewares folders** - this is a thin proxy, not a full backend.

## Utility Scripts

- `./start.sh` - Interactive first-run setup
- `npm run verify` - Full environment check
- `npm run dev` - Start with nodemon (auto-reload)

Scripts use **bash with emoji output** - maintain this style for consistency.

## Critical "Why" Decisions

1. **Why singleton service?** - Single BRDID account, no multi-tenancy needed
2. **Why query param auth?** - BRDID API requirement, not REST best practice
3. **Why custom test classes?** - Quick validation without test framework overhead
4. **Why 17 endpoints only?** - All verified against official BRDID API documentation
5. **Why Portuguese?** - Brazilian client, BRDID API returns PT responses

## Common Pitfalls

❌ Don't add Authorization headers to BRDID requests
❌ Don't use jest.describe() - tests are plain classes
❌ Don't skip Swagger JSDoc - it's mandatory for all routes
❌ Don't assume BRDID endpoints work - check official API at https://brdid.com.br/api-docs
❌ Don't return raw data - always use `{ success, data, error }` format

## Quick Reference

- Swagger UI: `http://localhost:3000/api-docs`
- Working endpoint: `GET /api/did/numeros?areaLocal=Porto%20Alegre`
- Test endpoint: `curl "http://localhost:3000/api/did/numeros?areaLocal=Porto%20Alegre"`
- Logs: Terminal output (no file logging configured)
