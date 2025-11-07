const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsapp.controller');

/**
 * @swagger
 * tags:
 *   name: WhatsApp
 *   description: Gerenciamento de números WhatsApp
 */

/**
 * @swagger
 * /api/whatsapp/numeros:
 *   get:
 *     summary: Lista todos os números WhatsApp
 *     tags: [WhatsApp]
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
 *     responses:
 *       200:
 *         description: Lista de números WhatsApp
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
 *                       numero:
 *                         type: string
 *                         example: "551199999999"
 *                       status:
 *                         type: string
 *                         example: "ativo"
 *                       dataAtivacao:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Erro no servidor
 */
router.get('/numeros', whatsappController.listarNumeros);

/**
 * @swagger
 * /api/whatsapp/{numero}:
 *   get:
 *     summary: Busca informações de um número WhatsApp específico
 *     tags: [WhatsApp]
 *     parameters:
 *       - in: path
 *         name: numero
 *         required: true
 *         schema:
 *           type: string
 *         description: Número WhatsApp completo
 *         example: "551199999999"
 *     responses:
 *       200:
 *         description: Informações do número WhatsApp
 *       404:
 *         description: Número não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.get('/:numero', whatsappController.buscarNumero);

/**
 * @swagger
 * /api/whatsapp/ativar:
 *   post:
 *     summary: Ativa WhatsApp em um número
 *     tags: [WhatsApp]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numero
 *             properties:
 *               numero:
 *                 type: string
 *                 example: "551199999999"
 *               webhook:
 *                 type: string
 *                 example: "https://api.atendimentobr.com/webhook/whatsapp"
 *               nomeExibicao:
 *                 type: string
 *                 example: "AtendimentoBR"
 *     responses:
 *       201:
 *         description: WhatsApp ativado com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro no servidor
 */
router.post('/ativar', whatsappController.ativarWhatsApp);

/**
 * @swagger
 * /api/whatsapp/{numero}/configurar:
 *   put:
 *     summary: Configura número WhatsApp
 *     tags: [WhatsApp]
 *     parameters:
 *       - in: path
 *         name: numero
 *         required: true
 *         schema:
 *           type: string
 *         description: Número WhatsApp completo
 *         example: "551199999999"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               webhook:
 *                 type: string
 *                 example: "https://api.atendimentobr.com/webhook/whatsapp"
 *               nomeExibicao:
 *                 type: string
 *                 example: "AtendimentoBR"
 *     responses:
 *       200:
 *         description: WhatsApp configurado com sucesso
 *       404:
 *         description: Número não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.put('/:numero/configurar', whatsappController.configurarWhatsApp);

/**
 * @swagger
 * /api/whatsapp/{numero}:
 *   delete:
 *     summary: Desativa WhatsApp de um número
 *     tags: [WhatsApp]
 *     parameters:
 *       - in: path
 *         name: numero
 *         required: true
 *         schema:
 *           type: string
 *         description: Número WhatsApp completo
 *         example: "551199999999"
 *     responses:
 *       200:
 *         description: WhatsApp desativado com sucesso
 *       404:
 *         description: Número não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.delete('/:numero', whatsappController.desativarWhatsApp);

module.exports = router;
