const brdidService = require('../services/brdid.service');

/**
 * Controller para gerenciar Billing e Clientes
 */
class BillingController {
    /**
     * Cria um novo plano
     */
    async criarPlano(req, res) {
        try {
            const result = await brdidService.criarPlano(req.body);
            res.status(201).json({ 
                success: true, 
                data: result,
                message: 'Plano criado com sucesso'
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.error || 'Erro ao criar plano'
            });
        }
    }

    /**
     * Lista Planos Billing
     */
    async listarPlanos(req, res) {
        try {
            const result = await brdidService.listarPlanos();
            res.json({ success: true, data: result });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.error || 'Erro ao listar planos'
            });
        }
    }

    /**
     * Cria um novo cliente no grupo de Billing
     */
    async criarCliente(req, res) {
        try {
            const result = await brdidService.criarCliente(req.body);
            res.status(201).json({ 
                success: true, 
                data: result,
                message: 'Cliente criado com sucesso'
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.error || 'Erro ao criar cliente'
            });
        }
    }

    /**
     * Lista grupo de clientes
     */
    async listarClientes(req, res) {
        try {
            const result = await brdidService.listarClientes();
            res.json({ success: true, data: result });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.error || 'Erro ao listar clientes'
            });
        }
    }

    /**
     * Vincule DIDs e um plano a um cliente
     */
    async montarClientePlanoDIDs(req, res) {
        try {
            const { idPlano, idCliente, listaDids } = req.body;
            if (!idPlano || !idCliente || !listaDids) {
                return res.status(400).json({
                    success: false,
                    error: 'ID_PLANO, ID_CLIENTE e LISTA_DE_DIDS são obrigatórios'
                });
            }
            const result = await brdidService.montarClientePlanoDIDs(idPlano, idCliente, listaDids);
            res.json({ 
                success: true, 
                data: result,
                message: 'Cliente, plano e DIDs vinculados com sucesso'
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.error || 'Erro ao vincular cliente, plano e DIDs'
            });
        }
    }
}

module.exports = new BillingController();
