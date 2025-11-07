const axios = require('axios');

const API_URL = 'http://localhost:3000';

async function testProxyAPI() {
  console.log('='.repeat(70));
  console.log('🧪 TESTANDO API PROXY - AtendimentoBR BRDID');
  console.log('='.repeat(70));
  console.log('');

  try {
    // Teste 1: Root endpoint
    console.log('✅ Teste 1: Root endpoint');
    const root = await axios.get(API_URL);
    console.log('   Resposta:', root.data);
    console.log('');

    // Teste 2: Buscar localidade
    console.log('✅ Teste 2: Buscar localidade (Porto Alegre)');
    const localidade = await axios.get(`${API_URL}/api/localidades/Porto%20Alegre`);
    console.log('   Números encontrados:', localidade.data.data?.length || 0);
    if (localidade.data.data?.[0]) {
      console.log('   Primeiro número:', localidade.data.data[0]);
    }
    console.log('');

    // Teste 3: Números disponíveis por área local
    console.log('✅ Teste 3: Números disponíveis (Porto Alegre - via areaLocal)');
    const numerosArea = await axios.get(`${API_URL}/api/did/disponiveis`, {
      params: { areaLocal: 'Porto Alegre', quantity: 3 }
    });
    console.log('   Números encontrados:', numerosArea.data.data?.length || 0);
    if (numerosArea.data.data?.[0]) {
      console.log('   Primeiro número:', numerosArea.data.data[0]);
    }
    console.log('');

    // Teste 4: Números disponíveis por DDD (pode falhar se endpoint não existir)
    console.log('⚠️  Teste 4: Números disponíveis (DDD 51 - pode não funcionar)');
    try {
      const numerosDDD = await axios.get(`${API_URL}/api/did/disponiveis`, {
        params: { ddd: '51', quantity: 3 }
      });
      console.log('   Números encontrados:', numerosDDD.data.data?.length || 0);
    } catch (error) {
      console.log('   ❌ Endpoint por DDD não disponível na API BRDID');
    }
    console.log('');

    console.log('='.repeat(70));
    console.log('✨ TESTES CONCLUÍDOS COM SUCESSO!');
    console.log('='.repeat(70));
    console.log('');
    console.log('📚 Acesse a documentação completa em: http://localhost:3000/api-docs');
    console.log('');

  } catch (error) {
    console.error('❌ Erro nos testes:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Dados:', error.response.data);
    }
  }
}

// Aguarda servidor iniciar e executa testes
setTimeout(() => {
  testProxyAPI().catch(console.error);
}, 2000);
