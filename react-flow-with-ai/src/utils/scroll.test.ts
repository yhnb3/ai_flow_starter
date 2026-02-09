import { describe, it, expect } from 'vitest';
import { scrollBy, type ScrollContainer } from './scroll';

describe('scrollBy', () => {
  it('should scroll by positive delta using scrollTo when available', () => {
    const calls: Array<{ left: number; behavior?: string }> = [];
    const mock = {
      scrollLeft: 0,
      scrollTo: ({ left, behavior }: { left: number; behavior?: string }) => {
        calls.push({ left, behavior });
        mock.scrollLeft = left;
      },
    } as unknown as ScrollContainer;

    const res = scrollBy(mock, 150);
    expect(res).toBe(150);
    expect(mock.scrollLeft).toBe(150);
    expect(calls.length).toBe(1);
    expect(calls[0].left).toBe(150);
    expect(calls[0].behavior).toBe('smooth');
  });

  it('should scroll by negative delta without scrollTo', () => {
    const mock = { scrollLeft: 200 } as unknown as ScrollContainer;
    const res = scrollBy(mock, -80);
    expect(res).toBe(120);
    expect(mock.scrollLeft).toBe(120);
  });

  it('should handle missing initial scrollLeft (treat as 0)', () => {
    const mock = {} as unknown as ScrollContainer;
    const res = scrollBy(mock, 50);
    expect(res).toBe(50);
    expect(mock.scrollLeft).toBe(50);
  });
});
