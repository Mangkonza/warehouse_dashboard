import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { authRouter } from './routes/auth.routes.js';
import { dashboardRouter } from './routes/dashboard.routes.js';
import { adminRouter } from './routes/admin.routes.js';
import { personnelRouter } from './routes/personnel.routes.js';

const app = express();

// Middlewares
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root
app.get('/', (_req, res) => {
  res.json({
    name: 'KU Warehouse Backend API',
    status: 'online',
    version: '1.0.0',
    documentation: {
      health: '/api/health',
      auth: '/api/v1/auth',
      dashboard: '/api/v1/dashboard',
    },
  });
});

// Healthcheck
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'ku-warehouse-backend',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/personnel', personnelRouter);

// Start server
app.listen(env.PORT, () => {
  console.log(`🚀 KU Warehouse Backend running on http://localhost:${env.PORT}`);
  console.log(`📡 Environment: ${env.NODE_ENV}`);
});
