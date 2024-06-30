import { describe, it, assert } from "vitest";
import { validate, calculateCheckDigits, generate } from './cnpj'

describe('validateCnpj tests', () => {
  it.each([
    { value: '48217216000130' },
    { value: '72138217000173' },
    { value: '77877055000109' },
    { value: '64069201000128' },
    { value: '13144351000118' },
  ])('should be valid', ({ value }) => {
    const result = validate(value);
    assert.isTrue(result.sucesso);
  });
});

describe('calculateCheckDigits tests', () => {
  it.each([
    { value: '482172160001', expected: [3, 0] },
    { value: '721382170001', expected: [7, 3] },
    { value: '778770550001', expected: [0, 9] },
    { value: '640692010001', expected: [2, 8] },
    { value: '131443510001', expected: [1, 8] },
  ])('should calculate check digits correctly', ({ value, expected }) => {
    const result = calculateCheckDigits(value);
    assert.isTrue(result.sucesso);
    if (!result.sucesso) { assert.fail('Should be valid')}
    assert.deepEqual(result.dados, expected);
  });
});

describe('generateRandomCnpj tests', () => {
  it.each([
    { options: undefined },
    { options: {} },
    { options: { onlyNumbers: false } },
    { options: { onlyNumbers: true } },
  ])('should generate valid CNPJs', ({ options }) => {
    for (let i=0, l=10; i<l ; i++) {
      const randomCnpj = generate(options);
      assert.lengthOf(randomCnpj, 14);
      const result = validate(randomCnpj, options);
      assert.isTrue(result.sucesso);
    }
  });

  it.each([
    { options: {} },
    { options: { randomizeFilial: false} },
  ])('filial should be 0001', ({ options }) => {
    for (let i=0, l=10; i<l ; i++) {
      const randomCnpj = generate(options);
      assert.lengthOf(randomCnpj, 14);
      const result = validate(randomCnpj);
      assert.isTrue(result.sucesso);
      if (!result.sucesso) { assert.fail('Should be valid')}
      assert.strictEqual(result.dados.slice(8, 12), '0001')
    }
  });
});

