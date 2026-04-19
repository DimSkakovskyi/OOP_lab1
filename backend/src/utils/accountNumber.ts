export function generateAccountNumber(): string {
  const timestampPart = Date.now().toString().slice(-8);
  const randomPart = Math.floor(1000 + Math.random() * 9000).toString();

  return `ACC${timestampPart}${randomPart}`;
}