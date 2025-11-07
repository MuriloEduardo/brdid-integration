const axios = require('axios');
const config = require('../config');

class BRDIDService {
    constructor() {
        this.apiUrl = config.brdid.apiUrl;
        this.token = config.brdid.token;

        this.client = axios.create({
            baseURL: this.apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        // Interceptor para adicionar TOKEN como query param
        this.client.interceptors.request.use((config) => {
            if (!config.params) {
                config.params = {};
            }
            config.params.TOKEN = this.token;
            return config;
        });
    }

    /**
     * Método auxiliar para fazer requisições
     */
    async request(method, endpoint, data = null, params = null) {
        try {
            const response = await this.client({
                method,
                url: endpoint,
                data,
                params: {
                    ...params,
                    TOKEN: this.token, // Garante que TOKEN está sempre presente
                },
            });
            return response.data;
        } catch (error) {
            console.error(`BRDID API Error [${method} ${endpoint}]:`, error.response?.data || error.message);
            throw {
                success: false,
                error: error.response?.data?.message || error.message,
                statusCode: error.response?.status || 500,
            };
        }
    }

    // ==================== LOCALIDADES ====================

    /**
     * Lista todas as localidades/DDDs disponíveis
     */
    async getLocalidades() {
        return this.request('GET', '/listar_areas_locais');
    }

    /**
     * Busca informações de uma localidade específica por nome
     */
    async getLocalidade(areaLocal) {
        return this.request('GET', '/buscar_numeros_by_area_local', null, {
            AREA_LOCAL: areaLocal
        });
    }

    // ==================== DID (NÚMEROS) ====================

    /**
     * Lista números DID disponíveis para compra por área local
     */
    async getNumerosDisponiveis(areaLocal, quantity = 10) {
        return this.request('GET', '/buscar_numeros_by_area_local', null, {
            AREA_LOCAL: areaLocal,
            LIMIT: quantity
        });
    }

    /**
     * Busca números disponíveis por DDD
     */
    async getNumerosByDDD(ddd, quantity = 10) {
        return this.request('GET', '/buscar_numeros_by_ddd', null, {
            DDD: ddd,
            LIMIT: quantity
        });
    }

    /**
     * Lista todos os números DID da conta
     */
    async getMeusNumeros(params = {}) {
        // Nota: Endpoint pode não existir na API pública
        // Verificar documentação completa da BRDID
        try {
            return this.request('GET', '/listar_meus_numeros', null, params);
        } catch (error) {
            // Se o endpoint não existir, retorna array vazio
            if (error.statusCode === 404) {
                return [];
            }
            throw error;
        }
    }

    /**
     * Busca informações de um número específico
     */
    async getNumero(numero) {
        // Nota: Endpoint pode não existir na API pública
        try {
            return this.request('GET', `/consultar_numero`, null, { NUMERO: numero });
        } catch (error) {
            if (error.statusCode === 404) {
                throw {
                    success: false,
                    error: 'Número não encontrado ou endpoint não disponível',
                    statusCode: 404,
                };
            }
            throw error;
        }
    }

    /**
     * Compra um número DID
     */
    async comprarNumero(numero, configuracoes = {}) {
        // Nota: Endpoint de compra requer autenticação específica
        return this.request('POST', '/comprar_numero', {
            NUMERO: numero,
            ...configuracoes,
        });
    }

    /**
     * Configura um número DID existente
     */
    async configurarNumero(numero, configuracoes) {
        return this.request('PUT', `/configurar_numero`, {
            NUMERO: numero,
            ...configuracoes,
        });
    }

    /**
     * Cancela/Remove um número DID
     */
    async cancelarNumero(numero) {
        return this.request('DELETE', `/cancelar_numero`, null, { NUMERO: numero });
    }

    // ==================== WHATSAPP ====================

    /**
     * Lista números WhatsApp
     */
    async getWhatsAppNumeros(params = {}) {
        return this.request('GET', '/whatsapp/numeros', null, params);
    }

    /**
     * Busca informações de um número WhatsApp específico
     */
    async getWhatsAppNumero(numero) {
        return this.request('GET', `/whatsapp/${numero}`);
    }

    /**
     * Ativa WhatsApp em um número
     */
    async ativarWhatsApp(numero, configuracoes = {}) {
        return this.request('POST', '/whatsapp/ativar', {
            numero,
            ...configuracoes,
        });
    }

    /**
     * Configura número WhatsApp
     */
    async configurarWhatsApp(numero, configuracoes) {
        return this.request('PUT', `/whatsapp/${numero}/configurar`, configuracoes);
    }

    /**
     * Desativa WhatsApp de um número
     */
    async desativarWhatsApp(numero) {
        return this.request('DELETE', `/whatsapp/${numero}`);
    }

    // ==================== SMS ====================

    /**
     * Envia um SMS
     */
    async enviarSMS(data) {
        return this.request('POST', '/sms/enviar', data);
    }

    /**
     * Lista SMS enviados
     */
    async getSMSEnviados(params = {}) {
        return this.request('GET', '/sms/enviados', null, params);
    }

    /**
     * Lista SMS recebidos
     */
    async getSMSRecebidos(params = {}) {
        return this.request('GET', '/sms/recebidos', null, params);
    }

    /**
     * Busca status de um SMS
     */
    async getStatusSMS(smsId) {
        return this.request('GET', `/sms/${smsId}/status`);
    }

    // ==================== BILLING ====================

    /**
     * Obtém saldo da conta
     */
    async getSaldo() {
        try {
            return this.request('GET', '/verificar_saldo');
        } catch (error) {
            if (error.statusCode === 404) {
                return { saldo: 0, message: 'Endpoint não disponível na API pública' };
            }
            throw error;
        }
    }

    /**
     * Lista transações/extrato
     */
    async getExtrato(params = {}) {
        try {
            return this.request('GET', '/extrato', null, params);
        } catch (error) {
            if (error.statusCode === 404) {
                return [];
            }
            throw error;
        }
    }

    /**
     * Lista faturas
     */
    async getFaturas(params = {}) {
        try {
            return this.request('GET', '/faturas', null, params);
        } catch (error) {
            if (error.statusCode === 404) {
                return [];
            }
            throw error;
        }
    }

    /**
     * Obtém detalhes de uma fatura específica
     */
    async getFatura(faturaId) {
        try {
            return this.request('GET', `/faturas/${faturaId}`);
        } catch (error) {
            if (error.statusCode === 404) {
                throw {
                    success: false,
                    error: 'Fatura não encontrada ou endpoint não disponível',
                    statusCode: 404,
                };
            }
            throw error;
        }
    }

    // ==================== CLIENTES ====================

    /**
     * Lista clientes (subcontas)
     */
    async getClientes(params = {}) {
        return this.request('GET', '/clientes', null, params);
    }

    /**
     * Cria novo cliente
     */
    async criarCliente(data) {
        return this.request('POST', '/clientes', data);
    }

    /**
     * Obtém informações de um cliente
     */
    async getCliente(clienteId) {
        return this.request('GET', `/clientes/${clienteId}`);
    }

    /**
     * Atualiza informações de um cliente
     */
    async atualizarCliente(clienteId, data) {
        return this.request('PUT', `/clientes/${clienteId}`, data);
    }

    /**
     * Remove um cliente
     */
    async removerCliente(clienteId) {
        return this.request('DELETE', `/clientes/${clienteId}`);
    }
}

module.exports = new BRDIDService();
