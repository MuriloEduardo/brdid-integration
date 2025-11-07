const express = require('express');
const router = express.Router();
const smsController = require('../controllers/sms.controller');

/**
 * @swagger
 * tags:
 *   name: SMS
 *   description: Gerenciamento de SMS
 */

/**
 * @swagger
 * /api/sms:
 *   post:
 *     summary: Envia SMS para até 20.000 destinos
 *     tags: [SMS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [numeros, idLayout]
 *             properties:
 *               numeros:
 *                 type: string
 *                 description: Lista de números separados por vírgula
 *               idLayout:
 *                 type: number
 *                 description: ID do layout da mensagem
 *     responses:
 *       201:
 *         description: SMS enviado com sucesso
 */
router.post('/', smsController.enviarSMS);

/**
 * @swagger
 * /api/sms/layouts:
 *   post:
 *     summary: Cadastra novo layout de mensagem
 *     tags: [SMS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mensagem:
 *                 type: string
 *     responses:
 *       201:
 *         description: Layout cadastrado
 *   get:
 *     summary: Consulta layouts aprovados
 *     tags: [SMS]
 *     parameters:
 *       - name: idLayout
 *         in: query
 *         schema:
 *           type: number
 *         description: ID do layout (opcional)
 *     responses:
 *       200:
 *         description: Layout(s) retornado(s)
 */
router.post('/layouts', smsController.cadastrarLayoutSMS);
router.get('/layouts', smsController.consultarLayoutSMS);

module.exports = router;
