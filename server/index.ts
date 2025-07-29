import cors from 'cors'
import crypto from 'crypto'
import dotenv from 'dotenv'
import { eq } from 'drizzle-orm'
import express, { Request, Response } from 'express'
import { db } from '../db'
import { users } from '../db/schema'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8081', 'exp://localhost:8081', 'http://localhost:19006', 'exp://localhost:19006'],
  credentials: true
}))
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Core Access API is running' })
})

app.post('/api/auth/signin', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' })
      return
    }
    const [user] = await db.select().from(users).where(eq(users.email, email))
    if (!user || user.password !== password) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }
    res.json({ user: { id: user.id, email: user.email, name: user.name } })
  } catch (error) {
    console.error('Signin error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/auth/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' })
      return
    }
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      res.status(400).json({ error: 'Please enter a valid email address' })
      return
    }
    const [existingUser] = await db.select().from(users).where(eq(users.email, email))
    if (existingUser) {
      res.status(409).json({ error: 'User already exists' })
      return
    }
    const newUser = {
      id: crypto.randomUUID(),
      email,
      password,
      name: name || 'New User' as string,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await db.insert(users).values(newUser)
    res.status(201).json({ user: { id: newUser.id, email: newUser.email, name: newUser.name } })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(PORT, () => {console.log(`Server running on port ${PORT}`)})

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
}) 