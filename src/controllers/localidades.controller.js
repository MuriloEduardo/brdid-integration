const brdidService = require('../services/brdid.service');

/**
 * Controller para gerenciar localidades/DDDs
 */
class LocalidadesController {
    /**
     * Busca localidades com DIDS disponíveis
     */
    async buscarLocalidades(req, res) {
        try {
            const result = await brdidService.buscarLocalidades();
            res.json({ success: true, data: result });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.error || 'Erro ao buscar localidades'
            });
        }
    }
}

module.exports = new LocalidadesController();
