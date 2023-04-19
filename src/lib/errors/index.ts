import { ResponseMessages } from '../response-messages';
import { ErrorData } from '../../general-types';
import { GraphQLError } from 'graphql';

export class ApplicationError extends GraphQLError {
  status: string;
  date: string;
  data: unknown;
  code: number;
  constructor({
    message,
    status = ResponseMessages.VALIDATION_ERROR_CODE,
    data,
    code = 400,
  }: ErrorData) {
    super(message as string, { extensions: { code: status } });
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApplicationError);
    }
    const date = new Date();
    this.name = this.constructor.name;
    this.status = status;
    this.date = date.toISOString();
    this.data = data || {};
    this.code = code;
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string = ResponseMessages.VALIDATION_ERROR) {
    super({
      code: 400,
      message,
    });
    this.name = this.constructor.name;
  }
}

export class InternalServerError extends ApplicationError {
  constructor(message: string = ResponseMessages.SERVER_ERROR) {
    super({
      message,
      code: 500,
      status: ResponseMessages.SERVER_ERROR_CODE,
    });
    this.name = this.constructor.name;
  }
}

export class ForbiddenError extends ApplicationError {
  constructor(message: string = ResponseMessages.FORBIDDEN_ERROR) {
    super({ message, code: 403, status: ResponseMessages.FORBIDDEN_ERROR_CODE });
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message: string = ResponseMessages.NOT_FOUND_ERROR) {
    super({ message, code: 404, status: ResponseMessages.NOT_FOUND_ERROR_CODE });
    this.name = this.constructor.name;
  }
}

export class ConflictError extends ApplicationError {
  constructor(message: string = ResponseMessages.CONFLICT_ERROR) {
    super({ message, code: 409, status: ResponseMessages.CONFLICT_ERROR_CODE });
    this.name = this.constructor.name;
  }
}
