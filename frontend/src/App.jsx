import React, { useState } from 'react';

// Importa o tema e os estilos principais do PrimeReact
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css"; // Adiciona o PrimeFlex para layout

// --- MUDANÇA AQUI ---
// Importa a nova página que acabamos de criar
import Products from './pages/Products';
// (Vamos deixar o Dashboard antigo aqui por enquanto, caso precisemos)
// import Dashboard from './pages/Dashboard'; 

function App() {
  // Estado simples para simular login.
  // No futuro, isso virá do seu `useAuth` hook.
  const [isLoggedIn, setIsLoggedIn] = useState(true); // <-- Mude para 'false' para ver a tela de login

  // --- Tela de Login (Simples) ---
  // (Vamos construir isso melhor depois)
  if (!isLoggedIn) {
    return (
      <div className="flex align-items-center justify-content-center min-h-screen">
        <div className="card p-5">
          <h2 className="text-center mb-4">Login NestHost ERP</h2>
          {/* O formulário de login virá aqui */}
          <button onClick={() => setIsLoggedIn(true)}>Simular Login</button>
        </div>
      </div>
    );
  }

  // --- Área Principal do App (Dashboard/Telas) ---
  // (No futuro, usaremos o React Router aqui para navegar entre
  // Dashboard, Produtos, Clientes, etc.)
  return (
    <div className="p-4">
      {/* Menu Superior (Simples) 
        (No futuro, este será seu componente 'Layout' ou 'Navbar')
      */}
      <header className="mb-4 p-3 shadow-2 border-round">
        <h1 className="m-0">NestHost ERP</h1>
        <small>Bem-vindo, {`{usuário}`}!</small>
      </header>

      {/* Conteúdo Principal 
        (Agora estamos exibindo a página de Produtos)
      */}
      <main>
        {/* --- MUDANÇA AQUI --- */}
        {/* Em vez de mostrar o Dashboard, mostramos o Gerenciador de Produtos */}
        <Products />

        {/* <Dashboard /> */}
      </main>
    </div>
  );
}

export default App;