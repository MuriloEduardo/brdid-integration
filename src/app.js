const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const config = require('./config');
const swaggerSpec = require('./config/swagger');
const routes = require('./routes');

const app = express();

// Serve arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, '../public')));

// Middlewares de segurança e utilidades
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'", "https://cdn.jsdelivr.net"],
        },
    },
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

// Documentação Swagger - serve HTML customizado
app.get('/api-docs', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/swagger.html'));
});

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
