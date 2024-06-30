import { describe, it, assert } from 'vitest'
import { IterCycle } from './common'

describe('IterCycle tests', () => {
  it.each([
    [],
    {},
    '',
    NaN,
    Infinity,
    -Infinity,
    0,
    0.1,
    true,
    false,
    null,
    undefined,
  ])('should throw error on empty iterable', (arg) => {
    assert.throws(()=>{ new IterCycle(arg as unknown as any[]) }, 'must be a not empty iterable');
  });

  it('should cycle with next', () => {
    const iterNum = new IterCycle([1, 2, 3]);
    assert.strictEqual(iterNum.next(), 1);
    assert.strictEqual(iterNum.next(), 2);
    assert.strictEqual(iterNum.next(), 3);
    assert.strictEqual(iterNum.next(), 1);

    const iterChar = new IterCycle('abc'.split(''));
    assert.strictEqual(iterChar.next(), 'a');
    assert.strictEqual(iterChar.next(), 'b');
    assert.strictEqual(iterChar.next(), 'c');
    assert.strictEqual(iterChar.next(), 'a');
  });

  it('skipping inside array bounds should work', () => {
    let iter = new IterCycle([1, 2, 3, 4, 5]);
    assert.strictEqual(iter.skip(2).next(), 3);
    assert.strictEqual(iter.skip(1).next(), 5);
  });
  
  it('skipping zero steps should do nothing', () => {
    const iter = new IterCycle([1, 2, 3, 4, 5]);
    assert.strictEqual(iter.skip(0).next(), 1);
    assert.strictEqual(iter.skip(0).next(), 2);
  });
  
  it('skipping outside array bounds should wrap around', () => {
    const iter = new IterCycle([1, 2, 3, 4, 5]);
    assert.strictEqual(iter.skip(7).next(), 3);
    assert.strictEqual(iter.skip(7).next(), 1);
  });
  
  it('skipping forward and backward should stop on the same step', () => {
    let iter = new IterCycle([1, 2, 3, 4, 5]);
    assert.strictEqual(iter.skip(3).skip(-3).next(), 1);
    
    iter = new IterCycle([1, 2, 3, 4, 5]);
    assert.strictEqual(iter.skip(7).skip(-7).next(), 1);
  });
  
  it('skipping backwards inside array bounds should work', () => {
   const iter = new IterCycle([1, 2, 3, 4, 5]);
    assert.strictEqual(iter.skip(-3).next(), 3);
    assert.strictEqual(iter.skip(-3).next(), 1);
  });
  
  it('skipping backwards outside bounds should wrap around', () => {
    const iter = new IterCycle([1, 2, 3, 4, 5]);
    assert.strictEqual(iter.skip(-7).next(), 4);
    assert.strictEqual(iter.skip(-5).next(), 5);
  });

  it('skipping exactly the iterable size, should behave like skip(0)', () => {
    const iter = new IterCycle([1, 2, 3, 4, 5]);
    assert.strictEqual(iter.skip(-5).next(), 1);
    assert.strictEqual(iter.skip(-50).next(), 2);
    assert.strictEqual(iter.skip(50).next(), 3);
    assert.strictEqual(iter.skip(25).next(), 4);
    assert.strictEqual(iter.skip(-35).next(), 5);
    assert.strictEqual(iter.skip(-100).next(), 1);
  });

  it('should take correctly', () => {
    const iter = new IterCycle([1, 2, 3, 4, 5]);
    assert.deepEqual(iter.take(1), [1]);
    assert.deepEqual(iter.take(3), [2, 3, 4]);
    assert.deepEqual(iter.take(8), [5, 1, 2, 3, 4, 5, 1, 2]);
    assert.deepEqual(iter.take(0), []);
    assert.throws(() => { iter.take(-1) });
  });

  it('should zip correctly', () => {
    let iter = new IterCycle([1, 2, 3]);
    assert.deepEqual(iter.zip('abc'.split('')), [[1, 'a'], [2, 'b'], [3, 'c']]);

    iter = new IterCycle([1, 2, 3]);
    assert.deepEqual(iter.zip('ab'.split('')), [[1, 'a'], [2, 'b']]);

    iter = new IterCycle([1, 2, 3]);
    assert.deepEqual(iter.zip('abcde'.split('')), [[1, 'a'], [2, 'b'], [3, 'c'], [1, 'd'], [2, 'e']]);
  });
});

