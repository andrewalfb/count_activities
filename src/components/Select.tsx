import { useState } from "react";


type Item = {id: string, name: string}

interface Props {
    items: Item[],
    onChange: (value: string) => void
}


export default function Select({ items, onChange }: Props) {
    const [selected, setSelected] = useState('')


    const rows = items.map ((item) => (
      <option key={item.id} value={item.id}>{item.name}</option>
  ));
  
  return <select 
    className='hobbySelect'
    value={selected}
    onChange={(e) => {
        const id = e.target.value
        setSelected(id);
        onChange(id);
    }}
  >
   <option value='' disabled>
    Select...
   </option>  
    {rows}
  </select>
}