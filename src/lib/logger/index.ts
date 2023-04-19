import { LoggerContext } from '../../general-types';
import loggerCreator from './loggerCreator';

export const generalLogger = loggerCreator(LoggerContext.GENERAL);
export const routeLogger = loggerCreator(LoggerContext.ROUTES);
export const dataLogger = loggerCreator(LoggerContext.DATABASE);
