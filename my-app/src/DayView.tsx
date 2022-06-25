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

type row = { hrs: number; activity: string };
class ActivitiesTable extends React.Component {
  state: { table: row[]; activity: string };

  enterRow(event: any) {}

  handleChange(event: any) {
    this.setState({ activity: event.target.value });

    console.log(this.state.activity);
  }

  handleSubmit(event: any) {
    console.log(this.state.activity);
    let tempA = this.state.table;
    tempA.push({ hrs: 2, activity: this.state.activity });
    this.setState({table: tempA})
    this.setState({activity: ""})
    event.preventDefault();
  }
  constructor(state: any, props: null) {
    super(state);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      table: [
        { hrs: 1, activity: "lala" },
        { hrs: 1, activity: "lala" },
        { hrs: 1, activity: "lala" },
      ],
      activity: "",
    };
    this.enterRow = this.enterRow.bind(this);
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
                <tr id="row">
                  <td>{item.hrs}</td>
                  <td>{item.activity}</td>
                  <td>
                    <button>X</button>
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
              <td> </td>
              <td>
                <button onClick={this.enterRow}>+</button>
              </td>
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
