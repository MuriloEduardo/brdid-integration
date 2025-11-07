const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientes.controller');

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Gerenciamento de clientes/subcontas
 */

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Lista todos os clientes
 *     tags: [Clientes]
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
 *         description: Lista de clientes
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
 *                       clienteId:
 *                         type: string
 *                       nome:
 *                         type: string
 *                       email:
 *                         type: string
 *                       dataCriacao:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Erro no servidor
 */
router.get('/', clientesController.listarClientes);

/**
 * @swagger
 * /api/clientes:
 *   post:
 *     summary: Cria um novo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Empresa ABC Ltda"
 *               email:
 *                 type: string
 *                 example: "contato@empresaabc.com"
 *               telefone:
 *                 type: string
 *                 example: "551199999999"
 *               documento:
 *                 type: string
 *                 example: "12345678000190"
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
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
 *                   example: "Cliente criado com sucesso"
 *                 data:
 *                   type: object
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro no servidor
 */
router.post('/', clientesController.criarCliente);

/**
 * @swagger
 * /api/clientes/{clienteId}:
 *   get:
 *     summary: Obtém informações de um cliente específico
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Informações do cliente
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.get('/:clienteId', clientesController.getCliente);

/**
 * @swagger
 * /api/clientes/{clienteId}:
 *   put:
 *     summary: Atualiza informações de um cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               telefone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.put('/:clienteId', clientesController.atualizarCliente);

/**
 * @swagger
 * /api/clientes/{clienteId}:
 *   delete:
 *     summary: Remove um cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Cliente removido com sucesso
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.delete('/:clienteId', clientesController.removerCliente);

module.exports = router;
