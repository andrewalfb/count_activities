import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button, { ButtonType } from '../Button';
import { HobbyIcon, StatisticsIcon, TimerIcon } from '../Icons'

import { Menu } from '../../models/menu';
import { MenuItem } from './MenuItem';


type Props = {
    onSelect: (menu: Menu) => void;
};

export default function Sidebar({onSelect}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActive, setIsActive] = useState(Menu.main);
  const [t] = useTranslation();

  function handleSelect(menu: Menu) {
    setIsActive(menu);
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
          <MenuItem 
            icon={TimerIcon} 
            label={t('sidebar.main')}
            active={isActive === Menu.main}  
            onClick={() => {handleSelect(Menu.main)}}      
          />

          <MenuItem 
            icon={HobbyIcon} 
            label={t('sidebar.editHobby')}
            active={isActive === Menu.edit}        
            onClick={() => {handleSelect(Menu.edit)}}
          />

          <MenuItem 
            icon={StatisticsIcon} 
            label={t('sidebar.statistics')}
            active={isActive === Menu.statistics}        
            onClick={() => {handleSelect(Menu.statistics)}}
          />
        </div>
      )}
    </nav>
  );
}
