import { createErrorResult, createSuccessResult, generateRandomString, Result, UF } from "./common";

export type CpfString = string & { readonly __tag: unique symbol };


const RegiaoFiscalEnum = {
  '1': {
    nome: '1ª Região Fiscal',
    estados: [UF.DF, UF.GO, UF.MT, UF.MS, UF.TO],
  },
  '2': {
    nome: '2ª Região Fiscal',
    estados: [UF.AC, UF.AP, UF.AM, UF.PA, UF.RO, UF.RR],
  },
  '3': {
    nome: '3ª Região Fiscal',
    estados: [UF.CE, UF.MA, UF.PI],
  },
  '4': {
    nome: '4ª Região Fiscal',
    estados: [UF.AL, UF.PB, UF.PE, UF.RN],
  },
  '5': {
    nome: '5ª Região Fiscal',
    estados: [UF.BA, UF.SE],
  },
  '6': {
    nome: '6ª Região Fiscal',
    estados: [UF.MG],
  },
  '7': {
    nome: '7ª Região Fiscal',
    estados: [UF.ES, UF.RJ],
  },
  '8': {
    nome: '8ª Região Fiscal',
    estados: [UF.SP],
  },
  '9': {
    nome: '9ª Região Fiscal',
    estados: [UF.PR, UF.SC],
  },
  '0': {
    nome: '10ª Região Fiscal',
    estados: [UF.RS],
  },
} as const;
type RegiaoFiscal = typeof RegiaoFiscalEnum[keyof typeof RegiaoFiscalEnum]

type CpfInfo = {
  valor: CpfString;
  valorFormatado: string;
  regiaoFiscal: RegiaoFiscal,
};

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

function format(value: CpfString): string {
  return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9, 11)}`;
}

export function extractInfo(value: CpfString): CpfInfo {
  return {
    valor: value,
    valorFormatado: format(value),
    regiaoFiscal: (RegiaoFiscalEnum as any)[value.charAt(8)],
  }
}

