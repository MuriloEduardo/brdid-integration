const axios = require('axios');
const config = require('../config');

class BRDIDService {
  constructor() {
    this.apiUrl = config.brdid.apiUrl;
    this.apiKey = config.brdid.apiKey;
    this.apiSecret = config.brdid.apiSecret;
    
    this.client = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar autenticação
    this.client.interceptors.request.use((config) => {
      config.headers['Authorization'] = `Bearer ${this.apiKey}`;
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
        params,
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
    return this.request('GET', '/localidades');
  }

  /**
   * Busca informações de uma localidade específica
   */
  async getLocalidade(ddd) {
    return this.request('GET', `/localidades/${ddd}`);
  }

  // ==================== DID (NÚMEROS) ====================
  
  /**
   * Lista números DID disponíveis para compra
   */
  async getNumerosDisponiveis(ddd, quantity = 10) {
    return this.request('GET', '/did/disponiveis', null, { ddd, quantity });
  }

  /**
   * Lista todos os números DID da conta
   */
  async getMeusNumeros(params = {}) {
    return this.request('GET', '/did/meus-numeros', null, params);
  }

  /**
   * Busca informações de um número específico
   */
  async getNumero(numero) {
    return this.request('GET', `/did/${numero}`);
  }

  /**
   * Compra um número DID
   */
  async comprarNumero(numero, configuracoes = {}) {
    return this.request('POST', '/did/comprar', {
      numero,
      ...configuracoes,
    });
  }

  /**
   * Configura um número DID existente
   */
  async configurarNumero(numero, configuracoes) {
    return this.request('PUT', `/did/${numero}/configurar`, configuracoes);
  }

  /**
   * Cancela/Remove um número DID
   */
  async cancelarNumero(numero) {
    return this.request('DELETE', `/did/${numero}`);
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
    return this.request('GET', '/billing/saldo');
  }

  /**
   * Lista transações/extrato
   */
  async getExtrato(params = {}) {
    return this.request('GET', '/billing/extrato', null, params);
  }

  /**
   * Lista faturas
   */
  async getFaturas(params = {}) {
    return this.request('GET', '/billing/faturas', null, params);
  }

  /**
   * Obtém detalhes de uma fatura específica
   */
  async getFatura(faturaId) {
    return this.request('GET', `/billing/faturas/${faturaId}`);
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
