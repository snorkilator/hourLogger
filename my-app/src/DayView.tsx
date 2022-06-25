import * as React from "react";
import { Link } from "react-router-dom";
import "./App.css";
type props = { formID: string };

export class DayView extends React.Component {
  constructor(props: any, state: any) {
    super(props, state);
  }
  render(): React.ReactNode {
    return (
      <>
        <main>
          <h2>July 1st</h2>
          <ActivitiesTable />
          <Form formID="Goals" />
          <Form formID="Summary" />
        </main>
        <nav>
          <Link to="/">Home</Link>
        </nav>
      </>
    );
  }
}

var count: number = 0;
function counter(): number {
  count++;
  return count;
}

var tablecounterlock: boolean = false;

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

type row = { id: number; hrs: number; activity: string };
class ActivitiesTable extends React.Component {
  state: { table: row[]; activity: string };

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

  handleChange(event: any) {
    this.setState({ activity: event.target.value });

    console.log(this.state.activity);
  }

  handleSubmit(event: any) {
    console.log(this.state.activity);
    if (!locked()) {
      lock();
      let tempA = this.state.table;
      tempA.push({ id: counter(), hrs: 2, activity: this.state.activity });
      this.setState({ table: tempA });
      this.setState({ activity: "" });
      unlock();
    } else {
      alert("could not add activity row");
    }
    event.preventDefault();
  }

  constructor(state: any, props: null) {
    super(state);
    this.deleteRow = this.deleteRow.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      table: [],
      activity: "",
    };
  }
  render(): React.ReactNode {
    return (
      <div>
        <table className="activitiesTable">
          <thead>
            <td>HRS</td>
            <td>description</td>
            <td></td>
          </thead>
          <tbody>
            {this.state.table.map((item) => {
              return (
                <tr id={item.id.toString()}>
                  <td>{item.hrs}</td>
                  <td>{item.activity}</td>
                  <td>
                    <button onClick={() => this.deleteRow(item.id)}>X</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td>
                <form>
                  <input type="text" value="4"></input>
                </form>
              </td>
              <td>
                <form onSubmit={this.handleSubmit}>
                  <input
                    type="text"
                    value={this.state.activity}
                    onChange={this.handleChange}
                  ></input>
                </form>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>Total HRS: 7</td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
}

class Form extends React.Component {
  props: props;
  state: { value: string };
  formID: string;
  constructor(props: props) {
    super(props);
    this.props = props;
    this.formID = props.formID;
    this.state = { value: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: any) {
    this.setState({ value: event.target.value });
    console.log(this.state.value);
  }

  handleSubmit(event: any) {
    console.log(this.formID + " " + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>{this.formID}</label>
          <br />
          <textarea value={this.state.value} onChange={this.handleChange} />
          <br />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}
