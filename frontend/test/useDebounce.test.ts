import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebounce } from '../src/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should debounce string values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    rerender({ value: 'changed', delay: 500 });
    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('changed');
  });

  it('should debounce number values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 0, delay: 500 },
      }
    );

    rerender({ value: 1, delay: 500 });
    expect(result.current).toBe(0);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe(1);
  });

  it('should use default delay of 500ms', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      {
        initialProps: { value: 'initial' },
      }
    );

    rerender({ value: 'changed' });
    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('changed');
  });

  it('should cancel previous timeout when value changes quickly', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    rerender({ value: 'changed1', delay: 500 });
    rerender({ value: 'changed2', delay: 500 });
    rerender({ value: 'changed3', delay: 500 });

    expect(result.current).toBe('initial'); 

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('changed3');
  });

  it('should handle null and undefined values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: null, delay: 500 },
      }
    );

    // @ts-expect-error - This is a test for null and undefined values
    rerender({ value: undefined, delay: 500 });
    expect(result.current).toBe(null);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBeUndefined();
  });
}); 