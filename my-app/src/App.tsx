import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { isPropertySignature } from "typescript";
import { DayView } from "./DayView";
import "./App.css";

export default function App() {
  return (
    <div className="App">
      <h1>Hour Logger</h1>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<DayView />} />
      </Routes>
    </div>
  );
}

function Counter(props: { count: any; increment: any }) {
  return (
    <div>
      {props.count} <button onClick={props.increment}>increment</button>
    </div>
  );
}

function Dounter(props: { count: any; setCount: any }) {
  return <SetToFour count={props.count} setCount={props.setCount} />;
}

let SetToFour = (props: { count: any; setCount: any }) => {
  return (
    <div>
      {props.count} <button onClick={() => props.setCount(4)}>set to 4</button>
    </div>
  );
};

// App.js
function Home() {
  const [count, setCount] = React.useState("test");
  let increment = () => {
    setCount(count + 1);
  };
  let decrement = () => {
    setCount(count + 1);
  };
  return (
    <div>
      <Counter count={count} increment={increment} />
      <Dounter count={count} setCount={setCount} />

      <main>
        <h2>Welcome to the homepage!</h2>
        <p>You can do this, I believe in you.</p>
      </main>

      <nav>
        <Link to="/dayview">view day</Link>
      </nav>
    </div>
  );
}
