export function createTailSearchQueryUrl(selectedText: string, searchTerm: string): string {
  const url = `https://www.google.com/search?q=${encodeURIComponent(`${selectedText} ${searchTerm}`)}`;

  if (!URL.canParse(url)) {
    throw new Error(`Cannot TailSearch an invalid URL: ${url}`);
  }

  return url;
}
