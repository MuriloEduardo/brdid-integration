const brdidService = require('../services/brdid.service');

/**
 * Controller para gerenciar WhatsApp
 */
class WhatsAppController {
  /**
   * Lista números WhatsApp
   */
  async listarNumeros(req, res) {
    try {
      const result = await brdidService.getWhatsAppNumeros(req.query);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.error || 'Erro ao buscar números WhatsApp',
      });
    }
  }

  /**
   * Busca informações de um número WhatsApp específico
   */
  async buscarNumero(req, res) {
    try {
      const { numero } = req.params;
      const result = await brdidService.getWhatsAppNumero(numero);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.error || 'Erro ao buscar número WhatsApp',
      });
    }
  }

  /**
   * Ativa WhatsApp em um número
   */
  async ativarWhatsApp(req, res) {
    try {
      const { numero, ...configuracoes } = req.body;

      if (!numero) {
        return res.status(400).json({
          success: false,
          error: 'Número é obrigatório',
        });
      }

      const result = await brdidService.ativarWhatsApp(numero, configuracoes);
      res.status(201).json({
        success: true,
        data: result,
        message: 'WhatsApp ativado com sucesso',
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.error || 'Erro ao ativar WhatsApp',
      });
    }
  }

  /**
   * Configura número WhatsApp
   */
  async configurarWhatsApp(req, res) {
    try {
      const { numero } = req.params;
      const configuracoes = req.body;

      const result = await brdidService.configurarWhatsApp(numero, configuracoes);
      res.json({
        success: true,
        data: result,
        message: 'WhatsApp configurado com sucesso',
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.error || 'Erro ao configurar WhatsApp',
      });
    }
  }

  /**
   * Desativa WhatsApp de um número
   */
  async desativarWhatsApp(req, res) {
    try {
      const { numero } = req.params;
      const result = await brdidService.desativarWhatsApp(numero);
      res.json({
        success: true,
        data: result,
        message: 'WhatsApp desativado com sucesso',
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.error || 'Erro ao desativar WhatsApp',
      });
    }
  }
}

module.exports = new WhatsAppController();
