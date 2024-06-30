import { createErrorResult, createSuccessResult, generateRandomString, IterCycle, Result } from "./common";

export type CnpjString = string & { readonly __tag: unique symbol };

export enum CnpjErrors {
  /** String deve ter 14 caracteres */
  INVALID_LENGTH = 'invalid-length',
  /** Caracteres inválidos recebidos no input (apenas números no padrão antigo e números e letras maiúsculas no novo) */
  INVALID_CHARS = 'invalid-chars',
  /** Dígitos verificadores inválidos */
  INVALID_CHECK_DIGITS = 'invalid-check-digits'
};

type CnpjInfo = {
  valor: CnpjString;
  valorFormatado: string;
};


const oldPattern = /^\d{14}$/;
const newPattern = /^[\dA-Z]{12}\d{2}$/;
const getValueFromChar = (char: string): number => char.charCodeAt(0) - 48;

type validateOptions = {
  /** Se `true` CNPJ poderá conter apenas números (validação antiga pré 2026) senão permite letras maiúsculas nos caracteres que não fores dígitos verificadores */
  onlyNumbers?: boolean;
};

const factors = [9, 8, 7, 6, 5, 4, 3, 2];
const factorIter = new IterCycle(factors);

function calculateDV(value: number[]): number {
  factorIter.reset();
  let sum = factorIter.skip(factors.length - (value.length % factors.length)).zip(value).reduce((acc, [factor, value]) => factor * value + acc, 0);
  let dv = 11 - (sum % 11);
  return (dv > 9) ? 0 : dv;
}

export function validate(value: string, options?: validateOptions): Result<CnpjString, CnpjErrors> {
  if (value.length !== 14) {
    return createErrorResult(CnpjErrors.INVALID_LENGTH);
  }
  const validationPattern = options?.onlyNumbers ? oldPattern : newPattern;
  
  if (!validationPattern.test(value)) {
    return createErrorResult(CnpjErrors.INVALID_CHARS);
  }

  const originalNumbers = value.split('').map(getValueFromChar);

  let dv = calculateDV(originalNumbers.slice(0, 12))
  if (getValueFromChar(value[12]) !== dv) {
    return createErrorResult(CnpjErrors.INVALID_CHECK_DIGITS);
  }

  dv = calculateDV(originalNumbers.slice(0, 13))
  if (getValueFromChar(value[13]) !== dv) {
    return createErrorResult(CnpjErrors.INVALID_CHECK_DIGITS);
  }

  return createSuccessResult(value as CnpjString);
}

const patternWithoutDVs = /^[\dA-Z]{12}$/;

export function calculateCheckDigits(value: string): Result<[number, number], CnpjErrors> {
  if (value.length !== 12) {
    return createErrorResult(CnpjErrors.INVALID_LENGTH);
  }

  if (!patternWithoutDVs.test(value)) {
    return createErrorResult(CnpjErrors.INVALID_CHARS);
  }

  const originalNumbers = value.split('').map(getValueFromChar);

  const dv1 = calculateDV(originalNumbers);
  originalNumbers.push(dv1);
  
  const dv2 = calculateDV(originalNumbers);

  return createSuccessResult([dv1, dv2]);
}

type GenerateOptions = {
  onlyNumbers?: boolean;
  randomizeFilial?: boolean;
};

const numbersChars = '1234567890';
const cnpjChars = numbersChars + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function generate(options?: GenerateOptions): CnpjString {
  let numbers: string;
  const characters = (options?.onlyNumbers ?? true) ? numbersChars : cnpjChars;
  if (options?.randomizeFilial ?? false) {
    numbers = generateRandomString(12, characters);
  } else {
    numbers = generateRandomString(8, characters) + '0001';
  }
  const result = calculateCheckDigits(numbers);
  if (result.sucesso === false) { throw new Error(); }
  const [dv1, dv2] = result.dados;
  return (numbers + dv1 + dv2) as CnpjString;
}

function format(value: CnpjString): string {
  return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5, 8)}/${value.slice(8, 12)}-${value.slice(12, 14)}`;
}

export function extractInfo(value: CnpjString): CnpjInfo {
  return {
    valor: value,
    valorFormatado: format(value),
  }
}

