import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { isPropertySignature } from "typescript";
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

type Props = {};

type state = {
  isToggleOn: boolean;
  howWasYourDay: string;
};

class DayView extends React.Component {
  render(): React.ReactNode {
    return (
      <>
        <main>
          <h2>July 1st</h2>
          <Form formID="Goals" />
          <Form formID="Summary" />
        </main>
        <nav>
          <Link to="/">Home</Link>
        </nav>
      </>
    );
  }
}

type props = {formID: string}
class Form extends React.Component {
 
  props: props;
  state: { value: string };
  formID: string;
  constructor(props: props) {
    super(props);
    this.props = props
    this.formID = props.formID;
    this.state = { value: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: any) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event: any) {
    console.log(this.formID + " " + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>{this.formID}</label>
        <br />
        <textarea value={this.state.value} onChange={this.handleChange} />
        <br />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
