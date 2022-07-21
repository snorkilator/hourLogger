import { log } from "node:console";
import * as React from "react";
import { Link } from "react-router-dom";
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

export type pageData = { goals: string; table: row[]; date: Date };
export let DayView = (props: { pages: [pageData], onChange: any }) => {
  let placeholderpage = props.pages[0];
  if (props.pages[0] == undefined) {
    console.log("undefined");
    placeholderpage = [
      { table: [{ id: 0, hrs: 0, activity: "" }], goals: "", date: new Date() },
    ] as never;
  }
  console.log("dayview state test:" + placeholderpage.table[0].activity);
  let row: row[] = [];
  const [goals, setGoals] = React.useState(placeholderpage.goals);
  const [date, setDate] = React.useState(placeholderpage.date);
  let rows: row[] = [];
  let [rowEntry, setState] = React.useState({
    table: placeholderpage.table,
    hrs: "",
    activity: "",
  });

  let sendData = (newPage: boolean) => {
    // add error handling
    console.log("interval send: " + { goals, date });
    let table = rowEntry.table;
    let JSONStr = JSON.stringify({ goals, date, table });
    let request = new XMLHttpRequest();
    request.open(newPage ? "post" : "put", "/update/");
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", (event) => {
      console.log("message received");
    });
    console.log(JSONStr);
    request.send(JSONStr);
  };
  return (
    <>
      <main>
        <h2>{date.toDateString()}</h2>
        <ActivitiesTable value={rowEntry} temp={placeholderpage.table[0].activity} onChange={setState} />
        <Form formID="Goals" value={goals} setState={setGoals} />
        <button onClick={() => sendData(true)}>POST</button>
        <button onClick={() => sendData(false)}>PUT</button>
      </main>
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </>
  );
};

let count: number = 0;
function ActivitiesTable(props: { value: state; onChange: any, temp: string }) {
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
    for (let i = 0; i < props.value.table.length; i++) {
      let row = props.value.table[i].hrs;
      if (row) {
        console.log(row);
        count += row;
      }
    }
    return count;
  }
  //deleterow deletes row from activity
  function deleteRow(event: any, id: number) {
    // console.log("delete row:" + "Id: " + id.toString());
    let tempA = props.value.table;
    for (let i = 0; i < tempA.length; i++) {
      if (tempA[i].id === id) {
        console.log(i);
        tempA.splice(i, 1);
        props.onChange({
          table: tempA,
          activity: props.value.activity,
          hrs: props.value.hrs,
        });
      }
    }
    console.log(props.value.table);
  }
  //handleChangeActivity updates state of activity on change
  function handleChangeActivity(event: any) {
    props.onChange({
      activity: event.target.value,
      hrs: props.value.hrs,
      table: props.value.table,
    });

    console.log(props.value.activity);
  }

  //handleChangeHrs updates state of hrs on change
  function handleChangeHrs(event: any) {
    props.onChange({
      activity: props.value.activity,
      hrs: event.target.value,
      table: props.value.table,
    });

    console.log(props.value.hrs);
  }

  //handleSubmit adds row entry to activity table
  function handleSubmit(event: any) {
    event.preventDefault();
    console.log(props.value.activity + "counter:" + counter());
    if (!locked()) {
      lock();
      let tempA = props.value.table;
      tempA.push({
        id: counter(),
        hrs: Number.parseFloat(props.value.hrs),
        activity: props.value.activity,
      });
      props.onChange({ activity: "", hrs: "", table: tempA });
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
    return props.value.table.map((item) => {
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
  console.log("ActivityTable rendering" + props.value.table[0].activity);
  return (
    <div>
      <p>{props.temp}</p>
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
                  value={props.value.hrs}
                  onChange={handleChangeHrs}
                  onKeyDown={hrsOnEnter}
                ></input>
              </td>
              <td>
                <input
                  id="activity"
                  type="text"
                  value={props.value.activity}
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
