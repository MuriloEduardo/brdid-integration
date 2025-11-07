const brdidService = require('../services/brdid.service');

/**
 * Controller para gerenciar números DID
 */
class DIDController {
    /**
     * Lista números DID disponíveis para compra
     */
    async listarNumerosDisponiveis(req, res) {
        try {
            const { ddd, areaLocal, quantity } = req.query;

            if (!ddd && !areaLocal) {
                return res.status(400).json({
                    success: false,
                    error: 'DDD ou areaLocal é obrigatório',
                });
            }

            let result;
            if (areaLocal) {
                result = await brdidService.getNumerosDisponiveis(areaLocal, quantity);
            } else {
                result = await brdidService.getNumerosByDDD(ddd, quantity);
            }

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.error || 'Erro ao buscar números disponíveis',
            });
        }
    }

    /**
     * Lista todos os números DID da conta
     */
    async listarMeusNumeros(req, res) {
        try {
            const result = await brdidService.getMeusNumeros(req.query);
            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.error || 'Erro ao buscar seus números',
            });
        }
    }

    /**
     * Busca informações de um número específico
     */
    async buscarNumero(req, res) {
        try {
            const { numero } = req.params;
            const result = await brdidService.getNumero(numero);
            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.error || 'Erro ao buscar número',
            });
        }
    }

    /**
     * Compra um número DID
     */
    async comprarNumero(req, res) {
        try {
            const { numero, ...configuracoes } = req.body;

            if (!numero) {
                return res.status(400).json({
                    success: false,
                    error: 'Número é obrigatório',
                });
            }

            const result = await brdidService.comprarNumero(numero, configuracoes);
            res.status(201).json({
                success: true,
                data: result,
                message: 'Número comprado com sucesso',
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.error || 'Erro ao comprar número',
            });
        }
    }

    /**
     * Configura um número DID existente
     */
    async configurarNumero(req, res) {
        try {
            const { numero } = req.params;
            const configuracoes = req.body;

            const result = await brdidService.configurarNumero(numero, configuracoes);
            res.json({
                success: true,
                data: result,
                message: 'Número configurado com sucesso',
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.error || 'Erro ao configurar número',
            });
        }
    }

    /**
     * Cancela/Remove um número DID
     */
    async cancelarNumero(req, res) {
        try {
            const { numero } = req.params;
            const result = await brdidService.cancelarNumero(numero);
            res.json({
                success: true,
                data: result,
                message: 'Número cancelado com sucesso',
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.error || 'Erro ao cancelar número',
            });
        }
    }
}

module.exports = new DIDController();
