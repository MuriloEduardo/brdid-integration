const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsapp.controller');

/**
 * @swagger
 * tags:
 *   name: WhatsApp
 *   description: Configuração de WhatsApp Business
 */

/**
 * @swagger
 * /api/whatsapp/configurar:
 *   post:
 *     summary: Configura webhook para capturar código do WhatsApp
 *     tags: [WhatsApp]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [numero, urlRetorno]
 *             properties:
 *               numero:
 *                 type: string
 *                 description: Número (DID) para WhatsApp Business
 *               urlRetorno:
 *                 type: string
 *                 description: URL de webhook para receber código de verificação
 *     responses:
 *       200:
 *         description: WhatsApp configurado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/configurar', whatsappController.configurarWhatsApp);

module.exports = router;
