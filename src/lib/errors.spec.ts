import { mergeError } from "./errors";

describe('mergeError()', () => {
  it('should return the error by replacing the parameters information', () => {
    // Setup
    const baseError = {
      code: 'auth/access-denied',
      msg: 'Access denied'
    };
    const localError = {
      code: 'variant',
      msg: 'Different error'
    };

    // Execute
    const result = mergeError(baseError, { error: localError });

    // Validate
    expect(result).toMatchObject({
      code: 'variant',
      msg: 'Different error'
    });
  });
  it('should return the error by merging the parameters information', () => {
    // Setup
    const baseError = {
      code: 'auth/access-denied',
      msg: 'Access denied'
    };
    const localError = {
      msg: 'Different error'
    };

    // Execute
    const result = mergeError(baseError, { error: localError });

    // Validate
    expect(result).toMatchObject({
      code: 'auth/access-denied',
      msg: 'Different error'
    });
  });
  it('should return original error if it has no data to merge', () => {
    // Setup
    const baseError = {
      code: 'auth/access-denied',
      msg: 'Access denied'
    };

    // Execute
    const result = mergeError(baseError, {});

    // Validate
    expect(result).toMatchObject({
      code: 'auth/access-denied',
      msg: 'Access denied'
    });
  });
  it('should return original error if it has no optional parameters', () => {
    // Setup
    const baseError = {
      code: 'auth/access-denied',
      msg: 'Access denied'
    };

    // Execute
    const result = mergeError(baseError, undefined);

    // Validate
    expect(result).toMatchObject({
      code: 'auth/access-denied',
      msg: 'Access denied'
    });
  });
  it('should return the error with the parameter message', () => {
    // Setup
    const baseError = {
      code: 'auth/access-denied',
      msg: 'Access denied'
    };

    // Execute
    const result = mergeError(baseError, { msg: 'Different message' });

    // Validate
    expect(result).toMatchObject({
      code: 'auth/access-denied',
      msg: 'Different message'
    });
  });
  it('should return error with standard error message in property "error"', () => {
    // Setup
    const baseError = {
      code: 'auth/access-denied',
      msg: 'Access denied'
    };

    // Execute
    const result = mergeError(baseError, { error: new Error('Another message') });

    // Validate
    expect(result).toMatchObject({
      code: 'auth/access-denied',
      msg: 'Access denied',
      error: 'Another message'
    });
  });
});
