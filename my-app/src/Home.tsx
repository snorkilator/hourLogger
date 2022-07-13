import * as React from "react"


// App.js
export default function Home() {
    const [count, setCount] = React.useState("test");
    let increment = () => {
      setCount(count + 1);
    };
    let decrement = () => {
      setCount(count + 1);
    };
    return (
      <div>
  
        <main>
          <h2>Welcome to the homepage!</h2>
          <p>You can do this, I believe in you.</p>
        </main>

      </div>
    );
  }
  