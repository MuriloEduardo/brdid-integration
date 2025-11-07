const brdidService = require('../services/brdid.service');

/**
 * Controller para gerenciar WhatsApp
 */
class WhatsAppController {
    /**
     * Configura webhook para capturar código do WhatsApp
     */
    async configurarWhatsApp(req, res) {
        try {
            const { numero, urlRetorno } = req.body;
            if (!numero || !urlRetorno) {
                return res.status(400).json({
                    success: false,
                    error: 'numero e url_retorno são obrigatórios'
                });
            }
            const result = await brdidService.configurarWhatsApp(numero, urlRetorno);
            res.json({ 
                success: true, 
                data: result,
                message: 'WhatsApp configurado com sucesso'
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.error || 'Erro ao configurar WhatsApp'
            });
        }
    }
}

module.exports = new WhatsAppController();
