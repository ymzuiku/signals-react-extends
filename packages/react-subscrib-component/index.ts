import {
  createContext,
  createElement,
  useContext,
  useMemo,
  useState,
} from "react";
import { ChannelArgs, ChannelInputs } from "./types";

const SubscribContext = createContext(0);

// const EmptyArray: unknown[] = [];

export interface Channel<T> {
  (): T;
  set: (v: T) => unknown;
}

export function channel<T>(value: T): Channel<T> {
  let cache = value;
  const ch = () => {
    return cache;
  };
  ch.set = (v: T) => {
    cache = v;
    publish();
  };
  return ch;
}

export function isChannel(value: any) {
  return typeof value === "function" && typeof value.set === "function";
}

// export function useChannel<T>(value: T | Channel<T>): Channel<T> {
//   const ref = useRef(isChannel(value) ? value : channel(value));
//   return ref.current as any;
// }

const publishOpt = {
  fn: () => {},
};

export function Subscribe<T extends ChannelInputs>({
  children,
  channel,
}: {
  children: (...args: ChannelArgs<T>) => any;
  channel: T;
}) {
  useContext(SubscribContext);
  const nextValues = channel.map((v) => v());
  return useMemo(() => (children as any)(...nextValues), nextValues);
}

export function SubscribeProvider({ children }: { children: any }) {
  const [state, setState] = useState(0);
  publishOpt.fn = () => {
    setState((v) => {
      v += 1;
      if (v > 999999) {
        v = 0;
      }
      return v;
    });
  };
  return createElement(SubscribContext.Provider, { children, value: state });
}

export function publish() {
  publishOpt.fn();
}

function localStorageGet(key: string) {
  if (typeof window === "undefined") {
    return void 0;
  }
  const v = localStorage.getItem(key);
  if (!v) {
    return void 0;
  }
  try {
    return JSON.parse(v).j;
  } catch (e) {
    return void 0;
  }
}
function localStorageSet(key: string, value: any) {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(key, JSON.stringify({ j: value }));
}

export function channelWithStorage<T>(key: string, value: T): Channel<T> {
  let cache = value;
  const ch = () => {
    return cache;
  };
  ch.set = (v: T) => {
    cache = v;
    publish();
    localStorageSet(key, cache);
  };
  const old = localStorageGet(key);
  if (old !== void 0) {
    cache = old;
    publish();
  }
  return ch;
}
