import React, { useState, useEffect } from 'react';

// Importa o tema e os estilos principais do PrimeReact
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

// --- MUDANÇA AQUI ---
// Importa as duas páginas que criamos
import Products from './pages/Products';
import Login from './pages/Login';

function App() {
  // --- MUDANÇA AQUI ---
  // A "memória" do App agora guarda o token (crachá)
  const [token, setToken] = useState(null);

  // --- Efeito: O que fazer quando o App carregar pela primeira vez ---
  useEffect(() => {
    // 1. Verifica se o "crachá" já está salvo no navegador
    const storedToken = localStorage.getItem('token');
    
    if (storedToken) {
      // 2. Se encontrou, define como o token atual
      // (No futuro, vamos verificar se o token ainda é válido)
      setToken(storedToken);
    }
  }, []); // O '[]' significa "rodar este comando apenas uma vez, quando o App carregar"

  // --- Função: O que fazer quando o Login.jsx for bem-sucedido ---
  const handleLoginSuccess = (newToken) => {
    // 1. Salva o "crachá" no localStorage do navegador
    localStorage.setItem('token', newToken);
    // 2. Atualiza o estado do App, o que vai trocar a tela
    setToken(newToken);
  };

  // --- Função: O que fazer quando clicar em "Sair" (Logout) ---
  const handleLogout = () => {
    // 1. Apaga o "crachá" do localStorage
    localStorage.removeItem('token');
    // 2. Limpa o estado, o que vai trocar a tela para Login
    setToken(null);
  };

  // --- Renderização (O que aparece na tela) ---

  // Se NÃO HÁ token (não está logado)...
  if (!token) {
    // Mostra a página de Login
    // E passa para ela a função handleLoginSuccess
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Se HÁ um token (está logado)...
  // Mostra a Área Principal do App
  return (
    <div className="p-4">
      {/* Menu Superior */}
      <header className="mb-4 p-3 shadow-2 border-round flex justify-content-between align-items-center">
        <div>
          <h1 className="m-0">NestHost ERP</h1>
          <small>Bem-vindo!</small>
        </div>
        {/* --- MUDANÇA AQUI --- Botão de Sair */}
        <button 
          onClick={handleLogout} 
          className="p-button p-button-danger p-button-outlined"
        >
          <i className="pi pi-sign-out mr-2"></i>
          Sair
        </button>
      </header>

      {/* Conteúdo Principal */}
      <main>
        {/* Agora que estamos logados, mostramos a página de Produtos */}
        <Products />
      </main>
    </div>
  );
}

export default App;