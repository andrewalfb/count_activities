import React from "react";

type Column<T> = {
  header: string;
  cell: (row: T) => React.ReactNode;
};

export default function DataTable<T>({ items, columns }: { 
  items: T[];
  columns: Column<T>[];
}) {

  return (
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
  );
}
