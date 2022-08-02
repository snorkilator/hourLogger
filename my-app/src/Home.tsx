import React from "react";
import { pageData } from "./DayView";
import { Link } from "react-router-dom";
import { setConstantValue } from "typescript";

export default function Home(props: {
  pages: [pageData];
  setState: any;
  getAll: VoidFunction;
}) {
  const [count, setCount] = React.useState("test");
  let increment = () => {
    setCount(count + 1);
  };
  let decrement = () => {
    setCount(count + 1);
  };
  React.useEffect(() => props.getAll(), []);
  return (
    <div>
      <main>
        <Table pages={props.pages} />
        <Link to="/dayview/new">New Page</Link>
      </main>
    </div>
  );
}

function Table(props: { pages: [pageData] }) {
  if (props.pages == null) return <div id="noData">no data</div>;
  return (
    <table className="table">
      <thead>
        {/* <td>Summary</td> */}
        <td>Total HRS</td>
        <td>Date</td>
      </thead>
      <tbody>
        {props.pages.map((page, ID, a) => {
          let tally = 0;
          if (page.table != undefined) {
            for (let row of page.table) {
              tally += row.hrs + 0;
            }
          }
          if (page.table.length !== 0) {
            return (
              <tr id={page.date}>
                {/* <td>{page.date}</td> */}
                <td>{tally}</td>
                <td>
                  {" "}
                  <Link to={"/dayview/" + page.date}>{page.date}</Link>
                </td>
              </tr>
            );
          }
        })}
      </tbody>
    </table>
  );
}
