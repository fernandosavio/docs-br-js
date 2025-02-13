import { describe, it, assert } from "vitest";
import { validate, calculateCheckDigits, generate, extractInfo, CpfString } from './cpf'
import { UF } from "./common";

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

describe('cpf.extractInfo tests', () => {
  it.each([
    { value: '43378073225', formattedValue: '433.780.732-25', regiao: '2', },
    { value: '23555427750', formattedValue: '235.554.277-50', regiao: '7', },
    { value: '16357377708', formattedValue: '163.573.777-08', regiao: '7', },
    { value: '86177235999', formattedValue: '861.772.359-99', regiao: '9', },
    { value: '40516172700', formattedValue: '405.161.727-00', regiao: '7', },
  ])('should extract info ($value)', ({ value, formattedValue, regiao }) => {
    const result = extractInfo(value as CpfString);
    assert.strictEqual(result.valor, value);
    assert.strictEqual(result.valorFormatado, formattedValue);
    assert.isTrue(result.regiaoFiscal.nome.startsWith(regiao + 'ª'));
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

  it.each([
    { uf: 'DF', digit: '1' },
    { uf: 'GO', digit: '1' },
    { uf: 'MT', digit: '1' },
    { uf: 'MS', digit: '1' },
    { uf: 'TO', digit: '1' },
    { uf: 'AC', digit: '2' },
    { uf: 'AP', digit: '2' },
    { uf: 'AM', digit: '2' },
    { uf: 'PA', digit: '2' },
    { uf: 'RO', digit: '2' },
    { uf: 'RR', digit: '2' },
    { uf: 'CE', digit: '3' },
    { uf: 'MA', digit: '3' },
    { uf: 'PI', digit: '3' },
    { uf: 'AL', digit: '4' },
    { uf: 'PB', digit: '4' },
    { uf: 'PE', digit: '4' },
    { uf: 'RN', digit: '4' },
    { uf: 'BA', digit: '5' },
    { uf: 'SE', digit: '5' },
    { uf: 'MG', digit: '6' },
    { uf: 'ES', digit: '7' },
    { uf: 'RJ', digit: '7' },
    { uf: 'SP', digit: '8' },
    { uf: 'PR', digit: '9' },
    { uf: 'SC', digit: '9' },
    { uf: 'RS', digit: '0' },
  ] as Array<{ uf: keyof typeof UF, digit: string}>)('CPF from $uf must have the 9th digit \'$digit\'', ({uf, digit }) => {
      const randomValue = generate({ uf: uf });
      assert.lengthOf(randomValue, 11);
      assert.strictEqual(randomValue[8], digit);
      const result = validate(randomValue);
      assert.isTrue(result.sucesso);
  });
});

