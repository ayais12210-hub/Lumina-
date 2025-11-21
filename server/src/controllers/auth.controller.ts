import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: '30d',
  });
};

export const authController = {
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      // Seed Admin if none exists (MVP Convenience)
      const userCount = await prisma.user.count();
      if (userCount === 0 && email === 'admin@lumina.store') {
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash('password', salt);
         await prisma.user.create({
            data: { email, password: hashedPassword, name: 'Admin User', role: 'ADMIN' }
         });
      }

      const user = await prisma.user.findUnique({ where: { email } });

      if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
          success: true,
          data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role),
          },
        });
      } else {
        res.status(401).json({ success: false, error: { code: 'AUTH_ERROR', message: 'Invalid email or password' } });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Login failed' } });
    }
  },

  register: async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      const userExists = await prisma.user.findUnique({ where: { email } });
      if (userExists) {
        return res.status(400).json({ success: false, error: { code: 'USER_EXISTS', message: 'User already exists' } });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'CUSTOMER',
        },
      });

      if (user) {
        res.status(201).json({
          success: true,
          data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role),
          },
        });
      } else {
        res.status(400).json({ success: false, error: { code: 'INVALID_DATA', message: 'Invalid user data' } });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Registration failed' } });
    }
  }
};