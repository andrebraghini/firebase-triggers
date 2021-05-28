import { requestSchemaValidatorHandler } from './request-schema-validator-handler';
import { readFileSync } from 'fs';
import { SCHEMA_INVALID } from '../errors';

jest.mock('fs');

describe('requestSchemaValidatorHandler()', () => {
  const res = {
    status: jest.fn(),
    json: jest.fn(),
    sendFile: jest.fn(),
  };
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

  beforeEach(() => {
    jest.clearAllMocks();
    res.status.mockReturnThis();
    res.json.mockReturnThis();
    res.sendFile.mockReturnThis();
  });

  it('should return schema when called with /schema.json', () => {
    // Setup
    const req = { path: '/schema.json' };
    const originalMethod = jest.fn();

    // Execute
    const handledMethod = requestSchemaValidatorHandler(originalMethod, 'fileName.json');
    return handledMethod(req, res).then(() => {
      // Validate
      expect(res.sendFile).toBeCalledWith('fileName.json');
      expect(originalMethod).not.toBeCalled();
    });
  });
  it('should execute the original method if the filename is empty', () => {
    // Setup
    const req = {};
    const originalMethod = jest.fn();

    // Execute
    const handledMethod = requestSchemaValidatorHandler(originalMethod, '');
    return handledMethod(req, res).then(() => {
      // Validate
      expect(originalMethod).toBeCalledWith(req, res);
    });
  });
  it('should execute the original method if schema is valid', () => {
    // Setup
    const req = {
      path: '',
      body: {
        email: 'john@fbtrs_test.io',
        password: 'abc123',
      },
    };
    (readFileSync as jest.Mock).mockReturnValue({
      toString: () => JSON.stringify(emailAndPasswordSchema),
    });

    const originalMethod = jest.fn();

    // Execute
    const handledMethod = requestSchemaValidatorHandler(originalMethod, 'schemaFile.json');
    return handledMethod(req, res).then(() => {
      // Validate
      expect(readFileSync).toBeCalledWith('schemaFile.json');
      expect(originalMethod).toBeCalledWith(req, res);
    });
  });
  it('should respond with error if the request body is invalid', () => {
    // Setup
    const req = {
      path: '',
      body: { password: 'abc123' },
    };
    const expectedResponse = {
      success: false,
      error: SCHEMA_INVALID,
      validations: {},
    };
    (readFileSync as jest.Mock).mockReturnValue({
      toString: () => JSON.stringify(emailAndPasswordSchema),
    });

    const originalMethod = jest.fn();

    // Execute
    const handledMethod = requestSchemaValidatorHandler(originalMethod, 'schemaFile.json');
    return handledMethod(req, res).then(() => {
      // Validate
      expect(res.status).toBeCalledWith(400);
      expect(res.json.mock.calls[0][0]).toMatchObject(expectedResponse);
      expect(originalMethod).not.toBeCalled();
    });
  });
});
