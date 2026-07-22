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
    <>
      { title && (
          <label className="dataTable__title">{title}</label> 
      )}

    <table className="dataTable">
      <thead>
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
  </>
  );
}
