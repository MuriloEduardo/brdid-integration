const express = require('express');
const router = express.Router();
const didController = require('../controllers/did.controller');

/**
 * @swagger
 * tags:
 *   name: DID
 *   description: Gerenciamento de números DID
 */

/**
 * @swagger
 * /api/did/numeros:
 *   get:
 *     summary: Busca DIDs por área local (limitado a 100)
 *     tags: [DID]
 *     parameters:
 *       - name: areaLocal
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         example: "Porto Alegre"
 *     responses:
 *       200:
 *         description: Lista de números disponíveis
 */
router.get('/numeros', didController.buscarNumerosByAreaLocal);

/**
 * @swagger
 * /api/did/{numero}:
 *   get:
 *     summary: Busca dados do DID
 *     tags: [DID]
 *     parameters:
 *       - name: numero
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do DID
 */
router.get('/:numero', didController.consultarDID);

/**
 * @swagger
 * /api/did:
 *   post:
 *     summary: Adquire novo DID
 *     tags: [DID]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cn, numero]
 *             properties:
 *               cn:
 *                 type: string
 *               numero:
 *                 type: string
 *               sipTrunk:
 *                 type: number
 *               idClienteBilling:
 *                 type: number
 *     responses:
 *       201:
 *         description: DID adquirido com sucesso
 *   delete:
 *     summary: Cancela um DID
 *     tags: [DID]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cn, numero]
 *             properties:
 *               cn:
 *                 type: string
 *               numero:
 *                 type: string
 *     responses:
 *       200:
 *         description: DID cancelado com sucesso
 */
router.post('/', didController.adquirirNovoDID);
router.delete('/', didController.cancelarDID);

/**
 * @swagger
 * /api/did/siga-me:
 *   post:
 *     summary: Configurar encaminhamento de ligações
 *     tags: [DID]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [numero, numeroTransferir]
 *             properties:
 *               numero:
 *                 type: string
 *               numeroTransferir:
 *                 type: string
 *     responses:
 *       200:
 *         description: Siga-me configurado
 *   delete:
 *     summary: Desconfigurar encaminhamento
 *     tags: [DID]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [numero]
 *             properties:
 *               numero:
 *                 type: string
 *     responses:
 *       200:
 *         description: Siga-me desconfigurado
 */
router.post('/siga-me', didController.configurarSigaMe);
router.delete('/siga-me', didController.desconfigurarSigaMe);

/**
 * @swagger
 * /api/did/cdrs:
 *   get:
 *     summary: Busca logs de chamadas
 *     tags: [DID]
 *     parameters:
 *       - name: numero
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         example: "08000420203"
 *       - name: periodo
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         example: "052023"
 *     responses:
 *       200:
 *         description: Logs de chamadas
 */
router.get('/cdrs', didController.getDIDsCDRs);

module.exports = router;
