/**
 * Utilitários de formatação de exibição — Cedro Mobile
 */

/**
 * Normaliza a EXIBIÇÃO de nomes próprios ("marcos silva" → "Marcos Silva"),
 * sem alterar o dado armazenado no banco.
 */
export function capitalizeName(name?: string | null): string {
  if (!name) return '';
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
