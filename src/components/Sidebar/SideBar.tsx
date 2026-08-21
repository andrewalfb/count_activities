import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { HobbyIcon, StatisticsIcon, TimerIcon } from '../Icons'

import { Menu } from '../../models/menu';
import { MenuItem } from './MenuItem';


type Props = {
    onSelect: (menu: Menu) => void;
};

export default function Sidebar({onSelect}: Props) {
  const [isActive, setIsActive] = useState(Menu.main);
  const [t] = useTranslation();

  function handleSelect(menu: Menu) {
    setIsActive(menu);
    onSelect(menu);
  }; 


  return (
    <nav className='contentSidebar'>
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

          <MenuItem
            icon={StatisticsIcon}
            label={t('database.sync')}
            active={isActive === Menu.syncDb}
            onClick={() => {handleSelect(Menu.syncDb)}}
          />
        </div>
    </nav>
  );
}
