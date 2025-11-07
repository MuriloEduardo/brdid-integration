const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billing.controller');

/**
 * @swagger
 * tags:
 *   name: Billing
 *   description: Gerenciamento de saldo, extrato e faturas
 */

/**
 * @swagger
 * /api/billing/saldo:
 *   get:
 *     summary: Obtém o saldo atual da conta
 *     tags: [Billing]
 *     responses:
 *       200:
 *         description: Saldo da conta
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
 *                     saldo:
 *                       type: number
 *                       example: 1250.50
 *                     moeda:
 *                       type: string
 *                       example: "BRL"
 *       500:
 *         description: Erro no servidor
 */
router.get('/saldo', billingController.getSaldo);

/**
 * @swagger
 * /api/billing/extrato:
 *   get:
 *     summary: Lista transações do extrato
 *     tags: [Billing]
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
 *         description: Lista de transações
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
 *                       id:
 *                         type: string
 *                       tipo:
 *                         type: string
 *                         example: "debito"
 *                       descricao:
 *                         type: string
 *                       valor:
 *                         type: number
 *                       data:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Erro no servidor
 */
router.get('/extrato', billingController.getExtrato);

/**
 * @swagger
 * /api/billing/faturas:
 *   get:
 *     summary: Lista faturas
 *     tags: [Billing]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [paga, pendente, vencida]
 *         description: Filtrar por status da fatura
 *     responses:
 *       200:
 *         description: Lista de faturas
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
 *                       faturaId:
 *                         type: string
 *                       mes:
 *                         type: string
 *                       valor:
 *                         type: number
 *                       status:
 *                         type: string
 *                       vencimento:
 *                         type: string
 *                         format: date
 *       500:
 *         description: Erro no servidor
 */
router.get('/faturas', billingController.getFaturas);

/**
 * @swagger
 * /api/billing/faturas/{faturaId}:
 *   get:
 *     summary: Obtém detalhes de uma fatura específica
 *     tags: [Billing]
 *     parameters:
 *       - in: path
 *         name: faturaId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da fatura
 *     responses:
 *       200:
 *         description: Detalhes da fatura
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
 *                     faturaId:
 *                       type: string
 *                     mes:
 *                       type: string
 *                     valor:
 *                       type: number
 *                     status:
 *                       type: string
 *                     itens:
 *                       type: array
 *                       items:
 *                         type: object
 *       404:
 *         description: Fatura não encontrada
 *       500:
 *         description: Erro no servidor
 */
router.get('/faturas/:faturaId', billingController.getFatura);

module.exports = router;
