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
                    TOKEN: this.token,
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
     * Busca localidades com DIDS disponíveis
     * @returns {Promise<Array>} Lista de localidades
     */
    async buscarLocalidades() {
        return this.request('GET', '/buscar_localidades');
    }

    // ==================== DID (NÚMEROS) ====================

    /**
     * Busca DIDs a partir do código de área local. Limitado a 100 DIDs
     * @param {string} areaLocal - Nome da área local (ex: "Porto Alegre")
     * @returns {Promise<Array>} Lista de números disponíveis
     */
    async buscarNumerosByAreaLocal(areaLocal) {
        return this.request('GET', '/buscar_numeros_by_area_local', null, {
            AREA_LOCAL: areaLocal
        });
    }

    /**
     * Busca dados do DID
     * @param {string} numero - Número completo do DID
     * @returns {Promise<Object>} Dados do DID
     */
    async consultarDID(numero) {
        return this.request('GET', '/consultar_did', null, {
            NUMERO: numero
        });
    }

    /**
     * Contrata o DID informado e encaminha para o Sip Trunk indicado no campo SIP_TRUNK
     * @param {string} cn - CN do DID
     * @param {string} numero - Número do DID
     * @param {number} sipTrunk - ID do Sip Trunk (opcional, 0 = cria usuário SIP)
     * @param {number} idClienteBilling - ID do cliente billing (opcional)
     * @returns {Promise<Object>} Resultado da aquisição
     */
    async adquirirNovoDID(cn, numero, sipTrunk = 0, idClienteBilling = null) {
        const params = { CN: cn, NUMERO: numero };
        if (sipTrunk !== null) params.SIP_TRUNK = sipTrunk;
        if (idClienteBilling) params['ID CLIENTE BILLING'] = idClienteBilling;
        return this.request('POST', '/adquirir_novo_did', null, params);
    }

    /**
     * Cancela um DID existente
     * @param {string} cn - CN do DID
     * @param {string} numero - Número do DID a ser cancelado
     * @returns {Promise<Object>} Resultado do cancelamento
     */
    async cancelarDID(cn, numero) {
        return this.request('POST', '/cancelar_did', null, {
            CN: cn,
            NUMERO: numero
        });
    }

    /**
     * Configura webhook para capturar código do WhatsApp
     * @param {string} numero - Número (DID) que será configurado para uso com o WhatsApp
     * @param {string} urlRetorno - URL de webhook que receberá os dados da verificação via POST
     * @returns {Promise<Object>} Status da configuração
     */
    async configurarWhatsApp(numero, urlRetorno) {
        return this.request('POST', '/whatsapp_configurar', null, {
            numero,
            url_retorno: urlRetorno
        });
    }

    /**
     * Configurar um número para receber ligações do número contratado
     * @param {string} numero - Número DID da sua conta (ex: 1131119999, CN+Numero)
     * @param {string} numeroTransferir - Número para o qual as ligações serão transferidas (ex: 11999999191)
     * @returns {Promise<Object>} Status da configuração
     */
    async configurarSigaMe(numero, numeroTransferir) {
        return this.request('POST', '/configurar_siga_me', null, {
            NUMERO: numero,
            NUMERO_TRANSFERIR: numeroTransferir
        });
    }

    /**
     * Desconfigurar o encaminhamento de ligações de um número contratado
     * @param {string} numero - Número DID da sua conta (ex: 1131319999, CN+Numero)
     * @returns {Promise<Object>} Status da desconfiguração
     */
    async desconfigurarSigaMe(numero) {
        return this.request('POST', '/desconfigurar_siga_me', null, {
            NUMERO: numero
        });
    }

    /**
     * Busca Logs de Chamadas por Número
     * @param {string} numero - Número que deseja buscar o log (ex: 08000420203)
     * @param {string} periodo - Período do log no formato MMAAAA (ex: 052023)
     * @returns {Promise<Array>} Logs de chamadas
     */
    async getDIDsCDRs(numero, periodo) {
        return this.request('GET', '/get_dids_cdrs', null, {
            NUMERO: numero,
            PERIODO: periodo
        });
    }

    // ==================== SMS ====================

    /**
     * Envie uma mensagem para um lote de até 20.000 destinos por requisição
     * @param {string} numeros - Lista de números de destino separado por vírgula
     * @param {number} idLayout - ID do layout da mensagem enviada
     * @returns {Promise<Array>} Resultado do envio
     */
    async enviarSMS(numeros, idLayout) {
        return this.request('POST', '/enviar_sms', null, {
            NUMEROS: numeros,
            ID_LAYOUT: idLayout
        });
    }

    /**
     * Cadastra um novo layout de mensagem
     * @param {Object} body - Objeto contendo a mensagem do layout
     * @returns {Promise<Object>} ID e status do layout criado
     */
    async cadastrarLayoutSMS(body) {
        return this.request('POST', '/cadastrar_layout_sms', body);
    }

    /**
     * Consulta layouts aprovados
     * @param {number} idLayout - ID do layout a ser consultado (opcional)
     * @returns {Promise<Object>} Dados do layout
     */
    async consultarLayoutSMS(idLayout = null) {
        const params = idLayout ? { ID_LAYOUT: idLayout } : {};
        return this.request('GET', '/consultar_layout_sms', null, params);
    }

    // ==================== BILLING CLIENTES ====================

    /**
     * Cria um novo plano
     * @param {Object} planoData - Dados do plano
     * @returns {Promise<Object>} Resultado da criação
     */
    async criarPlano(planoData) {
        return this.request('POST', '/criar_plano', null, planoData);
    }

    /**
     * Cria um novo cliente no grupo de Billing
     * @param {Object} clienteData - Dados do cliente
     * @returns {Promise<Object>} Resultado da criação
     */
    async criarCliente(clienteData) {
        return this.request('POST', '/criar_cliente', null, clienteData);
    }

    /**
     * Vincule DIDs e um plano a um cliente
     * @param {number} idPlano - ID do Plano criado
     * @param {number} idCliente - ID do cliente criado
     * @param {string} listaDids - Listagem de dids (CN + Número) separados por vírgula
     * @returns {Promise<Object>} Resultado do vínculo
     */
    async montarClientePlanoDIDs(idPlano, idCliente, listaDids) {
        return this.request('POST', '/montar_cliente_plano_dids', null, {
            'ID PLANO': idPlano,
            'ID CLIENTE': idCliente,
            'LISTA DE DIDS': listaDids
        });
    }

    /**
     * Lista grupo de clientes
     * @returns {Promise<Array>} Lista de clientes
     */
    async listarClientes() {
        return this.request('GET', '/listar_clientes');
    }

    /**
     * Lista Planos Billing
     * @returns {Promise<Array>} Lista de planos
     */
    async listarPlanos() {
        return this.request('GET', '/listar_planos');
    }
}

module.exports = new BRDIDService();
