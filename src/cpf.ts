import { createErrorResult, createSuccessResult, generateRandomString, Result } from "./common";

export type CpfString = string & { readonly __tag: unique symbol };

export enum CpfErrors {
  /** String deve ter 11 caracteres */
  INVALID_LENGTH = 'invalid-length',
  /** Caracteres inválidos recebidos no input (são aceitos apenas números) */
  INVALID_CHARS = 'invalid-chars',
  /** Dígitos verificadores inválidos */
  INVALID_CHECK_DIGITS = 'invalid-check-digits'
};

const onlyNumbersPattern = /^\d{11}$/;
const getValueFromChar = (char: string): number => char.charCodeAt(0) - 48;

function calculateDV(value: number[]): number {
  let sum = value.reduce((acc, current, currentIndex, arr) => acc + current * (arr.length + 1 - currentIndex), 0);
  let dv = 11 - (sum % 11);
  return (dv > 9) ? 0 : dv;
}

export function validate(value: string): Result<CpfString, CpfErrors> {
  if (value.length !== 11) {
    return createErrorResult(CpfErrors.INVALID_LENGTH);
  }

  if (!onlyNumbersPattern.test(value)) {
    return createErrorResult(CpfErrors.INVALID_CHARS);
  }

  const originalNumbers = value.split('').map(getValueFromChar);

  let dv = calculateDV(originalNumbers.slice(0, 9))
  if (getValueFromChar(value[9]) !== dv) {
    return createErrorResult(CpfErrors.INVALID_CHECK_DIGITS);
  }

  dv = calculateDV(originalNumbers.slice(0, 10))
  if (getValueFromChar(value[10]) !== dv) {
    return createErrorResult(CpfErrors.INVALID_CHECK_DIGITS);
  }

  return createSuccessResult(value as CpfString);
}

const patternWithoutDVs = /^\d{9}$/;

export function calculateCheckDigits(value: string): Result<[number, number], CpfErrors> {
  if (value.length !== 9) {
    return createErrorResult(CpfErrors.INVALID_LENGTH);
  }

  if (!patternWithoutDVs.test(value)) {
    return createErrorResult(CpfErrors.INVALID_CHARS);
  }

  const originalNumbers = value.split('').map(getValueFromChar);

  const dv1 = calculateDV(originalNumbers);
  originalNumbers.push(dv1);
  
  const dv2 = calculateDV(originalNumbers);

  return createSuccessResult([dv1, dv2]);
}

const numbersChars = '1234567890';

export function generate(): CpfString {
  let numbers = generateRandomString(9, numbersChars);
  const result = calculateCheckDigits(numbers);
  if (result.sucesso === false) { throw new Error('Internal error'); }
  const [dv1, dv2] = result.dados;
  return (numbers + dv1 + dv2) as CpfString;
}

