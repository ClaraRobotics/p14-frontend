export const NaNDisplay = (input: number | null | undefined) => {
	if (input === undefined || input === null) {
		return '-';
	} else if (isNaN(input)) {
    return '-';
	}
  else{
    return input.toString();
  }
};
