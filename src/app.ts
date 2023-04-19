import 'dotenv/config';
import express, { json, urlencoded } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
require('express-async-errors');

import { generalLogger } from './lib/logger';
import { EnvEnum } from './general-types';

const app = express();

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  })
);

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

const stream = {
  write: (text: string) => generalLogger.http(text),
};

if (process.env.NODE_ENV !== EnvEnum.TESTING) {
  app.use(morgan('dev', { stream }));
}

export default app;
