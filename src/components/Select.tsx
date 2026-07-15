import { useState } from "react";
import { useTranslation } from "react-i18next";


type Item = {id: number, name: string}

interface Props {
    items: Item[],
    onChange: (value: number) => void
}


export default function Select({ items, onChange }: Props) {
  const [t] = useTranslation();  
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
    {t('select.default')}
   </option>  
    {rows}
  </select>
}