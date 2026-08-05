import { describe, it, before, after } from 'node:test';
import { expect } from '../../../test/expect';
import { fn } from '../../../test/mock';
import { mkdtempSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { requestSchemaValidatorHandler } from './request-schema-validator-handler';
import { SCHEMA_INVALID } from '../errors';

describe('requestSchemaValidatorHandler()', () => {
  let schemaDir = '';
  let schemaFile = '';

  const emailAndPasswordSchema = {
    $schema: 'http://json-schema.org/draft-07/schema',
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        $id: '#/properties/email',
        type: 'string',
      },
      password: {
        $id: '#/properties/password',
        type: 'string',
      },
    },
  };

  before(() => {
    schemaDir = mkdtempSync(join(tmpdir(), 'firebase-triggers-schema-'));
    schemaFile = join(schemaDir, 'schemaFile.json');
    writeFileSync(schemaFile, JSON.stringify(emailAndPasswordSchema));
  });

  after(() => {
    rmSync(schemaDir, { recursive: true, force: true });
  });

  function createResponse() {
    const res = {
      status: fn(),
      json: fn(),
      sendFile: fn(),
    };
    res.status.mockImplementation(() => res);
    res.json.mockImplementation(() => res);
    res.sendFile.mockImplementation(() => res);
    return res;
  }

  it('should return schema when called with /schema.json', async () => {
    const req = { path: '/schema.json' };
    const res = createResponse();
    const originalMethod = fn();

    const handledMethod = requestSchemaValidatorHandler(originalMethod, schemaFile);
    await handledMethod(req, res);

    expect(res.sendFile).toBeCalledWith(schemaFile);
    expect(originalMethod).not.toBeCalled();
  });

  it('should execute the original method if the filename is empty', async () => {
    const req = {};
    const res = createResponse();
    const originalMethod = fn();

    const handledMethod = requestSchemaValidatorHandler(originalMethod, '');
    await handledMethod(req, res);

    expect(originalMethod).toBeCalledWith(req, res);
  });

  it('should execute the original method if schema is valid', async () => {
    const req = {
      path: '',
      body: {
        email: 'john@fbtrs_test.io',
        password: 'abc123',
      },
    };
    const res = createResponse();
    const originalMethod = fn();

    const handledMethod = requestSchemaValidatorHandler(originalMethod, schemaFile);
    await handledMethod(req, res);

    expect(originalMethod).toBeCalledWith(req, res);
  });

  it('should respond with error if the request body is invalid', async () => {
    const req = {
      path: '',
      body: { password: 'abc123' },
    };
    const res = createResponse();
    const originalMethod = fn();

    const handledMethod = requestSchemaValidatorHandler(originalMethod, schemaFile);
    await handledMethod(req, res);

    expect(res.status).toBeCalledWith(400);
    expect(res.json.mock.calls[0][0]).toMatchObject({
      success: false,
      error: SCHEMA_INVALID,
    });
    expect(originalMethod).not.toBeCalled();
  });
});
