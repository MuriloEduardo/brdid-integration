const express = require('express');
const router = express.Router();
const didController = require('../controllers/did.controller');

/**
 * @swagger
 * tags:
 *   name: DID
 *   description: Gerenciamento de números DID (VoIP)
 */

/**
 * @swagger
 * /api/did/disponiveis:
 *   get:
 *     summary: Lista números DID disponíveis para compra
 *     tags: [DID]
 *     parameters:
 *       - in: query
 *         name: ddd
 *         schema:
 *           type: string
 *         description: DDD da localidade desejada (ex. 11, 51)
 *         example: "51"
 *       - in: query
 *         name: areaLocal
 *         schema:
 *           type: string
 *         description: Nome da área local (ex. "Porto Alegre", "São Paulo")
 *         example: "Porto Alegre"
 *       - in: query
 *         name: quantity
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Quantidade de números a retornar
 *         example: 10
 *     responses:
 *       200:
 *         description: Lista de números disponíveis
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
 *                       ddd:
 *                         type: string
 *                         example: "11"
 *                       preco:
 *                         type: number
 *                         example: 15.00
 *       400:
 *         description: DDD ou areaLocal não informado
 *       500:
 *         description: Erro no servidor
 */
router.get('/disponiveis', didController.listarNumerosDisponiveis);

/**
 * @swagger
 * /api/did/meus-numeros:
 *   get:
 *     summary: Lista todos os números DID da conta
 *     tags: [DID]
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
 *         description: Lista de números da conta
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
 *                       ddd:
 *                         type: string
 *                         example: "11"
 *                       status:
 *                         type: string
 *                         example: "ativo"
 *                       dataCompra:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Erro no servidor
 */
router.get('/meus-numeros', didController.listarMeusNumeros);

/**
 * @swagger
 * /api/did/{numero}:
 *   get:
 *     summary: Busca informações de um número específico
 *     tags: [DID]
 *     parameters:
 *       - in: path
 *         name: numero
 *         required: true
 *         schema:
 *           type: string
 *         description: Número DID completo
 *         example: "551199999999"
 *     responses:
 *       200:
 *         description: Informações do número
 *       404:
 *         description: Número não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.get('/:numero', didController.buscarNumero);

/**
 * @swagger
 * /api/did/comprar:
 *   post:
 *     summary: Compra um número DID
 *     tags: [DID]
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
 *                 example: "https://api.atendimentobr.com/webhook/brdid"
 *               destino:
 *                 type: string
 *                 example: "sip:user@domain.com"
 *     responses:
 *       201:
 *         description: Número comprado com sucesso
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
 *                   example: "Número comprado com sucesso"
 *                 data:
 *                   type: object
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro no servidor
 */
router.post('/comprar', didController.comprarNumero);

/**
 * @swagger
 * /api/did/{numero}/configurar:
 *   put:
 *     summary: Configura um número DID existente
 *     tags: [DID]
 *     parameters:
 *       - in: path
 *         name: numero
 *         required: true
 *         schema:
 *           type: string
 *         description: Número DID completo
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
 *                 example: "https://api.atendimentobr.com/webhook/brdid"
 *               destino:
 *                 type: string
 *                 example: "sip:user@domain.com"
 *               habilitarGravacao:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Número configurado com sucesso
 *       404:
 *         description: Número não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.put('/:numero/configurar', didController.configurarNumero);

/**
 * @swagger
 * /api/did/{numero}:
 *   delete:
 *     summary: Cancela/Remove um número DID
 *     tags: [DID]
 *     parameters:
 *       - in: path
 *         name: numero
 *         required: true
 *         schema:
 *           type: string
 *         description: Número DID completo
 *         example: "551199999999"
 *     responses:
 *       200:
 *         description: Número cancelado com sucesso
 *       404:
 *         description: Número não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.delete('/:numero', didController.cancelarNumero);

module.exports = router;
