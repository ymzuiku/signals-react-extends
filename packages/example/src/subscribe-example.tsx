import { useRef } from "react";
import {
  Channel,
  Subscribe,
  SubscribeProvider,
  channel,
  channelWithStorage,
} from "react-subscrib-component";

function Dog({ value, num }: { value: Channel<number>; num: Channel<number> }) {
  console.log("--debug--", "dog");
  const self = useRef(channel(0)).current;
  const valueDouble = () => value() * 2;
  return (
    <div>
      <Subscribe channel={[value, valueDouble]}>
        {(v, b) => (
          <div
            style={{
              fontSize: v + 10,
            }}
          >
            Dog: {v} {b} : {new Date().toISOString()}
            <Subscribe channel={[self]}>{(s) => <div>self:{s}</div>}</Subscribe>
            <Subscribe channel={[num]}>
              {(v) => (
                <div
                  style={{
                    fontSize: v + 10,
                  }}
                >
                  only:number: {v} : {new Date().toISOString()}
                </div>
              )}
            </Subscribe>
          </div>
        )}
      </Subscribe>
      <button onClick={() => self.set(self() + 1)}>add-self</button>
    </div>
  );
}

function Anime({ value, num }: any) {
  return (
    <Subscribe channel={[value]}>
      {() => <Dog value={value} num={num}></Dog>}
    </Subscribe>
  );
}

const numChan = channelWithStorage("dog", 0);

export function SubscribExample() {
  let value = useRef(channel(10)).current;
  let num = useRef(numChan).current;

  console.log("--debug--", "page");

  return (
    <SubscribeProvider>
      <div>
        pgae-time: {Date.now()}
        <Dog value={value} num={num}></Dog>
        <Anime value={value} num={num} />
        <button onClick={() => value.set(value() + 1)}>add value</button>
        <button onClick={() => num.set(num() + 1)}>add num</button>
        <button onClick={() => num.set(5)}>add clear num</button>
      </div>
    </SubscribeProvider>
  );
}
