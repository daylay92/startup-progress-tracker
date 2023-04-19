import { ClassConstructor, plainToClass } from 'class-transformer';
import {
  validate as classValidatorValidate,
  ValidationError as ClassValidatorValidationError,
  ValidatorOptions,
} from 'class-validator';

import { ValidationError } from '../errors';

export const getFirstErrorConstraints = (
  err: ClassValidatorValidationError
): Record<string, string> | undefined => {
  let firstErrorConstraints: Record<string, string> | undefined;

  if (err.constraints) {
    firstErrorConstraints = err.constraints;
  } else if (err.children && err.children.length > 0) {
    firstErrorConstraints = getFirstErrorConstraints(err.children[0]);
  }

  return firstErrorConstraints;
};

export const validate = async <T>(
  data: unknown,
  type: ClassConstructor<T>,
  validatorOptions: ValidatorOptions = {}
): Promise<T> => {
  const dto = plainToClass<T, unknown>(type, data);

  const errors = await classValidatorValidate(dto as Record<string, unknown>, {
    validationError: { target: false },
    whitelist: true,
    ...validatorOptions,
  });

  if (errors.length > 0) {
    const errorMessages: string[] = [];
    errors.forEach((err) => {
      const firstErrorConstraints = getFirstErrorConstraints(err);
      if (firstErrorConstraints) {
        errorMessages.push(...Object.values(firstErrorConstraints));
      }
    });
    throw new ValidationError(errorMessages.reverse()[0]);
  }

  return dto;
};
