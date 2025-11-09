import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

// 🟢 Registro
app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });
    res.json({ id: user.id, email: user.email });
  } catch (err) {
    res.status(400).json({ error: 'Usuário já existe' });
  }
});

// 🟢 Login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Senha inválida' });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// 🟢 Rota protegida
app.get('/protected', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Token ausente' });

  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ message: `Acesso permitido ao usuário ${decoded.userId}` });
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
