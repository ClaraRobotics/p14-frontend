import { isInteger } from 'lodash'

export const roundDownToMultipleOf = (num: number, base: number) => {
  if (!isInteger(base) || base === 0) return num;

  return num - num % base;
}

export const roundUpToMultipleOf = (num: number, base: number) => {
  if (!isInteger(base) || base === 0 || num % base === 0) return num;

  return num + (base - num % base);
}

