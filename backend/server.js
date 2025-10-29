// Simples servidor Express "Olá Mundo"
const express = require('express');
const app = express();
// Lê a porta do arquivo .env, ou usa 3001 como padrão
const port = process.env.PORT || 3001;

// Endpoint de teste da API
app.get('/', (req, res) => {
  res.send('Olá Mundo! Este é o Backend (API) do NestHost ERP.');
});

// Endpoint de teste de loja (para o frontend buscar)
app.get('/api/store/:subdomain', (req, res) => {
  const { subdomain } = req.params;
  res.json({
    storeName: `Loja ${subdomain}`,
    message: `Dados da loja ${subdomain} buscados com sucesso.`
  });
});

app.listen(port, () => {
  console.log(`Backend API rodando na porta ${port}`);
});