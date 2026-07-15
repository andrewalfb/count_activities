
import { Activity, useState, useEffect, useRef } from 'react';

import axios from 'axios';
import { useTranslation } from 'react-i18next';

import './App.css';
import { apiConfig } from './config/api'

import Sidebar from './components/SideBar';
import Select from './components/Select';
import Timer from './components/Timer';

import { Hobby, HobbyTime, HobbyDetailsTime } from './models/hobby';
import Button, { ButtonType } from './components/Button';

import DataTable from './components/DataTable';
import { formatTime } from './utils/helpers';

import FormAlert from './components/HobbyWriteForm';

// models and type
import { Menu } from './models/menu';
import { Editor } from './components/Editor';
import { Statistics } from './components/Statistics';


enum State {
  starting = 0,
  selected,
  closeCount,
  startCounting,
  stopCounting,
}



const api = axios.create({
  withCredentials: true
});

function App() {
  const [t,i18n] = useTranslation();

  const [state, setState] = useState(State.starting);
  const [menu, setMenu] = useState<Menu>(Menu.main);

  const [isShowSidebar, setIsShowSidebar] = useState(true);
  
  const [dataHobbies, setDataHobbies] = useState<Hobby[]>([]);
  const [selectedItem, setSelectedItem] =  useState<{id: number; name: string} | null>(null);

  const [dataHobbyTimes, setDataHobbyTimes] = useState<HobbyTime[]>([]);
  const [currentSpentTime, setCurrentSpentTime] = useState(0);
  const [dataHobbyDetailsTime, setDataHobbyDetailsTime] = useState<HobbyDetailsTime[]>([]);

  const initialized = useRef(false);

  useEffect(() => {

    const bootstrap = async () => {
      if (initialized.current) { return };
      initialized.current = true;

      await api.get(apiConfig.endpoints.auth.init());

      await loadHobbies();
    };

    bootstrap().catch(console.error);

  }, []);

  const loadHobbies = async () => {
    const res = await api.get(apiConfig.endpoints.hobby.list());
    const hobbies = res.data.map(
      (h: { id: number; name: string, description: string }) =>
        new Hobby(h.id, h.name, h.description)
    );

    setDataHobbies(hobbies);
  };

  function lookupHobbies(id: number): Hobby | undefined {
    const res = dataHobbies.find(item => {
      return item.id === id
    })

    return res
  }

  function onStopClick(value: number) {
    setCurrentSpentTime(value);  
    setState(State.stopCounting);
  }

  function onSaveHobbyTime(value: number, description: string | undefined) {
    setState(State.selected);
    if (!selectedItem) return;
  
    setCurrentSpentTime(0);

    const json = {
      hobby_id: selectedItem.id,
      spent_time: value,
      description: description
    };

    api.post(apiConfig.endpoints.hobby.addTimes(), json)
    .then((response) => {
      console.log(`responce: ${response}`)
      api.get(apiConfig.endpoints.hobby.times())
        .then((response: { data: HobbyTime[] }) => {
        console.log(response);
        const newHobbyTimes = response.data.map(item => new HobbyTime(item.name, item.description, item.spentTime, item.timestamp));

        setDataHobbyTimes(newHobbyTimes);
      });

    }).catch(error => {
      console.error(`error add time: ${error}`);
    });
  }

  function onResetClick() {
    setState(State.selected);
  }

  function onCloseClick() {
    setState(State.selected);
  } 


  async function handleSubmitForm(name: string, description: string): Promise<boolean> {
    const json = { name: name, description: description }
    try {
      const response = await api.post(apiConfig.endpoints.hobby.addHobby(), json);
      const newHobby = new Hobby(response.data.id, name, description);
      setDataHobbies(prev => [...prev, newHobby]);
      
      return true;
    } catch(error) {
      console.error(`error add hobby: ${error}`);
      
      return false;
    }
  }

  async function handleDelete(hobbyId: number): Promise<boolean> {
    try {
      await api.delete(apiConfig.endpoints.hobby.delete(hobbyId));
      await loadHobbies();

      return true;
    } catch(error: any) {
      console.error(`error delete Hobby: ${error}`);

      return false;
    }
  }

  async function loadTimes(): Promise<boolean> {
    try {
      const res = await api.get(apiConfig.endpoints.hobby.times());
      const times = res.data.map(
        (item: {name: string, description: string, spentTime: number, timestamp: number}) => 
          new HobbyTime(item.name, item.description, item.spentTime, item.timestamp)
      )
      setDataHobbyTimes(times);

      return true;
    } catch(error) {
      console.error(`error getting today activities: ${error}`);

      return false;
    }  
  }

  function handleSelect(value: number) {
    const prop = lookupHobbies(value);
    if (!prop) return;
    setSelectedItem({id: value, name: prop.name});
    setState(State.selected);
  } 

  async function handleShowDetails(hobbyId: number): Promise<boolean> {
    try {
      let response = await api.get(apiConfig.endpoints.hobby.details(), { params: { hobbyId: hobbyId } })
    
      const newHobbyDetails = response.data.map((item: { description: string; spentTime: number; }) => new HobbyDetailsTime(item.description, item.spentTime));
      setDataHobbyDetailsTime(newHobbyDetails);

      return true
    } catch(error) {
      console.error(`error getting details report: ${error}`);

      return false
    }
  }

  function handleUpdateHobby(updated: Hobby) {
    setDataHobbies(prev =>
      prev.map(h => (h.id === updated.id ? updated : h))
    );
  }

  function handleMenu(menu: Menu) {
    switch (menu) {
      case Menu.statistics:
        //  handleShowDetails();
         break;
      default: 
         break;
    };
   
    setMenu(menu);
  };

  function onHandleCancelHobbytime() {
    setState(State.selected);
  }


  const onClickLanguageChange = (e: any) => {
    const language = e.target.value;
    i18n.changeLanguage(language); //change the language
  }

  return (
    <>
      <div className='appLayout'>
        <Activity mode={isShowSidebar ? 'visible' : 'hidden'}>
          <Sidebar onSelect={handleMenu}/>
        </Activity>

        <main>
  
          <div className="topMenu">
            <button onClick={() => setIsShowSidebar(!isShowSidebar)}>
              {t('app.showMenu')}
            </button>
            <select className="custom-select" onChange={onClickLanguageChange}>
              <option value="en" >{t('app.en')}</option>
              <option value="fr" >{t('app.fr')}</option>
              <option value="hy" >{t('app.hy')}</option>
            </select>
        </div>

          <div >

           <Activity mode={menu === Menu.main ? 'visible' : 'hidden'}>
             <div className='columnContent'>
                <label>{t('app.whatWillDo')}</label>
                <Select 
                  items={dataHobbies.map(sel => ({ id: sel.id, name: sel.name }))}
                  onChange={ (value) => {handleSelect(value) }}
                />

                {state === State.selected && (
                  <>
                    <label>{t('app.timerStartLabel', { name: selectedItem?.name ?? '' })}</label>
                    <Button
                      title={t('app.start')}
                      type={ButtonType.btnPrimary}
                      onClick={() => {setState(State.startCounting)}}
                    />
                  </>
                )}

                { state === State.startCounting && selectedItem && (
                  <Timer 
                    id={selectedItem.id} 
                    name={selectedItem.name} 
                    active={true}
                    onStopClick={onStopClick} 
                    onResetClick={onResetClick}
                    onCloseClick={onCloseClick}
                  />
               )}

                { state === State.stopCounting && (
                  <FormAlert 
                    title={t('hobbyWriteForm.whatIsDone')}
                    currentSpentTime={currentSpentTime}
                    onSave={ onSaveHobbyTime }
                    onCancel={ onHandleCancelHobbytime }
                  />
                )}

              </div>
          </Activity> 
          
          <Activity mode={menu === Menu.edit ? 'visible' : 'hidden'} >
            <Editor 
              hobbies={dataHobbies} 
              onUpdateHobby={handleUpdateHobby} 
              onSubmitHobby={handleSubmitForm}
              onDeleteHobby={handleDelete}
            /> 
          </Activity>

            


            <Activity mode={menu === Menu.statistics ? 'visible' : 'hidden'} >
              <Statistics 
                hobbies={dataHobbies} 
                hobbyDetailsTime={dataHobbyDetailsTime} 
                onHobbyDetails={handleShowDetails} 
                hobbyTimes={dataHobbyTimes}
                onHobbyTimes={loadTimes}
              />
            </Activity>

          </div>
        </main>
      </div>
    </>
  );
}

export default App;
