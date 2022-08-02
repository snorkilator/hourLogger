import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { isPropertySignature } from "typescript";
import { DayView } from "./DayView";
import "./App.css";
import Home from "./Home";
import { pageData } from "./DayView";

/*
Receiving
How does the transaction work?
  initiate the request with get command
  use page date as ID
  send ID in url as page path
    react router link on main page
    link sends you to the page display
      before page displays, do pull from database,
        unwrap into object
          populate state with object
      Display page
      if pull fails, display error message in alert box
When do I want to get current state from server?
- after, sending current state to server with good response
  - do that on time intervols
- Onload of page, receive current DB status
- after a certain amount of changed to the website (nice to have, maybe not necessary) 
*/

export type state = { pages: [pageData] };
export default class App extends React.Component {
  state: state;
  getAll = () => {
    //Dev Flag for console
    let printConsole = false;
    fetch("/getall")
      .then(
        (data) => data.json(),
        (err) => console.log(err)
      )
      .catch((err) => console.log(err))
      .then((data: { data: [pageData] }) => {
        if (data.data[0]) {
          this.setState({ pages: data.data });
          if (printConsole) {
            console.log("writing from fetch to state");
            console.log(data.data);
          }
        }
        if (printConsole) {
          console.log("updated state from fetch:");
          this.setState((state) => console.log(state));
        }
      });
  };
  constructor(props: any) {
    super(props);
    let p = [
      { table: [], goals: "", date: new Date().toDateString() },
    ] as never;
    this.state = { pages: p };
    this.setState = this.setState.bind(this);
    this.getAll = this.getAll.bind(this);
    this.interval = null as unknown as NodeJS.Timer;
  }
  interval: NodeJS.Timer;
  componentDidMount() {
    this.interval = setInterval(() => this.getAll(), 5000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    return (
      <div className="App">
        <h1 className="text-center">Hour Logger</h1>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                pages={this.state.pages}
                setState={this.setState}
                getAll={this.getAll}
              />
            }
          />
          <Route
            path="/dayview/:date"
            element={<DayView state={this.state} setState={this.setState} />}
          />
        </Routes>
      </div>
    );
  }
}

/*

post and put flag
post
   when opening create dayview page

put
    opening directly to dayiew/someDate
    when clicking on link to
*/
