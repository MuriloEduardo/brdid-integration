const axios = require('axios');
const config = require('../src/config');

/**
 * Testes de integração com a API BRDID
 * Execute: node tests/integration.test.js
 */

class BRDIDIntegrationTests {
  constructor() {
    this.baseURL = config.brdid.apiUrl;
    this.token = config.brdid.token;
    this.results = [];
  }

  /**
   * Formata o resultado do teste
   */
  logResult(testName, success, data = null, error = null) {
    const result = {
      test: testName,
      success,
      timestamp: new Date().toISOString(),
      data,
      error,
    };
    
    this.results.push(result);
    
    const icon = success ? '✅' : '❌';
    console.log(`${icon} ${testName}`);
    
    if (success && data) {
      console.log('   Resposta:', JSON.stringify(data, null, 2).substring(0, 200) + '...');
    }
    
    if (!success && error) {
      console.log('   Erro:', error);
    }
    
    console.log('');
  }

  /**
   * Teste 1: Listar áreas locais disponíveis
   */
  async testListarAreasLocais() {
    try {
      const response = await axios.get(`${this.baseURL}/listar_areas_locais`, {
        params: { TOKEN: this.token },
      });
      
      this.logResult(
        'Listar Áreas Locais',
        response.status === 200,
        response.data
      );
      
      return response.data;
    } catch (error) {
      this.logResult(
        'Listar Áreas Locais',
        false,
        null,
        error.response?.data || error.message
      );
      return null;
    }
  }

  /**
   * Teste 2: Buscar números por área local (Porto Alegre)
   */
  async testBuscarNumerosPorAreaLocal() {
    try {
      const response = await axios.get(`${this.baseURL}/buscar_numeros_by_area_local`, {
        params: { 
          TOKEN: this.token,
          AREA_LOCAL: 'Porto Alegre'
        },
      });
      
      this.logResult(
        'Buscar Números por Área Local (Porto Alegre)',
        response.status === 200,
        response.data
      );
      
      return response.data;
    } catch (error) {
      this.logResult(
        'Buscar Números por Área Local (Porto Alegre)',
        false,
        null,
        error.response?.data || error.message
      );
      return null;
    }
  }

  /**
   * Teste 3: Buscar números por DDD
   */
  async testBuscarNumerosPorDDD(ddd = '51') {
    try {
      const response = await axios.get(`${this.baseURL}/buscar_numeros_by_ddd`, {
        params: { 
          TOKEN: this.token,
          DDD: ddd
        },
      });
      
      this.logResult(
        `Buscar Números por DDD (${ddd})`,
        response.status === 200,
        response.data
      );
      
      return response.data;
    } catch (error) {
      this.logResult(
        `Buscar Números por DDD (${ddd})`,
        false,
        null,
        error.response?.data || error.message
      );
      return null;
    }
  }

  /**
   * Teste 4: Listar meus números (números já comprados)
   */
  async testListarMeusNumeros() {
    try {
      const response = await axios.get(`${this.baseURL}/listar_meus_numeros`, {
        params: { TOKEN: this.token },
      });
      
      this.logResult(
        'Listar Meus Números',
        response.status === 200,
        response.data
      );
      
      return response.data;
    } catch (error) {
      this.logResult(
        'Listar Meus Números',
        false,
        null,
        error.response?.data || error.message
      );
      return null;
    }
  }

  /**
   * Teste 5: Verificar saldo da conta
   */
  async testVerificarSaldo() {
    try {
      const response = await axios.get(`${this.baseURL}/verificar_saldo`, {
        params: { TOKEN: this.token },
      });
      
      this.logResult(
        'Verificar Saldo',
        response.status === 200,
        response.data
      );
      
      return response.data;
    } catch (error) {
      this.logResult(
        'Verificar Saldo',
        false,
        null,
        error.response?.data || error.message
      );
      return null;
    }
  }

  /**
   * Executa todos os testes
   */
  async runAllTests() {
    console.log('='.repeat(70));
    console.log('🧪 TESTES DE INTEGRAÇÃO - BRDID API');
    console.log('='.repeat(70));
    console.log(`📡 Base URL: ${this.baseURL}`);
    console.log(`🔑 Token: ${this.token ? this.token.substring(0, 20) + '...' : 'NÃO CONFIGURADO'}`);
    console.log('='.repeat(70));
    console.log('');

    if (!this.token) {
      console.log('❌ ERRO: Token não configurado no arquivo .env');
      console.log('Configure o BRDID_TOKEN no arquivo .env e tente novamente.');
      return;
    }

    // Executa os testes em sequência
    await this.testListarAreasLocais();
    await this.testBuscarNumerosPorAreaLocal();
    await this.testBuscarNumerosPorDDD('51'); // Porto Alegre
    await this.testBuscarNumerosPorDDD('11'); // São Paulo
    await this.testListarMeusNumeros();
    await this.testVerificarSaldo();

    // Resumo dos resultados
    console.log('='.repeat(70));
    console.log('📊 RESUMO DOS TESTES');
    console.log('='.repeat(70));
    
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;
    
    console.log(`Total de testes: ${totalTests}`);
    console.log(`✅ Passou: ${passedTests}`);
    console.log(`❌ Falhou: ${failedTests}`);
    console.log(`📈 Taxa de sucesso: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    console.log('='.repeat(70));

    if (failedTests > 0) {
      console.log('\n⚠️  Testes falharam. Verifique:');
      console.log('   1. Se o TOKEN está correto no arquivo .env');
      console.log('   2. Se a URL da API está correta');
      console.log('   3. Se você tem permissões adequadas na conta BRDID');
    } else {
      console.log('\n✨ Todos os testes passaram! A API está operacional.');
    }
  }
}

// Executa os testes
const tests = new BRDIDIntegrationTests();
tests.runAllTests().catch(console.error);
