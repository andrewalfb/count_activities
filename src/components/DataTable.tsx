import { title } from "process";
import React from "react";

type Column<T> = {
  header: string;
  cell: (row: T) => React.ReactNode;
};


type Props<T> = {
  title?: string; 
  items: T[];
  columns: Column<T>[];
};


export default function DataTable<T>({ 
  title, 
  items, 
  columns, 
}: Props<T> ) {

  return (
    <table className="dataTable">
      <thead>
        { title && (
        <tr className="dataTable__titleRow">
          <th className="dataTable__title" colSpan={columns.length}>
            {title}
          </th>
        </tr>
        )}
        <tr>
          {columns.map((c) => (
            <th key={c.header} className="dataTable__th">
              {c.header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {items.map((row, i) => (
          <tr key={i} className="dataTable__tr">
            {columns.map((c) => (
              <td key={c.header} className="dataTable__td">
                {c.cell(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
