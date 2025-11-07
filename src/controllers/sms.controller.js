const brdidService = require('../services/brdid.service');

/**
 * Controller para gerenciar SMS
 */
class SMSController {
    /**
     * Envia um SMS
     */
    async enviarSMS(req, res) {
        try {
            const { origem, destino, mensagem } = req.body;

            if (!origem || !destino || !mensagem) {
                return res.status(400).json({
                    success: false,
                    error: 'Origem, destino e mensagem são obrigatórios',
                });
            }

            const result = await brdidService.enviarSMS(req.body);
            res.status(201).json({
                success: true,
                data: result,
                message: 'SMS enviado com sucesso',
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.error || 'Erro ao enviar SMS',
            });
        }
    }

    /**
     * Lista SMS enviados
     */
    async listarSMSEnviados(req, res) {
        try {
            const result = await brdidService.getSMSEnviados(req.query);
            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.error || 'Erro ao buscar SMS enviados',
            });
        }
    }

    /**
     * Lista SMS recebidos
     */
    async listarSMSRecebidos(req, res) {
        try {
            const result = await brdidService.getSMSRecebidos(req.query);
            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.error || 'Erro ao buscar SMS recebidos',
            });
        }
    }

    /**
     * Busca status de um SMS
     */
    async buscarStatusSMS(req, res) {
        try {
            const { smsId } = req.params;
            const result = await brdidService.getStatusSMS(smsId);
            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.error || 'Erro ao buscar status do SMS',
            });
        }
    }
}

module.exports = new SMSController();
