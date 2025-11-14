import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';

// Constante da nossa API (do arquivo .env.production)
const API_URL = import.meta.env.VITE_API_URL;

export default function Products() {
  // --- Estados (memória do componente) ---
  const [products, setProducts] = useState([]); // A lista de produtos da tabela
  const [showNewProductDialog, setShowNewProductDialog] = useState(false); // Controla o popup
  const [newProduct, setNewProduct] = useState({ // O formulário do novo produto
    name: '',
    barcode: '',
    price: 0.0,
    stock: 0,
  });
  const toast = useRef(null); // Referência para o componente de notificação

  // --- Função para buscar o Token (Crachá) ---
  // O "Segurança" do Frontend
  const getAuthHeader = () => {
    const token = localStorage.getItem('token'); // Pega o token salvo no login
    if (!token) {
      // Idealmente, redirecionar para o login se não tiver token
      console.error('Nenhum token encontrado, redirecionando para login...');
      // window.location.href = '/login'; // Descomente quando tiver a rota de login
      return {};
    }
    return { 'Authorization': `Bearer ${token}` };
  };

  // --- Efeitos (O que fazer quando o componente carregar) ---
  useEffect(() => {
    // Quando a tela carregar, busca os produtos
    fetchProducts();
  }, []);

  // --- Funções de API ---

  // 1. BUSCAR produtos (GET)
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`, {
        headers: getAuthHeader(), // <-- Usa o "crachá"
      });

      if (!response.ok) {
        throw new Error('Falha ao buscar produtos. Verifique seu login.');
      }
      
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      toast.current.show({ severity: 'error', summary: 'Erro', detail: error.message, life: 3000 });
    }
  };

  // 2. CRIAR produto (POST)
  const handleCreateProduct = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(), // <-- Usa o "crachá"
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar produto.');
      }
      
      // Sucesso!
      toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Produto criado!', life: 3000 });
      setShowNewProductDialog(false); // Fecha o popup
      setNewProduct({ name: '', barcode: '', price: 0.0, stock: 0 }); // Limpa o formulário
      fetchProducts(); // Atualiza a tabela com o novo produto
      
    } catch (error) {
      console.error(error);
      toast.current.show({ severity: 'error', summary: 'Erro', detail: error.message, life: 3000 });
    }
  };

  // --- Funções de Interface ---
  
  // Atualiza o estado do formulário enquanto o usuário digita
  const onNewProductChange = (e, name) => {
    const val = (e.target && e.target.value) || e.value || '';
    setNewProduct({ ...newProduct, [name]: val });
  };

  // Footer (botões) do popup
  const newProductDialogFooter = (
    <>
      <Button label="Cancelar" icon="pi pi-times" outlined onClick={() => setShowNewProductDialog(false)} />
      <Button label="Salvar" icon="pi pi-check" onClick={handleCreateProduct} />
    </>
  );

  // --- Renderização (O que aparece na tela) ---
  return (
    <div className="card">
      <Toast ref={toast} />
      
      <div className="flex justify-content-between align-items-center mb-4">
        <h2 className="m-0">Gerenciador de Produtos</h2>
        <Button 
          label="Novo Produto" 
          icon="pi pi-plus" 
          onClick={() => setShowNewProductDialog(true)} 
        />
      </div>

      {/* Tabela de Produtos */}
      <DataTable value={products} tableStyle={{ minWidth: '50rem' }}>
        <Column field="id" header="ID"></Column>
        <Column field="name" header="Nome"></Column>
        <Column field="barcode" header="Cód. Barras"></Column>
        <Column field="price" header="Preço (R$)"></Column>
        <Column field="stock" header="Estoque"></Column>
      </DataTable>

      {/* Popup (Dialog) para criar novo produto */}
      <Dialog 
        header="Novo Produto" 
        visible={showNewProductDialog} 
        style={{ width: '30vw' }} 
        modal 
        footer={newProductDialogFooter} 
        onHide={() => setShowNewProductDialog(false)}
      >
        <div className="flex flex-column gap-3">
          <div className="p-field">
            <label htmlFor="name">Nome</label>
            <InputText 
              id="name" 
              value={newProduct.name} 
              onChange={(e) => onNewProductChange(e, 'name')} 
              className="w-full"
            />
          </div>
          <div className="p-field">
            <label htmlFor="barcode">Código de Barras</label>
            <InputText 
              id="barcode" 
              value={newProduct.barcode} 
              onChange={(e) => onNewProductChange(e, 'barcode')} 
              className="w-full"
            />
          </div>
          <div className="p-field">
            <label htmlFor="price">Preço</label>
            <InputNumber 
              id="price" 
              value={newProduct.price} 
              onValueChange={(e) => onNewProductChange(e, 'price')} 
              mode="decimal" 
              minFractionDigits={2} 
              maxFractionDigits={2} 
              className="w-full"
            />
          </div>
          <div className="p-field">
            <label htmlFor="stock">Estoque</label>
            <InputNumber 
              id="stock" 
              value={newProduct.stock} 
              onValueChange={(e) => onNewProductChange(e, 'stock')} 
              integeronly 
              className="w-full"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}