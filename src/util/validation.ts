export const isValidNumber = (value: string) => /^\d+$/.test(value);

export const isNumberInRange = (value: string, min: number, max: number) => {
  if (!isValidNumber(value)) return false;
  const numValue = parseInt(value);
  return numValue <= max && numValue >= min;
};

export const isNumberNotEmpty = (value: string) => /^\d+$/.test(value);
export const isNumberEmpty = (value: string) => !/^\d+$/.test(value);
