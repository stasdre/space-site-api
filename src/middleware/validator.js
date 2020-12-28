// Core
import Ajv from 'ajv';
import { ValidationError } from '../utils/errors';

export const validator = (schema) => (req, res, next) => {
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const valid = validate(req.body);

  if (valid) {
    return next();
  }

  const errors = validate.errors
    .map(({ dataPath, message }) => `${dataPath}: ${message}`)
    .join(', ');
  const body = JSON.stringify(req.body, null, 2);

  //   next(
  //     new ValidationError(`${req.method}: ${req.originalUrl} [ ${errors} ]\n${body}`, 400)
  //   );
  res.status(400).send({ status: 400, errors });
};
