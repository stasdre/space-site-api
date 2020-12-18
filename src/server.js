// Core
import express from 'express';
import cookieParser from 'cookie-parser';
// Instruments
import { logger, NotFoundError } from './utils';
import cors from 'cors';

// Routers
import { auth, works, workTypes, services, langs } from './routers';

const app = express();

app.use(
  cors({
    origin: false,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '100kb' }));

// Logger
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    let body = null;

    if (req.method !== 'GET') {
      body = JSON.stringify(req.body, null, 2);
    }

    logger.debug(`${req.method} ${body ? `\n${body}` : ''}`);
    next();
  });
}

// Routers
app.use('/api/', auth);
app.use('/api/work-types', workTypes);
app.use('/api/works', works);
app.use('/api/services', services);
app.use('/api/langs', langs);

app.use('*', (req, res, next) => {
  const error = new NotFoundError(
    `Can not find right route for method ${req.method} and path ${req.originalUrl}`
  );
  next(error);
});

export { app };
