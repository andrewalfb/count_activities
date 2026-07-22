import { useState } from "react";
import { useTranslation } from "react-i18next";


type Item = {
  id: number, 
  name: string, 
  icon?: React.FC<{ size?: number; color?: string }>;
}

interface Props {
    items: Item[],
    active?: number | null,
    defaultTitle?: string | null,
    onChange: (value: number) => void
}


export default function Select({ 
  items,
  active,
  defaultTitle, 
  onChange 
}: Props) {
  const [t] = useTranslation();  
  const [selected, setSelected] = useState(active ?? 0)

    const rows = items.map ((item) => (
      <option key={item.id} value={item.id}>{item.name}</option>
  ));
  
  return (
    <div className='custom-select-wrap'>
      <select 
        className='custom-select'
        value={selected}
        onChange={(e) => {
            const id = Number(e.target.value)
            setSelected(id);
            onChange(id);
        }}
      >
        { !active && (
          <option value='' defaultValue=''>
            { defaultTitle ? defaultTitle?.toString() : t('select.default')}
          </option>            
        )}

        {rows}
      </select>
    </div>
  );
}