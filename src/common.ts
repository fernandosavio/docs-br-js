export type SuccessResult<T> = {
  sucesso: true,
  dados: T,
}

export type ErrorResult<E> = {
  sucesso: false,
  erro: E,
}

export type Result<T, E> = SuccessResult<T> | ErrorResult<E>;

export function createSuccessResult<T>(data: T): SuccessResult<T> {
  return { sucesso: true, dados: data };
}

export function createErrorResult<E>(data: E): ErrorResult<E> {
  return { sucesso: false, erro: data };
}

export class IterCycle<T> {
  private iterable: T[];
  private currentIndex: number = 0;
  private itLength: number;
  
  constructor(iterable: T[]) {
    if (!iterable?.length) throw new Error('must be a not empty iterable');
    this.iterable = iterable;
    this.itLength = this.iterable.length;
    this.currentIndex = this.itLength - 1;
  }

  private incrementIndexBy(n: number) {
    this.currentIndex = (this.itLength + this.currentIndex +  (n % this.itLength)) % this.itLength;
  }

  reset(): void {
    this.currentIndex = this.itLength - 1;
  }

  next(): T {
    this.incrementIndexBy(1);
    return this.iterable[this.currentIndex];
  }

  skip(n: number): IterCycle<T> {
    this.incrementIndexBy(n);
    return this;
  }

  take(n: number): T[] {
    const arr = new Array(n);
    for (let i=0; i<n ; i++) {
      arr[i] = this.next();
    }
    return arr;
  }

  zip<A>(iterable: A[]): [T, A][] {
    return iterable.map((value) => [this.next(), value]);
  }
}

export function generateRandomString(length: number, characters: string): string {
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
}

export const enum UF {
  AC ='AC',
  AL ='AL',
  AP ='AP',
  AM ='AM',
  BA ='BA',
  CE ='CE',
  /** Distrito Federal */
  DF ='DF',
  ES ='ES',
  GO ='GO',
  MA ='MA',
  MT ='MT',
  MS ='MS',
  MG ='MG',
  PA ='PA',
  PB ='PB',
  PR ='PR',
  PE ='PE',
  PI ='PI',
  RJ ='RJ',
  RN ='RN',
  RS ='RS',
  RO ='RO',
  RR ='RR',
  SC ='SC',
  SP ='SP',
  SE ='SE',
  TO ='TO',
};
