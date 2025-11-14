import React, { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';

// Constante da nossa API (do arquivo .env.production)
const API_URL = import.meta.env.VITE_API_URL;

/**
 * A tela de Login.
 * Esta função recebe uma prop (propriedade) chamada 'onLoginSuccess'
 * que será chamada quando o login for bem-sucedido,
 * entregando o token para o App.jsx.
 */
export default function Login({ onLoginSuccess }) {
  // --- Estados (memória do componente) ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Para mostrar o "rodando" no botão
  const toast = useRef(null); // Para notificações

  // --- Função de Submit (Quando clicar em "Entrar") ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página (comportamento padrão do form)
    setLoading(true);

    if (!email || !password) {
      toast.current.show({ severity: 'warn', summary: 'Atenção', detail: 'Email e senha são obrigatórios.', life: 3000 });
      setLoading(false);
      return;
    }

    try {
      // 1. Chamar a API de Login (a "Portaria")
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // 2. Se a API retornar um erro (ex: 401 Credenciais inválidas)
      if (!response.ok) {
        throw new Error(data.error || 'Credenciais inválidas');
      }

      // 3. SUCESSO! A API retornou um token.
      toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Login realizado!', life: 2000 });
      
      // 4. Entrega o token para o App.jsx (nosso "chefe")
      if (data.token && onLoginSuccess) {
        onLoginSuccess(data.token);
      }

    } catch (error) {
      console.error(error);
      toast.current.show({ severity: 'error', summary: 'Erro no Login', detail: error.message, life: 3000 });
      setLoading(false);
    }
    // Não definimos setLoading(false) no sucesso, pois o App.jsx vai trocar de tela
  };

  // --- Renderização (O que aparece na tela) ---
  return (
    <div className="flex align-items-center justify-content-center min-h-screen">
      <Toast ref={toast} />
      <Card title="NestHost ERP Login" style={{ width: '25rem' }}>
        <form onSubmit={handleSubmit} className="flex flex-column gap-3">
          <div className="p-field">
            <label htmlFor="email">Email</label>
            <InputText 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full"
              placeholder="seuemail@loja.com"
            />
          </div>
          
          <div className="p-field">
            <label htmlFor="password">Senha</label>
            <Password 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full"
              inputClassName="w-full" // Garante que o input interno preencha
              feedback={false} // Desliga o medidor de força de senha
              toggleMask // Adiciona o ícone de "olho"
              placeholder="Sua senha"
            />
          </div>

          <Button 
            label="Entrar" 
            type="submit" 
            icon="pi pi-sign-in" 
            loading={loading} // Mostra o "rodando" quando estiver carregando
            className="mt-2"
          />
        </form>
      </Card>
    </div>
  );
}