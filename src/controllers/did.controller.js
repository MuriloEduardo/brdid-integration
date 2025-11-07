const brdidService = require('../services/brdid.service');

/**
 * Controller para gerenciar números DID
 */
class DIDController {
    /**
     * Busca DIDs a partir do código de área local. Limitado a 100 DIDs
     */
    async buscarNumerosByAreaLocal(req, res) {
        try {
            const { areaLocal } = req.query;
            if (!areaLocal) {
                return res.status(400).json({
                    success: false,
                    error: 'areaLocal é obrigatório'
                });
            }
            const result = await brdidService.buscarNumerosByAreaLocal(areaLocal);
            res.json({ success: true, data: result });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.error || 'Erro ao buscar números'
            });
        }
    }

    /**
     * Busca dados do DID
     */
    async consultarDID(req, res) {
        try {
            const { numero } = req.params;
            const result = await brdidService.consultarDID(numero);
            res.json({ success: true, data: result });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.error || 'Erro ao consultar DID'
            });
        }
    }

    /**
     * Contrata o DID informado e encaminha para o Sip Trunk indicado
     */
    async adquirirNovoDID(req, res) {
        try {
            const { cn, numero, sipTrunk, idClienteBilling } = req.body;
            if (!cn || !numero) {
                return res.status(400).json({
                    success: false,
                    error: 'CN e NUMERO são obrigatórios'
                });
            }
            const result = await brdidService.adquirirNovoDID(cn, numero, sipTrunk, idClienteBilling);
            res.status(201).json({ 
                success: true, 
                data: result,
                message: 'DID adquirido com sucesso'
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.error || 'Erro ao adquirir DID'
            });
        }
    }

    /**
     * Cancela um DID existente
     */
    async cancelarDID(req, res) {
        try {
            const { cn, numero } = req.body;
            if (!cn || !numero) {
                return res.status(400).json({
                    success: false,
                    error: 'CN e NUMERO são obrigatórios'
                });
            }
            const result = await brdidService.cancelarDID(cn, numero);
            res.json({ 
                success: true, 
                data: result,
                message: 'DID cancelado com sucesso'
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.error || 'Erro ao cancelar DID'
            });
        }
    }

    /**
     * Configurar um número para receber ligações do número contratado
     */
    async configurarSigaMe(req, res) {
        try {
            const { numero, numeroTransferir } = req.body;
            if (!numero || !numeroTransferir) {
                return res.status(400).json({
                    success: false,
                    error: 'NUMERO e NUMERO_TRANSFERIR são obrigatórios'
                });
            }
            const result = await brdidService.configurarSigaMe(numero, numeroTransferir);
            res.json({ 
                success: true, 
                data: result,
                message: 'Siga-me configurado com sucesso'
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.error || 'Erro ao configurar siga-me'
            });
        }
    }

    /**
     * Desconfigurar o encaminhamento de ligações
     */
    async desconfigurarSigaMe(req, res) {
        try {
            const { numero } = req.body;
            if (!numero) {
                return res.status(400).json({
                    success: false,
                    error: 'NUMERO é obrigatório'
                });
            }
            const result = await brdidService.desconfigurarSigaMe(numero);
            res.json({ 
                success: true, 
                data: result,
                message: 'Siga-me desconfigurado com sucesso'
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.error || 'Erro ao desconfigurar siga-me'
            });
        }
    }

    /**
     * Busca Logs de Chamadas por Número
     */
    async getDIDsCDRs(req, res) {
        try {
            const { numero, periodo } = req.query;
            if (!numero || !periodo) {
                return res.status(400).json({
                    success: false,
                    error: 'NUMERO e PERIODO são obrigatórios'
                });
            }
            const result = await brdidService.getDIDsCDRs(numero, periodo);
            res.json({ success: true, data: result });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.error || 'Erro ao buscar CDRs'
            });
        }
    }
}

module.exports = new DIDController();
