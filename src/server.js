// Core
import express from 'express';
import cookieParser from 'cookie-parser';
// Instruments
import { logger, NotFoundError } from './utils';
import cors from 'cors';

// Routers
import { auth, works, workTypes, services } from './routers';

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
app.use('/', auth);
app.use('/work-types', workTypes);
app.use('/works', works);
app.use('/services', services);

app.use('*', (req, res, next) => {
  const error = new NotFoundError(
    `Can not find right route for method ${req.method} and path ${req.originalUrl}`
  );
  next(error);
});

export { app };
