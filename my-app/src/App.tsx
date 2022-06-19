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
          <Toggle />
          <HowWasYourDayForm />
        </main>
        <nav>
          <Link to="/">Home</Link>
        </nav>
      </>
    );
  }
}

class Toggle extends React.Component {
  state: state // creates state property with type state
  handleClick() {    this.setState((prevState: {isToggleOn:boolean}) => ({      isToggleOn: !prevState.isToggleOn    }));  };
  constructor(props: any) { // when new Toggle(arugments) is called, this is run
    super(props); // passes props to component constructo
    // sets state property to initial state
    // prevState: enherited property??
    this.state = {isToggleOn: true, howWasYourDay: ""};
    // This binding is necessary to make `this` work in the callback 
    //method bind() receives function, and take this as parameter
    //    makes it so, in the functions context, 'this' still refers to class object
    this.handleClick = this.handleClick.bind(this);  }

  
  render() {
    return (
      <button onClick={this.handleClick}>        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

class HowWasYourDayForm extends React.Component {
  state: {value: string}
  constructor(props: any){
    super(props)
    this.state = {value: ""}
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleChange(event: any) {
    this.setState({value: event.target.value})
  }
  
  handleSubmit(event: any){
    alert('submitted' + this.state.value);
    event.preventDefault();
  }
  
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>What did you work on today?</label>
        <br />
        <input type="text" value={this.state.value} onChange={this.handleChange} />
        <br />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
