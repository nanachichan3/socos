import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import bcrypt from 'bcrypt';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Use DATABASE_URL from environment (Coolify will set this)
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.warn('DATABASE_URL not set - using fallback');
}

app.use(cors());
app.use(express.json());

// Simple in-memory JWT simulation
const users = new Map<string, { id: string; token: string }>();

function generateToken(userId: string): string {
  const token = Buffer.from(`${userId}:${Date.now()}`).toString('base64');
  users.set(token, { id: userId, token });
  return token;
}

function verifyToken(token: string): string | null {
  const user = users.get(token);
  return user?.id || null;
}

// Auth middleware
function auth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token' });
  }
  const token = authHeader.slice(7);
  const userId = verifyToken(token);
  if (!userId) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  req.userId = userId;
  next();
}

// Health
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'SOCOS API' }));

// Auth
app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email exists' });
    
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, name, passwordHash: hash }
    });
    
    const vault = await prisma.vault.create({
      data: { name: 'My Contacts', ownerId: user.id }
    });
    
    const token = generateToken(user.id);
    res.json({ accessToken: token, user: { id: user.id, email: user.name, name: user.name, xp: user.xp, level: user.level } });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) return res.status(401).json({ error: 'Invalid' });
    
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid' });
    
    const token = generateToken(user.id);
    res.json({ accessToken: token, user: { id: user.id, email: user.email, name: user.name, xp: user.xp, level: user.level } });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/auth/profile', auth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  res.json(user);
});

app.get('/auth/stats', auth, async (req, res) => {
  const user = await prisma.user.findUnique({ 
    where: { id: req.userId },
    include: { _count: { select: { contacts: true, interactions: true } } }
  });
  res.json({ xp: user?.xp || 0, level: user?.level || 1, contactsCount: user?._count.contacts || 0 });
});

// Contacts
app.get('/contacts', auth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId }, include: { vaults: true } });
  const vaultId = user?.vaults[0]?.id;
  if (!vaultId) return res.json({ contacts: [] });
  
  const contacts = await prisma.contact.findMany({ 
    where: { vaultId },
    orderBy: { createdAt: 'desc' },
    take: 50
  });
  res.json({ contacts });
});

app.post('/contacts', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId }, include: { vaults: true } });
    const vaultId = user?.vaults[0]?.id;
    if (!vaultId) return res.status(400).json({ error: 'No vault' });
    
    const contact = await prisma.contact.create({
      data: { ...req.body, vaultId, ownerId: req.userId }
    });
    res.json(contact);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(`SOCOS API running on ${PORT}`));
