import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button, { ButtonType } from './Button';

import { Menu } from '../models/menu';


type Props = {
    onSelect: (menu: Menu) => void;
};

export default function Sidebar({onSelect}: Props) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [t] = useTranslation();

  function handleSelect(menu: Menu) {
    onSelect(menu);
  }; 


  return (
    <nav>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {t('sidebar.menu')}
        <span className={`indicator ${isExpanded ? 'down' : 'right'}`}>
          &#9650;
        </span>
      </button>

      {isExpanded && (
        <div className='menuList'>
        <Button 
            type={ButtonType.btnSecond} 
            onClick={() => { handleSelect(Menu.main)}}
            title={t('sidebar.main')}
        />

        <Button 
            type={ButtonType.btnSecond} 
            onClick={() => { handleSelect(Menu.edit)}}
            title={t('sidebar.editHobby')}
        />

        <Button
            type={ButtonType.btnSecond}
            onClick={() => handleSelect(Menu.statistics)}
            title={t('sidebar.statistics')}
        />


        </div>
      )}
    </nav>
  );
}
