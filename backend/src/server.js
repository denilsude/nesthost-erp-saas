// Importações necessárias
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

// --- Configuração Inicial ---
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_padrao_caso_falhe';

// ------------------------------------------------------------------
// --- PASSO 4: O "FILTRO" DE SEGURANÇA (MIDDLEWARE) ---
// ------------------------------------------------------------------
// Este é o "Segurança" que fica na porta de todas as rotas da API.
const authenticateToken = (req, res, next) => {
  // 1. Pega o "crachá" (token) do cabeçalho da requisição
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato "Bearer TOKEN"

  // 2. Se não tem crachá, barra a entrada
  if (token == null) {
    return res.status(401).json({ error: 'Acesso não autorizado: Token não fornecido.' });
  }

  // 3. Verifica se o crachá é válido (não é falso)
  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      return res.status(403).json({ error: 'Acesso negado: Token inválido.' });
    }

    // 4. SUCESSO! O crachá é válido.
    // Anexamos os dados do usuário (especialmente o tenantId) na requisição
    // para que as próximas rotas saibam "quem" está pedindo.
    req.tenantId = userPayload.tenantId; // <-- A "mágica" está aqui
    req.userId = userPayload.userId;

    // 5. Libera o acesso para a rota final (ex: /api/products)
    next();
  });
};

// --- Rota "Saúde" (Aberta) ---
app.get('/', (req, res) => {
  res.status(404).json({ error: 'API está no ar, mas esta rota não existe. Use /auth/...' });
});

// --- Rotas de Autenticação (Abertas) ---
// (Não precisam do filtro "authenticateToken" pois são a "Portaria")
app.post('/auth/register', async (req, res) => {
  const { name, email, password, tenantName } = req.body;
  if (!name || !email || !password || !tenantName) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios: nome, email, senha e nome da loja.' });
  }
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        tenant: {
          create: {
            name: tenantName,
          },
        },
      },
      include: {
        tenant: true,
      },
    });
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno ao registrar usuário.' });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    const token = jwt.sign(
      {
        userId: user.id,
        tenantId: user.tenantId, // <-- O ID da Loja vai no "crachá"
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno ao fazer login.' });
  }
});

// ------------------------------------------------------------------
// --- ROTAS DA API (PRODUTOS, VENDAS, CLIENTES) ---
// --- TODAS AS ROTAS AQUI SÃO PROTEGIDAS PELO FILTRO ---
// ------------------------------------------------------------------

// Criamos um "grupo" de rotas que começam com /api
// Todas as rotas neste grupo SÓ FUNCIONAM se o filtro "authenticateToken" passar.
const apiRoutes = express.Router();
apiRoutes.use(authenticateToken); // <-- O FILTRO É APLICADO AQUI

// --- Rotas de Produtos (Exemplo de CRUD protegido) ---

// [GET] /api/products (Listar todos os produtos DA MINHA LOJA)
apiRoutes.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        tenantId: req.tenantId, // <-- O filtro MÁGICO! Pega o ID da Loja do "crachá"
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos.' });
  }
});

// [POST] /api/products (Cadastrar um novo produto PARA MINHA LOJA)
apiRoutes.post('/products', async (req, res) => {
  const { name, barcode, price, stock } = req.body;

  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        barcode,
        price,
        stock,
        tenantId: req.tenantId, // <-- O filtro MÁGICO! Conecta o produto à Loja do "crachá"
      },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res.status(500).json({ error: 'Erro ao criar produto.' });
  }
});

// --- FIM DAS ROTAS PROTEGIDAS ---

// Diz ao Express para usar o grupo /api
app.use('/api', apiRoutes);


// --- Inicialização do Servidor ---
const port = process.env.PORT || 3001;
app.listen(port, () => {
  // Usamos [dotenv] no log para diferenciar do log do "npx"
  console.log(`[API NestHost] Servidor rodando na porta ${port}`);
});