import { SignalExample } from "./signal-example";
import { SubscribExample } from "./subscribe-example";

function App() {
  return (
    <div className="App">
      <div>aaaaa</div>
      SignalExample:
      <SignalExample />
      <div style={{ height: 100 }}></div>
      StateBlockExample:
      <SubscribExample />
    </div>
  );
}

export default App;
