export const phoneRegex = /^\+994(50|51|55|59|60|70|77|99)\d{7}$/;

export function validatePhone(value: string): string {
  if (!value.trim()) return "Telefon nömrəsi tələb olunur.";
  if (!phoneRegex.test(value.trim()))
    return "Nömrə +994XXXXXXXXX formatında olmalıdır (məs: +994501234567).";
  return "";
}
