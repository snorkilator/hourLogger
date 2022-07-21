import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { isPropertySignature } from "typescript";
import { DayView } from "./DayView";
import "./App.css";
import Home from "./Home"
import {pageData} from "./DayView";

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


export default class App extends React.Component {

state: { pages: [pageData] };
constructor(props: any){
  super(props)
  let date = new Date()
  let p = [{table: [{id: 0, hrs: 0, activity: ""}], goals: "", date: new Date()}]as never;
  this.state = { pages: p };  

  fetch("/getall").then((data) => {
    data.json().then((data) => {
      this.setState({ pages: data.data });
    });
  });

}
 render(){
  return (
    <div className="App">
      <h1>Hour Logger</h1>
      <Routes>
        <Route path="/" element={<Home pages={this.state.pages} onChange={this.setState} />} />
        <Route path="/dayview/" element={<DayView pages={this.state.pages} onChange={this.setState} />} />
      </Routes>
    </div>
  );
  
 }

}