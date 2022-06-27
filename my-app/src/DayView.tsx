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

type row = { id: number; hrs: number; activity: string };
class ActivitiesTable extends React.Component {
  count: number = 0;
  counter(): number {
    this.count++;
    return this.count;
  }

  tablecounterlock: boolean = false;

  //lock locks table counter
  lock() {
    this.tablecounterlock = true;
  }

  //unlock unlocks table counter
  unlock() {
    this.tablecounterlock = false;
  }
  //locked tell you if table counter is locked
  // @returns boolean
  locked(): boolean {
    return this.tablecounterlock;
  }
  state: { table: row[]; hrs: string; activity: string };
  sumHrs(): number {
    let count = 0;
    for (let i = 0; i < this.state.table.length; i++) {
      let row = this.state.table[i].hrs;
      if (row) {
        console.log(row);
        count += row;
      }
    }
    return count;
  }
  //deleterow deletes row from activity
  deleteRow(id: number): boolean {
    let tempA = this.state.table;
    for (let i = 0; i < tempA.length; i++) {
      if (tempA[i].id === id) {
        tempA.splice(i, 1);
        this.setState({ table: tempA });
        return true;
      }
    }
    return false;
  }
  //handleChangeActivity updates state of activity on change
  handleChangeActivity(event: any) {
    this.setState({ activity: event.target.value });

    console.log(this.state.activity);
  }

  //handleChangeHrs updates state of hrs on change
  handleChangeHrs(event: any) {
    this.setState({ hrs: event.target.value });

    console.log(this.state.hrs);
  }

  //handleSubmit adds row entry to activity table
  handleSubmit(event: any) {
    console.log(this.state.activity);
    if (!this.locked()) {
      this.lock();
      let tempA = this.state.table;
      tempA.push({
        id: this.counter(),
        hrs: Number.parseFloat(this.state.hrs),
        activity: this.state.activity,
      });
      this.setState({ table: tempA });
      this.unlock();
    } else {
      alert("could not add activity row");
    }
    event.preventDefault();
  }

  constructor(props: any) {
    super(props);
    this.deleteRow = this.deleteRow.bind(this);
    this.handleChangeActivity = this.handleChangeActivity.bind(this);
    this.handleChangeHrs = this.handleChangeHrs.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sumHrs = this.sumHrs.bind(this);

    this.state = {
      table: [],
      activity: "",
      hrs: "",
    };
  }

  //renderTable returns a react node with table rows corresponding to the activitytable array elements.
  renderTable() {
    return this.state.table.map((item) => {
      return (
        <tr id={item.id.toString()}>
          <td>{item.hrs}</td>
          <td>{item.activity}</td>
          <td>
            <button onClick={() => this.deleteRow(item.id)}>X</button>
          </td>
        </tr>
      );
    });
  }
  render(): React.ReactNode {
    return (
      <div>
        <table className="activitiesTable">
          <thead>
            <td>Hours</td>
            <td>description</td>
          </thead>
          <tbody>{this.renderTable()}</tbody>
          <tfoot>
            <tr>
              <td>
                <input
                  type="number"
                  value={this.state.hrs}
                  onChange={this.handleChangeHrs}
                ></input>
              </td>
              <td>
                <input
                  type="text"
                  value={this.state.activity}
                  onChange={this.handleChangeActivity}
                ></input>
              </td>
              <td>
                <button onClick={this.handleSubmit}>+</button>
              </td>
            </tr>
            <tr>
              <td>
                <div>
                  <div>Total: {this.sumHrs()}</div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
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
