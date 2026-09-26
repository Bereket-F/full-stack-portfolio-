import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from '@/config/env';
import routes from '@/routes';
import { errorHandler } from '@/middleware/errorHandler';
import { notFound } from '@/middleware/notFound';
import { apiLimiter } from '@/middleware/rateLimit';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(
    helmet({
      // This API is intentionally called cross-origin (with credentials) by its own
      // frontend on a different domain in production; the default same-origin CORP
      // header would otherwise cause browsers to block those legitimate responses.
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(
    cors({
      origin(origin, callback) {
        // Allow same-origin/non-browser requests (no Origin header) and any explicitly
        // whitelisted origin. Never falls back to a wildcard when credentials are used.
        if (!origin || env.corsOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  if (!env.isProd) {
    app.use(morgan('dev'));
  }

  app.use('/api', apiLimiter, routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
