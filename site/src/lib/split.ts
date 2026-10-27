// Découpe un texte en mots masqués pour les révélations typographiques.
// Le texte reste lisible et indexable : seules des <span> sont ajoutées.

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function splitWords(text: string, start = 0, accentFrom?: number): string {
  return text
    .trim()
    .split(/[ \t\n]+/)
    .map((word, i) => {
      const accent = accentFrom !== undefined && i >= accentFrom ? ' w-accent' : '';
      return `<span class="w${accent}"><span style="--i:${start + i}">${escape(word)}</span></span>`;
    })
    .join(' ');
}
