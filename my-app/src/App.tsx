import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { isPropertySignature } from "typescript";
import { DayView } from "./DayView";
import "./App.css";
import Home from "./Home";
import { pageData } from "./DayView";

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
      <div className="container-fluid App">
        <header className="row navbar text-center bg-success">
          <h1 className="display-1">Hour Logger</h1>
        </header>
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