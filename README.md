# signals-react-extends

`@preact/signals-react` extends

## Block

ignore props drilling in now Funtion

```tsx
<Block>{() => <div>{signal.value}</div>}</Block>
```

## setSignal

use immer set signal

```tsx
const obj = signal({ name: "hi" });

setSignal(obj, (v) => (v.name = "hello"));
```

## useSetSignal

Use signal to set function, keep function to useCallback

```tsx
const name = useSignal("");
const setName = useSetSignal(value);

return <UxInput value={name.value} onChange={setName} />;
```

## signalWithStorage

Auto load/saving localStorage in signal change

1. init in root App:

```tsx
function App() {
  // init keep ssr values
  useRootSignal();
  return <Main />;
}
const obj = signalWithStorage({ name: "hi" });
```

2. use signalWithStorage at anywhere

```tsx
const obj = signalWithStorage({ name: "hi" });
```

## useBlockCallback

use `useCallback(fn, [])`

```tsx
const fn = useBlockCallback(() => {});
```
