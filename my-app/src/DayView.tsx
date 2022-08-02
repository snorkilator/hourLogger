import { log } from "node:console";
import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { isPropertyAccessChain } from "typescript";
import "./App.css";
import type { state } from "./App";
import { setEnvironmentData } from "node:worker_threads";

type row = {
  id: number;
  hrs: number;
  activity: string;
};
let PageID = 0;
export type pageData = { goals: string; table: row[]; date: string };
export let DayView = (props: { state: state; setState: any }) => {
  let newPage = false;
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
  let sendData = () => {
    if (props.state.pages[PageID]) {
      // add error handlingprops.pages[PageID].table[1].activity
      console.log("interval send: " + props.state.pages[PageID].date);
      let table = props.state.pages[PageID].table;
      let JSONStr = JSON.stringify(props.state.pages[PageID]);
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
  };

  // console.log("Rendering DayView with: ");
  // console.log(props.state.pages);

  let main = props.state.pages ? (
    <main>
      <h2>{props.state.pages[PageID].date}</h2>
      <ActivitiesTable
        state={props.state}
        setState={props.setState}
        sendData={sendData}
      />
      <Form
        formID="Goals"
        value={props.state.pages[PageID].goals}
        setState={props.setState}
      />
    </main>
  ) : (
    <main>Loading...</main>
  );
  return (
    <>
      {main}
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </>
  );
};

let count: number = 0;
function ActivitiesTable(props: {
  state: state;
  setState: any;
  sendData: any;
}) {
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
      props.sendData();
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
  //deleterow deletes row from activity
  function deleteRow(id: number) {
    console.log("delete row:" + "Id: " + id.toString());
    let tempA = props.state.pages[PageID].table;
    for (let i = 0; i < tempA.length; i++) {
      if (tempA[i].id === id) {
        console.log(i);
        tempA.splice(i, 1);
        let pages = props.state.pages;
        pages[PageID].table = tempA;
        props.setState({ pages });
      }
    }
    console.log("DeleteRow:");
    console.log(props.state.pages[PageID].table);
    props.sendData();
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
      <form onSubmit={handleSubmit}>
        <table  className="table">
          <thead>
            <td>Hours</td>
            <td>description</td>
          </thead>
          <tbody>
            <TableMap state={props.state} />
            <tr>
              <td>
                <input
                  id="hours"
                  type="number"
                  value={tableEntry.hrs}
                  onChange={handleChangeHrs}
                  onKeyDown={hrsOnEnter}
                ></input>
              </td>
              <td>
                <input
                  id="activity"
                  type="text"
                  value={tableEntry.activity}
                  onChange={handleChangeActivity}
                ></input>
              </td>
              <td>
                <input type="submit" value="+" />
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

//renderTable returns a react node with table rows corresponding to the activitytable array elements.
let TableMap = (props: { state: state }) => {
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
              type="button"
              // onClick={() => deleteRow(item.id)}
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

let Form = (props: { formID: string; value: string; setState: any }) => {
  function handleSubmit(event: any) {
    console.log(props.formID + " " + props.value);
    event.preventDefault();
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>{props.formID}</label>
        <br />
        <textarea
          value={props.value}
          onChange={(event) => props.setState(event.target.value)}
        />
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};
