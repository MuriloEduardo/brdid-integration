const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billing.controller');

/**
 * @swagger
 * tags:
 *   name: Billing Clientes
 *   description: Gerenciamento de planos e clientes de billing
 */

/**
 * @swagger
 * /api/billing/planos:
 *   post:
 *     summary: Cria um novo plano
 *     tags: [Billing Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Plano criado com sucesso
 *   get:
 *     summary: Lista Planos Billing
 *     tags: [Billing Clientes]
 *     responses:
 *       200:
 *         description: Lista de planos
 */
router.post('/planos', billingController.criarPlano);
router.get('/planos', billingController.listarPlanos);

/**
 * @swagger
 * /api/billing/clientes:
 *   post:
 *     summary: Cria um novo cliente no grupo de Billing
 *     tags: [Billing Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *   get:
 *     summary: Lista grupo de clientes
 *     tags: [Billing Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
router.post('/clientes', billingController.criarCliente);
router.get('/clientes', billingController.listarClientes);

/**
 * @swagger
 * /api/billing/vincular:
 *   post:
 *     summary: Vincule DIDs e um plano a um cliente
 *     tags: [Billing Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idPlano, idCliente, listaDids]
 *             properties:
 *               idPlano:
 *                 type: number
 *               idCliente:
 *                 type: number
 *               listaDids:
 *                 type: string
 *                 description: Lista de DIDs separados por vírgula
 *     responses:
 *       200:
 *         description: Vínculo criado com sucesso
 */
router.post('/vincular', billingController.montarClientePlanoDIDs);

module.exports = router;
