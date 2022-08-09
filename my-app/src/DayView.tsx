import { log } from "node:console";
import * as React from "react";
import { Link, useParams } from "react-router-dom";
import {
  flattenDiagnosticMessageText,
  isPropertyAccessChain,
} from "typescript";
import "./App.css";
import type { state } from "./App";
import { setEnvironmentData } from "node:worker_threads";
import { getSystemErrorMap } from "node:util";

type row = {
  id: number;
  hrs: number;
  activity: string;
};
let PageID = 0;
let newPage = false;
let notSavedFlag = true;
export type pageData = { goals: string; table: row[]; date: string };
export let DayView = (props: { state: state; setState: any }) => {
  // console.log(document.baseURI);
  let params = useParams();
  if (params.date && params.date != "new") {
    console.log("saw date param:");
    console.log(params.date);
    let str = params.date;
    props.state.pages.forEach((value, i) => {
      if (value.date == str) {
        PageID = i;
      }
    });
  }
  if (params.date == "new") {
    // console.log("DayView: newPage");
    props.state.pages = [
      { table: [], goals: "", date: new Date().toDateString() },
    ];
    newPage = true;
  }

  // console.log("Rendering DayView with: ");
  // console.log(props.state.pages);

  let main = props.state.pages ? (
    <main className="container-fluid ">
      <div className="row bg-secondary justify-content-center display-4">
        {props.state.pages[PageID].date}
      </div>
      <div className="row">
        <div className="col-lg-6">
          <ActivitiesTable state={props.state} setState={props.setState} />
        </div>
        <div className="col-lg-6">
          <Form formID="Goals" state={props.state} setState={props.setState} />
        </div>
      </div>
    </main>
  ) : (
    <main>Loading...</main>
  );
  return (
    <div className="">
      {main}
      <nav>
        <Link className="col-lg-2 pull-lg-4 btn bg-success" to="/">
          Home
        </Link>
      </nav>
    </div>
  );
};
let NotSaved = () => {
  if (notSavedFlag) {
    return (
      <div className="row justify-content-center">
        <div className="col-sm-4 btn bg-warning">
          Warning: Changes to Goals are not saved, click submit button
        </div>
      </div>
    );
  }
  return <div className="row bg-success">Field is up saved</div>;
};
let count: number = 0;
function ActivitiesTable(props: { state: state; setState: any }) {
  let [tableEntry, setTableRow] = React.useState({
    hrs: NaN,
    activity: "enter activitiy",
  });
  function counter(): number {
    count++;
    return count;
  }
  //handleSubmit adds row entry to activity table
  function handleSubmit(event: any) {
    event.preventDefault();
    // console.log(props.pages[PageID].activity + "counter:" + counter());
    if (!locked()) {
      lock();
      let tempTable = props.state.pages[PageID].table;
      console.log("adding row: " + tableEntry.hrs);
      tempTable.push({
        id: counter(),
        hrs: tableEntry.hrs,
        activity: tableEntry.activity,
      });

      let tempPages = props.state.pages;
      tempPages[PageID].table = tempTable;
      props.setState(tempPages);
      setTableRow({
        hrs: NaN,
        activity: "enter activitiy",
      });
      console.log("adding row: " + props.state.pages[PageID].table[0].hrs);
      props.setState((state: state) => {
        // console.log(state.pages[PageID].table[0].hrs || NaN);
        sendData(state);
      });
      unlock();
    } else {
      alert("could not add activity row");
    }
    let nextField = document.getElementById("hours");
    if (nextField) {
      nextField.focus();
    }

    props.setState((value: state) => {
      // console.log("after Adding row:");
      // console.log(value.pages[PageID].table);
      return value;
    });
  }

  let tablecounterlock: boolean = false;

  //lock locks table counter
  function lock() {
    tablecounterlock = true;
  }

  //unlock unlocks table counter
  function unlock() {
    tablecounterlock = false;
  }
  //locked tell you if table counter is locked
  // @returns boolean
  function locked(): boolean {
    return tablecounterlock;
  }

  function sumHrs(): number {
    let count = 0;
    for (let i = 0; i < props.state.pages[PageID].table.length; i++) {
      let row = props.state.pages[PageID].table[i].hrs;
      if (row) {
        console.log(row);
        count += row;
      }
    }
    return count;
  }

  //handleChangeActivity updates state of activity on change
  function handleChangeActivity(event: any) {
    setTableRow({
      activity: event.target.value,
      hrs: tableEntry.hrs,
    });

    // console.log(props.value[tempPageID].activity);
  }

  //handleChangeHrs updates state of hrs on change
  function handleChangeHrs(event: any) {
    setTableRow({
      activity: tableEntry.activity,
      hrs: parseFloat(event.target.value),
    });

    // console.log(props.pages[PageID].hrs);
  }

  function hrsOnEnter(event: any) {
    if (event.keyCode == 13) {
      event.preventDefault();
      let nextField = document.getElementById("activity");
      if (nextField) {
        nextField.focus();
      }
    }
  }

  // console.log(
  //   "ActivityTable rendering" + props.pages[PageID].table[0].activity
  // );
  return (
    <div>
      <form className=" form-group" onSubmit={handleSubmit}>
        <table className="table">
          <thead>
            <td>Hours</td>
            <td>description</td>
          </thead>
          <tbody>
            <TableMap state={props.state} setState={props.setState} />
            <tr>
              <td>
                <input
                  className="form-control"
                  id="hours"
                  type="number"
                  value={tableEntry.hrs}
                  onChange={handleChangeHrs}
                  onKeyDown={hrsOnEnter}
                ></input>
              </td>
              <td>
                <input
                  className="form-control"
                  id="activity"
                  type="text"
                  value={tableEntry.activity}
                  onChange={handleChangeActivity}
                ></input>
              </td>
              <td>
                <input
                  className="form-control btn btn-outline-secondary"
                  type="submit"
                  value="+"
                />
              </td>
            </tr>
          </tbody>
          <tfoot>
            <td>Total: {sumHrs()}</td>
          </tfoot>
        </table>
      </form>
    </div>
  );
}

