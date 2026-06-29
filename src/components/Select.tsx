import { useState } from "react";


type Item = {id: number, name: string}

interface Props {
    items: Item[],
    onChange: (value: number) => void
}


export default function Select({ items, onChange }: Props) {
    const [selected, setSelected] = useState(0)


    const rows = items.map ((item) => (
      <option key={item.id} value={item.id}>{item.name}</option>
  ));
  
  return <select 
    className='hobbySelect'
    value={selected}
    onChange={(e) => {
        const id = Number(e.target.value)
        setSelected(id);
        onChange(id);
    }}
  >
   <option value='' defaultValue=''>
    Select...
   </option>  
    {rows}
  </select>
}