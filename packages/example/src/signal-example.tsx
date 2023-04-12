import { Signal, useComputed, useSignal } from "signals-react-extends";

function $<T>(value: Signal<T>): T {
  return value as any;
}
function set<T>(value: Signal<T>, fn: (v: T) => T): T {
  return (value.value = fn(value.value));
}

function Dog({ value }: { value: Signal<number> }) {
  console.log("--debug--dog", value);
  const fs = useComputed(() => value.value * 2 + "px");
  return (
    <div>
      <div>Dog: {$(value)}</div>
      {value.value > 20 && (
        <div
          id={$(fs)}
          style={{
            fontSize: $(fs),
          }}
        >
          Dog: {$(value)} : {$(fs)}
        </div>
      )}
    </div>
  );
}

export function SignalExample() {
  const value = useSignal(10);
  const handleAdd = () => {
    set(value, (v) => v + 1);
  };
  return (
    <div>
      <Dog value={value}></Dog>
      <div onClick={handleAdd}>add value</div>
    </div>
  );
}
