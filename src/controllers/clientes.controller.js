const brdidService = require('../services/brdid.service');

/**
 * Controller para gerenciar Clientes (subcontas)
 */
class ClientesController {
  /**
   * Lista clientes
   */
  async listarClientes(req, res) {
    try {
      const result = await brdidService.getClientes(req.query);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.error || 'Erro ao buscar clientes',
      });
    }
  }

  /**
   * Cria novo cliente
   */
  async criarCliente(req, res) {
    try {
      const { nome, email } = req.body;

      if (!nome || !email) {
        return res.status(400).json({
          success: false,
          error: 'Nome e email são obrigatórios',
        });
      }

      const result = await brdidService.criarCliente(req.body);
      res.status(201).json({
        success: true,
        data: result,
        message: 'Cliente criado com sucesso',
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.error || 'Erro ao criar cliente',
      });
    }
  }

  /**
   * Obtém informações de um cliente
   */
  async getCliente(req, res) {
    try {
      const { clienteId } = req.params;
      const result = await brdidService.getCliente(clienteId);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.error || 'Erro ao buscar cliente',
      });
    }
  }

  /**
   * Atualiza informações de um cliente
   */
  async atualizarCliente(req, res) {
    try {
      const { clienteId } = req.params;
      const result = await brdidService.atualizarCliente(clienteId, req.body);
      res.json({
        success: true,
        data: result,
        message: 'Cliente atualizado com sucesso',
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.error || 'Erro ao atualizar cliente',
      });
    }
  }

  /**
   * Remove um cliente
   */
  async removerCliente(req, res) {
    try {
      const { clienteId } = req.params;
      const result = await brdidService.removerCliente(clienteId);
      res.json({
        success: true,
        data: result,
        message: 'Cliente removido com sucesso',
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.error || 'Erro ao remover cliente',
      });
    }
  }
}

module.exports = new ClientesController();
