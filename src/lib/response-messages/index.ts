export enum ResponseMessages {
  SERVER_ERROR = 'Unexpected application error',
  VALIDATION_ERROR = 'Error in request data',
  FORBIDDEN_ERROR = 'Unauthorized attempt to access resource',
  WRONG_ROUTE_ERROR = 'Cannot find route',
  NOT_FOUND_ERROR = 'Resource does not exist',
  CONFLICT_ERROR = 'A record exists with the same value',
  SERVER_ERROR_CODE = 'INTERNAL_SERVER_ERROR',
  VALIDATION_ERROR_CODE = 'BAD_REQUEST',
  FORBIDDEN_ERROR_CODE = 'FORBIDDEN',
  CONFLICT_ERROR_CODE = 'DUPLICATE_ERROR',
  NOT_FOUND_ERROR_CODE = 'RESOURCE_NOT_FOUND',
}
