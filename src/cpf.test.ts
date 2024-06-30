import { describe, it, assert } from "vitest";
import { validate, calculateCheckDigits, generate } from './cpf'

describe('cpf.validate tests', () => {
  it.each([
    { value: '43378073225' },
    { value: '23555427750' },
    { value: '16357377708' },
    { value: '86177235999' },
    { value: '40516172700' },
  ])('should be valid ($value)', ({ value }) => {
    const result = validate(value);
    assert.isTrue(result.sucesso);
  });
});

describe('cpf.calculateCheckDigits tests', () => {
  it.each([
    { value: '433780732', expected: [2, 5] },
    { value: '235554277', expected: [5, 0] },
    { value: '163573777', expected: [0, 8] },
    { value: '861772359', expected: [9, 9] },
    { value: '405161727', expected: [0, 0] },
  ])('should calculate check digits correctly ($value)', ({ value, expected }) => {
    const result = calculateCheckDigits(value);
    assert.isTrue(result.sucesso);
    if (!result.sucesso) { assert.fail('Should be valid')}
    assert.deepEqual(result.dados, expected);
  });
});

describe('cpf.generate tests', () => {
  it('should generate valid CPFs', () => {
    for (let i=0, l=10; i<l ; i++) {
      const randomValue = generate();
      assert.lengthOf(randomValue, 11);
      const result = validate(randomValue);
      assert.isTrue(result.sucesso);
    }
  });
});

