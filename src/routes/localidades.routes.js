const express = require('express');
const router = express.Router();
const localidadesController = require('../controllers/localidades.controller');

/**
 * @swagger
 * tags:
 *   name: Localidades
 *   description: Gerenciamento de localidades e DDDs disponíveis
 */

/**
 * @swagger
 * /api/localidades:
 *   get:
 *     summary: Lista todas as localidades/DDDs disponíveis
 *     tags: [Localidades]
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
 *                     properties:
 *                       ddd:
 *                         type: string
 *                         example: "11"
 *                       cidade:
 *                         type: string
 *                         example: "São Paulo"
 *                       estado:
 *                         type: string
 *                         example: "SP"
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', localidadesController.listarLocalidades);

/**
 * @swagger
 * /api/localidades/{areaLocal}:
 *   get:
 *     summary: Busca informações de uma localidade específica
 *     tags: [Localidades]
 *     parameters:
 *       - in: path
 *         name: areaLocal
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome da área local
 *         example: "Porto Alegre"
 *     responses:
 *       200:
 *         description: Informações da localidade
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
 *                     areaLocal:
 *                       type: string
 *                       example: "Porto Alegre"
 *                     ddd:
 *                       type: string
 *                       example: "51"
 *                     numeros:
 *                       type: array
 *                       items:
 *                         type: object
 *       404:
 *         description: Localidade não encontrada
 *       500:
 *         description: Erro no servidor
 */
router.get('/:areaLocal', localidadesController.buscarLocalidade);

module.exports = router;
