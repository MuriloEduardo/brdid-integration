const express = require('express');
const router = express.Router();

// Importa todas as rotas
const localidadesRoutes = require('./localidades.routes');
const didRoutes = require('./did.routes');
const whatsappRoutes = require('./whatsapp.routes');
const smsRoutes = require('./sms.routes');
const billingRoutes = require('./billing.routes');
const clientesRoutes = require('./clientes.routes');

// Registra as rotas
router.use('/localidades', localidadesRoutes);
router.use('/did', didRoutes);
router.use('/whatsapp', whatsappRoutes);
router.use('/sms', smsRoutes);
router.use('/billing', billingRoutes);
router.use('/clientes', clientesRoutes);

// Rota raiz da API
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'AtendimentoBR BRDID Proxy API',
    version: '1.0.0',
    endpoints: {
      localidades: '/api/localidades',
      did: '/api/did',
      whatsapp: '/api/whatsapp',
      sms: '/api/sms',
      billing: '/api/billing',
      clientes: '/api/clientes',
      docs: '/api-docs',
    },
  });
});

module.exports = router;
