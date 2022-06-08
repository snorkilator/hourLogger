import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";

export default function App() {
  return (
    <div className="App">
      <h1>Hour Logger</h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="dayview" element={<DayView />} />
      </Routes>
    </div>
  );
}

// App.js
function Home() {
  return (
    <>
      <main>
        <h2>Welcome to the homepage!</h2>
        <p>You can do this, I believe in you.</p>
      </main>
      <nav>
        <Link to="/dayview">view day</Link>
      </nav>
    </>
  );
}

function DayView() {
  return (
    <>
      <main>
        <h2>July 1st</h2>
        <form>
          <label>What did you work on today?</label>
          <br/>
          <input type='text' />
          
        </form>
      </main>
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </>
  );
}