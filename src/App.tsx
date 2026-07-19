
import { Activity, useState, useEffect, useRef } from 'react';

import axios from 'axios';
import { useTranslation } from 'react-i18next';

import './App.css';
import { apiConfig } from './config/api'

import Sidebar from './components/Sidebar/SideBar';
import Select from './components/Select';
import Timer from './components/Timer';

import { Hobby, HobbyTime, HobbyTimeDetail } from './models/hobby';
import Button, { ButtonType } from './components/Button';
import FormAlert from './components/HobbyWriteForm';

// models and type
import { Menu } from './models/menu';
import { Editor } from './components/Editor';
import { Statistics } from './components/Statistics';
import TopModal from './components/Alerts/TopModal';
import { Spinner } from './components/Spinner';
import { sleep } from './utils/helpers';


enum FlowStep {
  Idle = 'idle',
  Timer = 'timer',
  Details = 'details',
  Saving = 'saving',
};

type ServerState = {
  hobbies: Hobby[];
  hobbyTimes: HobbyTime[];
  hobbyTimeDetails: HobbyTimeDetail[];
};

// prepare to reduce flow instead of useState
type State = {
  flow: FlowStep,
  selectedItemId: number | null,
  currentSpentTime: number,
  server: ServerState
}

const api = axios.create({
  withCredentials: true
});




function App() {
  const [t,i18n] = useTranslation();

  const [flowStep, setFlowStep] = useState<FlowStep>(FlowStep.Idle);
  const isTimerActive = flowStep === FlowStep.Timer;
  const isDetailsFormActive = flowStep === FlowStep.Details;
  const isWaiting = flowStep === FlowStep.Saving;


  const [menu, setMenu] = useState<Menu>(Menu.main);

  const [isShowSidebar, setIsShowSidebar] = useState(true);
  const [server, setServer] = useState<ServerState>({
    hobbies: [],
    hobbyTimes: [],
    hobbyTimeDetails: []
  });
  const [selectedHobbyId, setSelectedHobbyId] =  useState<number | null>(null);

  const selectedItem = selectedHobbyId
    ? server.hobbies.find(h => h.id === selectedHobbyId)
    : undefined
  
  const [currentSpentTime, setCurrentSpentTime] = useState(0);




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

    setServer(prev => ({
      ...prev,
      hobbies: hobbies
    }))
  };

  function onStopClick(value: number) {
    setCurrentSpentTime(value);  
    setFlowStep(FlowStep.Details);
  }

  async function onSaveHobbyTime(value: number, description: string | undefined) {
    if (!selectedItem) return;
        const json = {
      hobby_id: selectedItem.id,
      spent_time: value,
      description: description
    };
    
    setFlowStep(FlowStep.Timer);
    setCurrentSpentTime(0);
    setFlowStep(FlowStep.Saving);

    await sleep(3000);

    api.post(apiConfig.endpoints.hobby.addTimes(), json)
    .then((response) => {
      console.log(`responce: ${response}`)
      api.get(apiConfig.endpoints.hobby.times())
        .then((response: { data: HobbyTime[] }) => {
        console.log(response);

        const newHobbyTimes = response.data.map(item => new HobbyTime(item.name, item.description, item.spentTime, item.timestamp));        
        setServer(prev => ({
          ...prev,
          hobbyTimes: newHobbyTimes,
        }));

        setFlowStep(FlowStep.Idle)
      });

    }).catch(error => {
      console.error(`error add time: ${error}`);
      setFlowStep(FlowStep.Details);
    });
  }

  function handleCloseTimer() {
    setFlowStep(FlowStep.Idle);
  } 


  async function handleSubmitForm(name: string, description: string): Promise<boolean> {
    const json = { name: name, description: description }
    try {
      const response = await api.post(apiConfig.endpoints.hobby.addHobby(), json);
      const newHobby = new Hobby(response.data.id, name, description);
      setServer(prev => ({
        ...prev,
        hobbies: [...prev.hobbies, newHobby]})
      );
      
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
      setServer(prev => ({
        ...prev,
        hobbyTimes: times
      }));

      return true;
    } catch(error) {
      console.error(`error getting today activities: ${error}`);

      return false;
    }  
  }

  function handleSelect(value: number) {
    setSelectedHobbyId(value);
  } 

  async function handleShowDetails(hobbyId: number): Promise<boolean> {
    try {
      let response = await api.get(apiConfig.endpoints.hobby.details(), { params: { hobbyId: hobbyId } })
    
      const newHobbyDetails = response.data.map((item: { description: string; spentTime: number; }) => new HobbyTimeDetail(item.description, item.spentTime));
      setServer(prev => ({
        ...prev,
        hobbyTimeDetails: newHobbyDetails
      }));

      return true
    } catch(error) {
      console.error(`error getting details report: ${error}`);

      return false
    }
  }

  async function handleUpdateHobby(updated: Hobby): Promise<boolean> {

    const json = {id: updated.id, name: updated.name, description: updated.description};
    try {
      let ok = await api.post(apiConfig.endpoints.hobby.updateHobby(), json);
      console.log(`result update hobby: ${ok}`);

      setServer(prev => ({
        ...prev,
        hobbies: prev.hobbies.map(item => (item.id === updated.id ? updated : item))
      }))

      return true;
    } catch(error) {
      console.error(`error update Hobby: ${error}`);
      
      return false;
    }
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
    setFlowStep(FlowStep.Idle);
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
          {isWaiting && (
            <div className="overlay">
              <Spinner name={t('statistics.loading')} />
            </div>
          )}

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
                  items={server.hobbies.map(sel => ({ id: sel.id, name: sel.name }))}
                  onChange={ (value) => {handleSelect(value) }}
                />

                { selectedItem && (
                  <>
                    <label>{t('app.timerStartLabel', { name: selectedItem?.name ?? '' })}</label>
                    <Button
                      title={t('app.start')}
                      type={ButtonType.btnPrimary}
                      onClick={() => {setFlowStep(FlowStep.Timer)}}
                    />
                  </>
                )}

                { isTimerActive && selectedItem && (
                  <Timer 
                    id={selectedItem.id} 
                    name={selectedItem.name} 
                    active={isTimerActive}
                    onStopClick={onStopClick} 
                    onCloseClick={handleCloseTimer}
                  />
               )}

                <TopModal
                  open={isDetailsFormActive}
                  onClose={onHandleCancelHobbytime}
                >
                  <FormAlert 
                    title={t('hobbyWriteForm.whatIsDone')}
                    currentSpentTime={currentSpentTime}
                    onSave={ onSaveHobbyTime }
                    onCancel={ onHandleCancelHobbytime }
                  />
                </TopModal>
              </div>
          </Activity> 
          
          <Activity mode={menu === Menu.edit ? 'visible' : 'hidden'} >
            <Editor 
              hobbies={server.hobbies} 
              onUpdateHobby={handleUpdateHobby} 
              onSubmitHobby={handleSubmitForm}
              onDeleteHobby={handleDelete}
            /> 
          </Activity>

            <Activity mode={menu === Menu.statistics ? 'visible' : 'hidden'} >
              <Statistics 
                hobbies={server.hobbies} 
                hobbyDetailsTime={server.hobbyTimeDetails} 
                onHobbyDetails={handleShowDetails} 
                hobbyTimes={server.hobbyTimes}
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
