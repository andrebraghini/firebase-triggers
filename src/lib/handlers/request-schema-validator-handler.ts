import * as functions from 'firebase-functions';
import * as Ajv from 'ajv';
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
      validations: validate.errors
    };
    
    res.status(400).json(responseData);
  }

  return !!valid;
}

/**
 * Retorna método que valida o schema da requisição e responde com erro se não estiver de acordo.
 * @param requestHandler Método de requisição HTTP que será executado caso o schema seja válido
 * @param schemaFile Arquivo do schema
 */
export function requestSchemaValidatorHandler(requestHandler: Function, schemaFile: string): Function {
  return async function(...args: any[]) {
    if (validateRequest(args[0], args[1], schemaFile)) {
      return requestHandler.apply(this, args);
    }
  }
}
