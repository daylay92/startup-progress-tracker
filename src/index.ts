import http from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { merge } from 'lodash';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { NextFunction, Request, Response, Application } from 'express';
import app from './app';
import { ApplicationError, generalLogger, NotFoundError, routeLogger } from './lib';
import { phaseTypeDef, phaseResolvers, startupResolvers, startupTypeDef } from './modules';
import { seed } from './database';
import { EnvEnum } from './general-types';

const port = process.env.PORT || 4500;
const { pid } = process;
const httpServer = http.createServer(app);

process.on('unhandledRejection', (reason: unknown): void => {
  throw reason;
});

const onListening = () => {
  const addr = httpServer.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port || ''}`;
  const message = `🚀 Server listening on ${bind} with PID ${pid}`;
  generalLogger.info(message);
};

export const initApolloServer = async (appServer: Application) => {
  const server = new ApolloServer({
    typeDefs: [phaseTypeDef, startupTypeDef],
    resolvers: merge(phaseResolvers, startupResolvers),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ footer: false }),
    ],
    introspection: true,
    formatError(_, error: ApplicationError) {
      routeLogger.error(_);
      return {
        message: error.message,
        code: error.extensions?.code,
      };
    },
  });
  await server.start();
  appServer.use('/graphql', expressMiddleware(server));
};

const applyMiddlewares = (appServer: Application) => {
  appServer.get('/', (_req: Request, res: Response) =>
    res.status(200).json({
      message: 'Welcome, Navigate to /graphql to begin making queries...🚀🚀🚀',
    })
  );
  appServer.use((_req: Request, _res: Response, next: NextFunction) => {
    const err = new NotFoundError();
    next(err);
  });

  appServer.use((error: ApplicationError, req: Request, res: Response, _next: NextFunction) => {
    routeLogger.error(error?.message, {
      url: req?.originalUrl,
      message: error?.message,
      data: error?.data,
      stack: error?.stack,
    });
    return res.status(500).json({
      status: 'error',
      message: error.message,
      data: error.data,
    });
  });
};
const startServer = async (appServer: Application) => {
  // Seed the memory with dummy data
  seed();
  // initialize graphql server
  await initApolloServer(appServer);
  // add REST middleares
  applyMiddlewares(appServer);
  // Start listening for http requests
  httpServer.listen(port);
  httpServer.on('listening', onListening);
};

startServer(app).catch(generalLogger.error);
