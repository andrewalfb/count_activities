import { useState } from 'react';
import MenuButton from './MenuButton';
import Button, { ButtonType } from './Button';

import { Menu } from '../models/menu';


type Props = {
    onSelect: (menu: Menu) => void;
};

export default function Sidebar({onSelect}: Props) {
  const [isExpanded, setIsExpanded] = useState(false)

  function handleSelect(menu: Menu) {
    onSelect(menu);
  }; 


  return (
    <nav>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        Menu
        <span className={`indicator ${isExpanded ? 'down' : 'right'}`}>
          &#9650;
        </span>
      </button>

      {isExpanded && (
        <div className='menuList'>
        <Button 
            type={ButtonType.btnSecond} 
            onClick={() => { handleSelect(Menu.main)}}
            title='Main'
        />

        <Button 
            type={ButtonType.btnSecond} 
            onClick={() => { handleSelect(Menu.edit)}}
            title='Edit Hobby'
        />

        <Button
            type={ButtonType.btnSecond}
            onClick={() => handleSelect(Menu.statistics)}
            title="Statistics"
        />


        </div>
      )}
    </nav>
  );
}
