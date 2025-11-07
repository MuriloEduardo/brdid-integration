const brdidService = require('../services/brdid.service');

/**
 * Controller para gerenciar SMS
 */
class SMSController {
    /**
     * Envie uma mensagem para um lote de até 20.000 destinos por requisição
     */
    async enviarSMS(req, res) {
        try {
            const { numeros, idLayout } = req.body;
            if (!numeros || !idLayout) {
                return res.status(400).json({
                    success: false,
                    error: 'NUMEROS e ID_LAYOUT são obrigatórios'
                });
            }
            const result = await brdidService.enviarSMS(numeros, idLayout);
            res.status(201).json({ 
                success: true, 
                data: result,
                message: 'SMS enviado com sucesso'
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.error || 'Erro ao enviar SMS'
            });
        }
    }

    /**
     * Cadastra um novo layout de mensagem
     */
    async cadastrarLayoutSMS(req, res) {
        try {
            const result = await brdidService.cadastrarLayoutSMS(req.body);
            res.status(201).json({ 
                success: true, 
                data: result,
                message: 'Layout cadastrado com sucesso'
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.error || 'Erro ao cadastrar layout'
            });
        }
    }

    /**
     * Consulta layouts aprovados
     */
    async consultarLayoutSMS(req, res) {
        try {
            const { idLayout } = req.query;
            const result = await brdidService.consultarLayoutSMS(idLayout);
            res.json({ success: true, data: result });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.error || 'Erro ao consultar layout'
            });
        }
    }
}

module.exports = new SMSController();
