import { hashPassword } from './utils/password.js';
import express from 'express';
import cors from 'cors';
import { env, corsOrigins } from './config/env.js';
import { checkDatabaseConnection, prisma } from './db/prisma.js';
import { cookieParser } from './middleware/cookieParser.js';
import { authRouter } from './routes/auth.routes.js';
import { dashboardRouter } from './routes/dashboard.routes.js';
import { adminRouter } from './routes/admin.routes.js';
import { personnelRouter } from './routes/personnel.routes.js';
import { lookupRouter } from './routes/lookup.routes.js';
import { ipRouter } from './routes/ip.routes.js';
import { serviceRouter } from './routes/service.routes.js';
import { evaluationRouter } from './routes/evaluation.routes.js';
import { dataRouter } from './routes/data.routes.js';
import { kpiRouter } from './routes/kpi.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (corsOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(cookieParser);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root
app.get('/', (_req, res) => {
  res.json({
    name: 'KU Warehouse Backend API',
    status: 'online',
    version: '1.0.0',
    documentation: {
      health: '/api/v1/health',
      auth: '/api/v1/auth',
      dashboard: '/api/v1/dashboard',
    },
  });
});

// Healthcheck: GET /api/v1/health and GET /api/health alias
const healthHandler = async (_req: express.Request, res: express.Response) => {
  const dbStatus = await checkDatabaseConnection();
  const statusCode = dbStatus.ok ? 200 : 503;

  res.status(statusCode).json({
    status: dbStatus.ok ? 'ok' : 'error',
    service: 'ku-warehouse-backend',
    database: dbStatus.ok ? 'connected' : 'disconnected',
    dbLatencyMs: dbStatus.latencyMs,
    error: dbStatus.error,
    timestamp: new Date().toISOString(),
  });
};

app.get('/api/v1/health', healthHandler);
app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/personnel', personnelRouter);
app.use('/api/v1/lookups', lookupRouter);
app.use('/api/v1/ip', ipRouter);
app.use('/api/v1/services', serviceRouter);
app.use('/api/v1/evaluation', evaluationRouter);
app.use('/api/v1/data', dataRouter);
app.use('/api/v1/kpis', kpiRouter);
app.use('/api/v1/kpi', kpiRouter);

// Global Error Handler
app.use(errorHandler);

// Start server on configured HOST (defaults to 0.0.0.0)
const server = app.listen(env.PORT, env.HOST, () => {
  console.log(`🚀 KU Warehouse Backend running on http://${env.HOST}:${env.PORT}`);
  console.log(`📡 Environment: ${env.NODE_ENV}`);

  // Ensure default admin accounts exist with hashed password
  const seedAdmins = true;
  if (seedAdmins) {
    const defaultAdmins = [
      {
        username: 'b6520503525',
        displayName: 'Super Admin (b6520503525)',
        note: 'Initial system super admin account',
      },
      {
        username: 'b0123456789',
        displayName: 'Admin',
        note: 'Mock Protected Admin for testing environment',
      },
      {
        username: 'admin',
        displayName: 'Super Admin (Admin)',
        note: 'Default admin alias account',
      },
      {
        username: 'superadmin',
        displayName: 'Super Admin',
        note: 'Default superadmin alias account',
      },
    ];

    Promise.all(
      defaultAdmins.map((adm) =>
        prisma.userRole.upsert({
          where: { username: adm.username },
          update: { role: 'admin', isProtected: true, displayName: adm.displayName, password: hashPassword('Admin@1234'), otp: '123456' },
          create: {
            username: adm.username,
            role: 'admin',
            isProtected: true,
            displayName: adm.displayName,
            password: hashPassword('Admin@1234'),
            otp: '123456',
            grantedBy: 'system',
            note: adm.note,
          },
        })
      )
    )
      .then(() => {
        console.log('🛡️ Mock Admin accounts (b6520503525, b0123456789, admin, superadmin) verified in user_roles table.');
      })
      .catch((err) => {
        console.error('Failed to ensure mock admins in database:', err);
      });
  }
});

// Graceful shutdown
const shutdown = async (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    try {
      await prisma.$disconnect();
      console.log('🔌 Database disconnected.');
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  });

  // Force exit after 5s if still hanging
  setTimeout(() => {
    console.error('⚠️ Force shutdown timed out. Exiting.');
    process.exit(1);
  }, 5000).unref();
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

export default app;
