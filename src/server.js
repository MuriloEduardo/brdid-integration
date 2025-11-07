const app = require('./app');
const config = require('./config');

const PORT = config.port;

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 ${config.appName}`);
  console.log(`📡 Servidor rodando na porta ${PORT}`);
  console.log(`🌍 Ambiente: ${config.nodeEnv}`);
  console.log(`📚 Documentação disponível em: http://localhost:${PORT}/api-docs`);
  console.log('='.repeat(50));
});
