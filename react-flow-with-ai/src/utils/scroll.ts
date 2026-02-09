export interface ScrollContainer {
  scrollLeft: number;
  scrollTo?: (opts: { left: number; behavior?: string }) => void;
}

/**
 * Scroll the container horizontally by `delta` pixels.
 * If container supports `scrollTo`, it will be used (smooth behavior).
 * Returns the new scrollLeft value.
 */
export function scrollBy(container: ScrollContainer, delta: number): number {
  const newLeft = (container.scrollLeft ?? 0) + delta;
  if (typeof container.scrollTo === 'function') {
    container.scrollTo({ left: newLeft, behavior: 'smooth' });
  } else {
    container.scrollLeft = newLeft;
  }
  return newLeft;
}
