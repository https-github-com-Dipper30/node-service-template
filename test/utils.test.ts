import { describe, expect, test } from '@jest/globals'
import { decryptMessage, mixMessage } from '@/utils/validator'

describe('mixMessage function test', () => {
  test('mixMessage', () => {
    const pt = 'ok!123'
    const ct = mixMessage('ok!123')
    const decode = decryptMessage(ct)
    expect(pt).toEqual(decode)
  })
})

afterAll(done => {
  done()
})
