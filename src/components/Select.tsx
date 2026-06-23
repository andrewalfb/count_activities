import { useState } from "react";


interface Props {
    names: string[],
    onChange: (value: string) => void
}


export default function Select({ names, onChange }: Props) {
    const [selected, setSelected] = useState(names[0])


    const rows = names.map ((name) => (
      <option key={name} value={name}>{name}</option>
  ));
  
  return <select 
    className='hobbySelect'
    value={selected}
    onChange={(e) => {
        setSelected(e.target.value);
        onChange(e.target.value);
    }}
  >{rows}</select>
}