const swaggerJsdoc = require('swagger-jsdoc');

// Detecta o ambiente e define a URL base
const getServerUrl = () => {
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    if (process.env.NODE_ENV === 'production') {
        return 'https://brdid-integration.vercel.app';
    }
    const port = process.env.PORT || 3001;
    return `http://localhost:${port}`;
};

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'AtendimentoBR BRDID Proxy API',
            version: '1.0.0',
            description: 'API Proxy para integração com BRDID - Provedor de números VoIP, WhatsApp e SMS',
            contact: {
                name: 'AtendimentoBR',
            },
        },
        servers: [
            {
                url: getServerUrl(),
                description: process.env.NODE_ENV === 'production' ? 'Servidor de Produção' : 'Servidor de Desenvolvimento',
            },
        ],
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'X-API-Key',
                    description: 'Chave de API para autenticação',
                },
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false,
                        },
                        error: {
                            type: 'string',
                            example: 'Mensagem de erro',
                        },
                    },
                },
            },
        },
        security: [
            {
                ApiKeyAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
