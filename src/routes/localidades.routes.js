const express = require('express');
const router = express.Router();
const localidadesController = require('../controllers/localidades.controller');

/**
 * @swagger
 * tags:
 *   name: Localidades
 *   description: Busca localidades com DIDS disponíveis
 */

/**
 * @swagger
 * /api/localidades:
 *   get:
 *     summary: Busca localidades com DIDS disponíveis
 *     tags: [Localidades]
 *     parameters:
 *       - in: query
 *         name: TOKEN
 *         required: true
 *         schema:
 *           type: string
 *         description: Token da sua conta BR DID
 *     responses:
 *       200:
 *         description: Lista de localidades retornada com sucesso
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
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 */
router.get('/', localidadesController.buscarLocalidades);

module.exports = router;
