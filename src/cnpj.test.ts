import { describe, it, assert } from "vitest";
import { validate, calculateCheckDigits, generate, CnpjString, extractInfo } from './cnpj'

describe('cnpj.validate tests', () => {
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

describe('cnpj.extractInfo tests', () => {
  it.each([
    { value: '48217216000130', formattedValue: '48.217.216/0001-30' },
    { value: '72138217000173', formattedValue: '72.138.217/0001-73' },
    { value: '77877055000109', formattedValue: '77.877.055/0001-09' },
    { value: '64069201000128', formattedValue: '64.069.201/0001-28' },
    { value: '13144351000118', formattedValue: '13.144.351/0001-18' },
  ])('should be valid', ({ value, formattedValue }) => {
    const result = extractInfo(value as CnpjString);
    assert.strictEqual(result.valor, value);
    assert.strictEqual(result.valorFormatado, formattedValue);

  });
});

describe('cnpj.calculateCheckDigits tests', () => {
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

describe('cnpj.generate tests', () => {
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

