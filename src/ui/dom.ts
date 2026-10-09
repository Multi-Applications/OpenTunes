export function $<T extends Element = HTMLElement>(selector: string): T {
  return document.querySelector(selector) as unknown as T;
}

export function esc(str: string | undefined | null): string {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c] as string));
}