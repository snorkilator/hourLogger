import { log } from "node:console";
import { ReadableStreamBYOBRequest } from "node:stream/web";
import * as React from "react";
import { Link } from "react-router-dom";
import { isPropertyAccessChain } from "typescript";
import "./App.css";

type row = {
  id: number;
  hrs: number;
  activity: string;
};
type state = {
  table: row[];
  hrs: string;
  activity: string;
};
let PageID = 0;
export type pageData = { goals: string; table: row[]; date: Date };
export let DayView = (props: { pages: [pageData]; setState: any }) => {
  //TODO: make Page ID dynamic
  if (props.pages[0] == undefined) {
    console.log("undefined");
    props.pages = [
      { table: [{ id: 0, hrs: 0, activity: "" }], goals: "", date: new Date() },
    ];
  }
  if (props.pages[0].goals != "flag") {
    props.pages[0].goals = "flag";
    props.setState({ pages: props.pages });
  }

  let sendData = () => {
    // add error handling
    console.log(
      "interval send: " +
        props.pages[PageID].date +
        props.pages[PageID].table[0].activity
    );
    let table = props.pages[PageID].table;
    let JSONStr = JSON.stringify(props.pages[PageID]);
    let request = new XMLHttpRequest();
    request.open("post", "/update/");
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", (event) => {
      console.log("message received");
    });
    console.log(JSONStr);
    request.send(JSONStr);
  };
  sendData();
  return (
    <>
      <main>
        {props.pages[0].goals}
        {/* <h2>{props.pages[placeHolderPageID].date.toDateString()}</h2> */}
        <ActivitiesTable pages={props.pages} setState={props.setState} />
        {/* <Form formID="Goals" value={goals} setState={setGoals} /> */}
      </main>
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </>
  );
};

let count: number = 0;
function ActivitiesTable(props: { pages: [pageData]; setState: any }) {
  let [tableEntry, setTableRow] = React.useState({
    hrs: NaN,
    activity: "enter activitiy",
  });
  let tempPageID = 0;
  function counter(): number {
    count++;
    return count;
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
    for (let i = 0; i < props.pages[tempPageID].table.length; i++) {
      let row = props.pages[tempPageID].table[i].hrs;
      if (row) {
        console.log(row);
        count += row;
      }
    }
    return count;
  }
  //deleterow deletes row from activity
  function deleteRow(event: any, id: number) {
    console.log("delete row:" + "Id: " + id.toString());
    let tempA = props.pages[tempPageID].table;
    for (let i = 0; i < tempA.length; i++) {
      if (tempA[i].id === id) {
        console.log(i);
        tempA.splice(i, 1);
        props.setState(props.pages);
      }
    }
    console.log(props.pages[tempPageID].table);
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
      hrs: event.target.value,
    });

    // console.log(props.pages[PageID].hrs);
  }

  //handleSubmit adds row entry to activity table
  function handleSubmit(event: any) {
    event.preventDefault();
    // console.log(props.pages[PageID].activity + "counter:" + counter());
    if (!locked()) {
      lock();
      let tempTable = props.pages[PageID].table;
      tempTable.push({
        id: counter(),
        hrs: tableEntry.hrs,
        activity: tableEntry.activity,
      });
      let tempPages: [pageData] = props.pages;
      tempPages[PageID].table = tempTable;
      props.setState(tempPages);
      unlock();
    } else {
      alert("could not add activity row");
    }
    let nextField = document.getElementById("hours");
    if (nextField) {
      nextField.focus();
    }
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

  //renderTable returns a react node with table rows corresponding to the activitytable array elements.
  function renderTable() {
    return props.pages[PageID].table.map((item) => {
      return (
        <tr id={item.id.toString()}>
          <td>{item.hrs}</td>
          <td>{item.activity}</td>
          <td>
            <button
              type="button"
              onClick={(event) => deleteRow(event, item.id)}
            >
              X
            </button>
          </td>
        </tr>
      );
    });
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <table className="activitiesTable">
          <thead>
            <td>Hours</td>
            <td>description</td>
          </thead>
          <tbody>
            {renderTable()}
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
