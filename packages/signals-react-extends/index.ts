/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { effect, Signal, signal } from "@preact/signals-react";
import immer from "immer";
import { useCallback, useEffect } from "react";
import { debounce, throttle } from "throttle-debounce";

export * from "@preact/signals-react";
export { immer, throttle, debounce };

const Empty: unknown[] = [];

// only Render-props
export const Block = function Memo({ children }: { children: Function }) {
  return children();
};

export const is_ssr = typeof window === "undefined";
export const is_rended = signal(false);
export const ssrEffect = (fn: () => void) => {
  effect(() => {
    if (is_rended.value) {
      fn();
    }
  });
};

export function setSignal<T extends Signal>(
  $signal: T,
  fn: (value: T["value"]) => any
): T {
  $signal.value = immer($signal.value, (draft: any) => {
    fn(draft);
  });
  return $signal;
}

export const useSetSignal = <T extends Signal>(signal: T) => {
  return useCallback((value: T["value"]) => {
    signal.value = value;
  }, []);
};

export function useBlockCallback<T>(fn: T) {
  return useCallback(fn as any, Empty);
}

export const useRootSignal = () => {
  useEffect(() => {
    is_rended.value = true;
  }, Empty);
};
export function signalWithStorage<T>(key: string, value: T): Signal<T> {
  const $signal = signal(value);
  if (!is_ssr) {
    let loaded = false;

    const save = throttle(100, (v: any) => {
      if (loaded) {
        localStorage.setItem(key, JSON.stringify({ v }));
      }
    });

    effect(() => {
      save($signal.value);
    });

    ssrEffect(() => {
      const old = localStorage.getItem(key);
      if (old) {
        const obj = JSON.parse(old);
        if (obj.v !== void 0) {
          $signal.value = obj.v;
        }
      }
      loaded = true;
    });
  }

  return $signal;
}
