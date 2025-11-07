const express = require('express');
const router = express.Router();
const smsController = require('../controllers/sms.controller');

/**
 * @swagger
 * tags:
 *   name: SMS
 *   description: Gerenciamento de envio e recebimento de SMS
 */

/**
 * @swagger
 * /api/sms/enviar:
 *   post:
 *     summary: Envia um SMS
 *     tags: [SMS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - origem
 *               - destino
 *               - mensagem
 *             properties:
 *               origem:
 *                 type: string
 *                 example: "551199999999"
 *                 description: Número de origem (seu número DID)
 *               destino:
 *                 type: string
 *                 example: "551188888888"
 *                 description: Número de destino
 *               mensagem:
 *                 type: string
 *                 example: "Olá! Esta é uma mensagem de teste."
 *                 description: Conteúdo da mensagem
 *     responses:
 *       201:
 *         description: SMS enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "SMS enviado com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     smsId:
 *                       type: string
 *                       example: "sms_123456"
 *                     status:
 *                       type: string
 *                       example: "enviado"
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro no servidor
 */
router.post('/enviar', smsController.enviarSMS);

/**
 * @swagger
 * /api/sms/enviados:
 *   get:
 *     summary: Lista SMS enviados
 *     tags: [SMS]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Página da paginação
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limite de resultados por página
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial do filtro
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final do filtro
 *     responses:
 *       200:
 *         description: Lista de SMS enviados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       smsId:
 *                         type: string
 *                       origem:
 *                         type: string
 *                       destino:
 *                         type: string
 *                       mensagem:
 *                         type: string
 *                       status:
 *                         type: string
 *                       dataEnvio:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Erro no servidor
 */
router.get('/enviados', smsController.listarSMSEnviados);

/**
 * @swagger
 * /api/sms/recebidos:
 *   get:
 *     summary: Lista SMS recebidos
 *     tags: [SMS]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Página da paginação
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limite de resultados por página
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial do filtro
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final do filtro
 *     responses:
 *       200:
 *         description: Lista de SMS recebidos
 *       500:
 *         description: Erro no servidor
 */
router.get('/recebidos', smsController.listarSMSRecebidos);

/**
 * @swagger
 * /api/sms/{smsId}/status:
 *   get:
 *     summary: Busca status de um SMS específico
 *     tags: [SMS]
 *     parameters:
 *       - in: path
 *         name: smsId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do SMS
 *         example: "sms_123456"
 *     responses:
 *       200:
 *         description: Status do SMS
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     smsId:
 *                       type: string
 *                       example: "sms_123456"
 *                     status:
 *                       type: string
 *                       example: "entregue"
 *                     dataAtualizacao:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: SMS não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.get('/:smsId/status', smsController.buscarStatusSMS);

module.exports = router;
