import * as React from "react";
import { Link } from "react-router-dom";
import "./App.css";

type pageData = { goals: string; summary: string; table: row[] };
export let DayView = () => {
  let row: row[] = [];
  const [goals, setGoals] = React.useState("");
  const [summary, setSummary] = React.useState("");
  const [table, setTable] = React.useState(row);

  return (
    <>
      <main>
        <h2>date</h2>
        <ActivitiesTable />
        <Form formID="Goals" value={goals} setState={setGoals} />
        <Form formID="Summary" value={summary} setState={setSummary} />
      </main>
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </>
  );
};
type row = {
  id: number;
  hrs: number;
  activity: string;
};
function ActivitiesTable() {
  let rows: row[] = [];
  let [state, setState] = React.useState({
    table: rows,
    hrs: "",
    activity: "",
  });
  let count: number = 0;
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
    for (let i = 0; i < state.table.length; i++) {
      let row = state.table[i].hrs;
      if (row) {
        console.log(row);
        count += row;
      }
    }
    return count;
  }
  //deleterow deletes row from activity
  function deleteRow(event: any, id: number) {
    console.log(state.table);
    let tempA = state.table;
    for (let i = 0; i < tempA.length; i++) {
      if (tempA[i].id === id) {
        console.log(i);
        tempA.splice(i, 1);
        setState({ table: tempA, activity: state.activity, hrs: state.hrs });
      }
    }
    console.log(state.table);
  }
  //handleChangeActivity updates state of activity on change
  function handleChangeActivity(event: any) {
    setState({
      activity: event.target.value,
      hrs: state.hrs,
      table: state.table,
    });

    console.log(state.activity);
  }

  //handleChangeHrs updates state of hrs on change
  function handleChangeHrs(event: any) {
    setState({
      activity: state.activity,
      hrs: event.target.value,
      table: state.table,
    });

    console.log(state.hrs);
  }

  //handleSubmit adds row entry to activity table
  function handleSubmit(event: any) {
    event.preventDefault();
    console.log(state.activity);
    if (!locked()) {
      lock();
      let tempA = state.table;
      tempA.push({
        id: counter(),
        hrs: Number.parseFloat(state.hrs),
        activity: state.activity,
      });
      setState({ activity: "", hrs: "", table: tempA });
      unlock();
    } else {
      alert("could not add activity row");
    }
    let nextField = document.getElementById("hours");
    if (nextField) {
      nextField.focus();
    }
    // console.log(nextField);
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
  function activityOnEnter(event: any) {
    if (event.keyCode == 13) {
      event.preventDefault();
      handleSubmit(event);
    }
  }

  //renderTable returns a react node with table rows corresponding to the activitytable array elements.
  function renderTable() {
    return state.table.map((item) => {
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
                  value={state.hrs}
                  onChange={handleChangeHrs}
                  onKeyDown={hrsOnEnter}
                ></input>
              </td>
              <td>
                <input
                  id="activity"
                  type="text"
                  value={state.activity}
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
