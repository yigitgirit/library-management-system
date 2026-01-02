export function isIsbnLike(value: string): boolean {
  return /^[\d-]+$/.test(value)
}