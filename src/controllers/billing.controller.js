const brdidService = require('../services/brdid.service');

/**
 * Controller para gerenciar Billing e Clientes
 */
class BillingController {
  /**
   * Obtém saldo da conta
   */
  async getSaldo(req, res) {
    try {
      const result = await brdidService.getSaldo();
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.error || 'Erro ao buscar saldo',
      });
    }
  }

  /**
   * Lista transações/extrato
   */
  async getExtrato(req, res) {
    try {
      const result = await brdidService.getExtrato(req.query);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.error || 'Erro ao buscar extrato',
      });
    }
  }

  /**
   * Lista faturas
   */
  async getFaturas(req, res) {
    try {
      const result = await brdidService.getFaturas(req.query);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.error || 'Erro ao buscar faturas',
      });
    }
  }

  /**
   * Obtém detalhes de uma fatura específica
   */
  async getFatura(req, res) {
    try {
      const { faturaId } = req.params;
      const result = await brdidService.getFatura(faturaId);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.error || 'Erro ao buscar fatura',
      });
    }
  }
}

module.exports = new BillingController();
