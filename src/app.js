const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const config = require('./config');
const swaggerSpec = require('./config/swagger');
const routes = require('./routes');

const app = express();

// Middlewares de segurança e utilidades
app.use(helmet({
    contentSecurityPolicy: false, // Desabilita CSP para permitir Swagger UI
}));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota raiz
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: `Bem-vindo à ${config.appName}`,
        version: '1.0.0',
        documentation: '/api-docs',
    });
});

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'AtendimentoBR BRDID API',
    swaggerOptions: {
        url: '/api-docs/swagger.json',
    },
}));

// Rota para servir o JSON do Swagger
app.get('/api-docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// Rotas da API
app.use('/api', routes);

// Middleware de erro 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Rota não encontrada',
    });
});

// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Erro interno do servidor',
    });
});

module.exports = app;
