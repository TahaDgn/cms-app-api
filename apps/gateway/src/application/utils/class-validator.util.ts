import { ValidationError } from 'class-validator';

export function parseValidationError(error: ValidationError) {
  return {
    property: error.property,
    violations: error.constraints ? Object.values(error.constraints) : [],
    children: error.children
      ? error.children.map((childError) => parseValidationError(childError))
      : [],
  };
}

export function parseValidationErrors(errors: ValidationError[]) {
  return errors.map((error) => ({
    property: error.property,
    violations: error.constraints ? Object.values(error.constraints) : [],
    children: error.children
      ? error.children.map((childError) => parseValidationError(childError))
      : [],
  }));
}
