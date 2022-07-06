import { log } from "node:console";
import { ReadableStreamBYOBRequest } from "node:stream/web";
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

type pageData = { goals: string; table: row[]; Date: Date};
export let DayView = () => {
  let row: row[] = [];
  const [goals, setGoals] = React.useState("");
  // const [summary, setSummary] = React.useState("");
  const [table, setTable] = React.useState(row);
  const [date, setDate] = React.useState(new Date())
  let rows: row[] = [];
  let [state, setState] = React.useState({
    table: rows,
    hrs: "",
    activity: "",
  });
  

  let sendData = () => {
    console.log("interval send: " + { goals, state, date});
    let JSONStr = JSON.stringify({ goals, state, date });
    let request = new XMLHttpRequest();
    request.open("put", "/update");
    request.addEventListener('load', event => { console.log("message received")})
    console.log(JSONStr)
    request.send(JSONStr);

  };
  sendData()
  return (
    <>
      <main>
        <h2>{date.toDateString()}</h2>
        <ActivitiesTable value={state} onChange={setState} />
        <Form formID="Goals" value={goals} setState={setGoals} />
      </main>
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </>
  );
};

let count: number = 0;
function ActivitiesTable(props: { value: state; onChange: any }) {
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
