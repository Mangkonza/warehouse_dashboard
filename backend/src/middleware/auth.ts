import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AuthUser, JWTPayload } from '../types/index.js';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
    req.user = {
      id: decoded.sub,
      nontriAccount: decoded.nontriAccount,
      email: decoded.email,
      nameTh: decoded.nameTh,
      facultyName: decoded.facultyName,
      departmentName: decoded.departmentName,
      campus: decoded.campus,
      typePerson: decoded.typePerson,
      role: decoded.role,
    };
    next();
  } catch (err) {
    res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
    return;
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized: Authentication required' });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden: Admin access required for this action' });
    return;
  }

  next();
};
