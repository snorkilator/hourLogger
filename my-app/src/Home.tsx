import * as React from "react";
import {pageData} from "./DayView";
import { Link } from "react-router-dom";

export default function Home(props: {pages: [pageData], onChange: any}) {
  const [count, setCount] = React.useState("test");
  let increment = () => {
    setCount(count + 1);
  };
  let decrement = () => {
    setCount(count + 1);
  };
  return (
    <div>
      <main>
        <Table pages={props.pages} />
        <Link to="/dayview">dayview</Link>

      </main>
    </div>
  );
}

function Table(props:{pages: [pageData]}) {
    return (
      <table>
        <thead>
          <td>Summary</td>
          <td>Total HRS</td>
          <td>row ID</td>
        </thead>
        <tbody>
          {props.pages.map((page, ID, a) => {
            let tally = 0;
            if (page.table != undefined) {
              for (let row of page.table) {
                tally += row.hrs + 0;
              }
            }
            return (
              <tr id={ID.toString()}>
                <td> <Link to={"/dayview/"+ new Date().toDateString()}>{page.goals}</Link></td>
                <td>{tally}</td>
                <td>{ID}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
}
