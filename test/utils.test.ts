import { describe, expect, test } from '@jest/globals';
import { decryptMessage, encryptMessage } from '@/validators';

describe('encryptMessage function test', () => {
  test('encryptMessage', () => {
    const pt = 'ok!123';
    const ct = encryptMessage('ok!123');
    const decode = decryptMessage(ct);
    expect(pt).toEqual(decode);
  });
});

afterAll((done) => {
  done();
});
