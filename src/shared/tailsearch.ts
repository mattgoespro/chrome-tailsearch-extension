import { assert } from "console";

export function createTailSearchQueryUrl(selectedText: string, searchTerm: string): string {
  assert(selectedText != null, "The selected text should not be null or undefined.");
  assert(searchTerm != null, "The search term should not be null or undefined.");

  const url = `https://www.google.com/search?q=${encodeURIComponent(`${selectedText} ${searchTerm}`)}`;

  if (!URL.canParse(url)) {
    throw new Error(`Cannot TailSearch an invalid URL: ${url}`);
  }

  return url;
}
