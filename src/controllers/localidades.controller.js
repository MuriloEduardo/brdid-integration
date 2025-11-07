const brdidService = require('../services/brdid.service');

/**
 * Controller para gerenciar localidades/DDDs
 */
class LocalidadesController {
  /**
   * Lista todas as localidades disponíveis
   */
  async listarLocalidades(req, res) {
    try {
      const result = await brdidService.getLocalidades();
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.error || 'Erro ao buscar localidades',
      });
    }
  }

  /**
   * Busca informações de uma localidade específica
   */
  async buscarLocalidade(req, res) {
    try {
      const { ddd } = req.params;
      const result = await brdidService.getLocalidade(ddd);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.error || 'Erro ao buscar localidade',
      });
    }
  }
}

module.exports = new LocalidadesController();
