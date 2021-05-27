import * as functions from 'firebase-functions';
import Ajv from 'ajv';
import { readFileSync } from 'fs';
import { SCHEMA_INVALID } from '../errors';

function validateRequest(req: functions.Request, res: functions.Response, schemaFile: string): boolean {
  if (!schemaFile) {
    return true;
  }

  if (req.path.toLowerCase() === '/schema.json') {
    res.sendFile(schemaFile);
    return false;
  }

  const schemaString: string = readFileSync(schemaFile).toString('utf8');
  const schema: any = JSON.parse(schemaString);

  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const valid = validate(req.body);

  if (!valid) {
    const responseData = {
      success: false,
      error: SCHEMA_INVALID,
      validations: validate.errors,
    };

    res.status(400).json(responseData);
  }

  return !!valid;
}

/**
 * Returns method that validates the request schema and responds with an error if it is not correct.
 * @param requestHandler HTTP request method that will be executed if the schema is valid
 * @param schemaFile Schema file
 */
export function requestSchemaValidatorHandler(requestHandler: Function, schemaFile: string): Function {
  return async function (...args: any[]) {
    if (validateRequest(args[0], args[1], schemaFile)) {
      return requestHandler.apply(this, args);
    }
  };
}