function sendData(state: state) {
  if (state.pages[PageID]) {
    // add error handlingprops.pages[PageID].table[1].activity
    console.log("interval send: " + state.pages[PageID].date);
    let JSONStr = JSON.stringify(state.pages[PageID]);
    let request = new XMLHttpRequest();
    request.open(newPage ? "post" : "put", "/update/");
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", (event) => {
      console.log("XHR Status code: ", request.status);
      if (request.status === 409) {
        alert("The page you are trying to create already exists");
      }
    });
    console.log("SENDDATA:");
    console.log(newPage ? "post" : "put");
    console.log(JSONStr);
    request.send(JSONStr);
  }
}

//deleterow deletes row from activity
function deleteRow(id: number, state: state, setState: any) {
  console.log("delete row:" + "Id: " + id.toString());
  let tempA = state.pages[PageID].table;
  for (let i = 0; i < tempA.length; i++) {
    if (tempA[i].id === id) {
      console.log(i);
      tempA.splice(i, 1);
      let pages = state.pages;
      pages[PageID].table = tempA;
      setState({ pages });
    }
  }
  console.log("DeleteRow:");
  console.log(state.pages[PageID].table);
  sendData(state);
}

//renderTable returns a react node with table rows corresponding to the activitytable array elements.
let TableMap = (props: { state: state; setState: any }) => {
  let rows = props.state.pages[PageID].table.map((item) => {
    console.log(
      "DayView: renderTable: updating table with row" + item.id + item.activity
    );
    if (item != null) {
      return (
        <tr id={item.id.toString()}>
          <td>{item.hrs}</td>
          <td>{item.activity}</td>
          <td>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => deleteRow(item.id, props.state, props.setState)}
            >
              X
            </button>
          </td>
        </tr>
      );
    } else {
      console.log("DayView: renderTable: map is empty");
      return (
        <tr>
          <td>No entries... yet, time to get some shit done!</td>
          <td>empty</td>
          <td>emtry</td>
        </tr>
      );
    }
  });
  return <>{rows}</>;
};

//not modular currently!!
let Form = (props: { formID: string; state: state; setState: any }) => {
  function updateGoal(event: any, state: state, setState: any) {
    let tempState = state;
    tempState.pages[PageID].goals = event.target.value;
    setState((state: state) => {
      console.log("Update Goals before:");
      console.log(state.pages[PageID].goals);
      return tempState;
    });
    setState((state: state) => {
      console.log("updateGoals after:");
      console.log(state.pages[PageID].goals);
    });
  }

  return (
    <div className="row">
      <form
        onSubmit={(event) => event.preventDefault()}
        onChange={(event) => updateGoal(event, props.state, props.setState)}
        className="form text-center"
      >
        <label>{props.formID}</label>
        <br />
        <textarea
          className="form-control"
          value={props.state.pages[PageID].goals}
          onChange={(event) => props.setState({} as state)}
        />
        <br />
        <NotSaved />
        <input
          className="btn btn-outline-secondary"
          type="submit"
          value="Submit"
        />
      </form>
    </div>
  );
};

// React.useEffect
//
// local form State
//
// global state
//
// get current global state and set it to goals on component Mount
// when globalstate.goals changes update local state (useeffect(updatefunction, goals))
// on form change update local
// on submit update global and call sendData
//
// changes not saved System
// up to date flag
// onmount get current global state
// function that shows warning and asks if you want to save progress on goals form
// little indicator above goals form
// onchange upToDate flag is false
// on sendData upToDate is true
// (ideally only when goals is mismatched with DB (or at least global state) upToDate is false)
// Watch video on autosave. like youtube what docs does for this feature
