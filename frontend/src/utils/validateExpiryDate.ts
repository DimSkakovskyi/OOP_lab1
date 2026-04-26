export function validateExpiryDate(value: string): string | null {
  const trimmed = value.trim();

  if (!/^\d{2}\/\d{2}$/.test(trimmed)) {
    return 'Expiry date must be in MM/YY format with "/" separator';
  }

  const [month, year] = trimmed.split('/');
  const monthNumber = Number(month);
  const yearNumber = Number(year);

  if (Number.isNaN(monthNumber) || Number.isNaN(yearNumber)) {
    return 'Expiry date must contain valid numbers';
  }

  if (monthNumber < 1 || monthNumber > 12) {
    return 'Month must be between 01 and 12';
  }

  return null;
}