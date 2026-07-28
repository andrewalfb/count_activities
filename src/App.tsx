
import { useEffect, useRef, useReducer } from 'react';

import axios from 'axios';
import { useTranslation } from 'react-i18next';

import './App.css';
import { apiConfig } from './config/api'

import Sidebar from './components/Sidebar/SideBar';
import Select from './components/Select';
import Timer from './components/Timer';

import { Hobby, HobbyTime, HobbyTimeDetail } from './models/hobby';
import Button from './components/Button';
import FormAlert from './components/HobbyWriteForm';

// models and type
import { Menu, TopMenu } from './models/menu';
import { EditorPage } from './components/pages/EditorPage';
import { StatisticsPage } from './components/pages/StatisticsPage';
import TopModal from './components/Alerts/TopModal';
import { Spinner } from './components/Spinner';
import { sleep } from './utils/helpers';
import { MainPage } from './components/pages/MainPage';

type Language = {
id: number,
lang: string,
name: string
}

enum FlowStep {
  Idle = 'idle',
  TopMenu = 'top_menu',
  Timer = 'timer',
  Details = 'details',
  Saving = 'saving',
};


type ServerState = {
  hobbies: Hobby[];
  hobbyTimes: HobbyTime[];
  hobbyTimeDetails: HobbyTimeDetail[];
};

export type State = {
  flow: FlowStep,
  selectedItemId: number | null,
  currentSpentTime: number,
  timerActive: boolean,
  server: ServerState,
  menu: Menu,
  topMenu: TopMenu | null,
}

export type Action = 
  | { type: 'MENU_SELECT_HOBBY'; id: number | null }
  | { type: 'TOP_MENU_INSTALL', topMenu: TopMenu }
  | { type: 'TIMER_START'}
  | { type: 'TIMER_STOP', spent: number }
  | { type: 'TIMER_CANCEL'}
  | { type: 'TIMER_RESET'}
  | { type: 'SAVE_START' }
  | { type: 'SAVE_SUCCESS', hobbyTimes: HobbyTime[] }
  | { type: 'SAVE_ERROR' }
  | { type: 'CANCEL_DETAILS' }
  | { type: 'LOAD_HOBBIES', hobbies: Hobby[] }
  | { type: 'ADD_HOBBY', hobby: Hobby}
  | { type: 'UPDATE_HOBBY', hobby: Hobby}
  | { type: 'LOAD_DETAILS', details: HobbyTimeDetail[] }
  | { type: 'SET_MENU', menu: Menu };



  const initialState: State = {
    flow: FlowStep.Idle,
    selectedItemId: null,
    currentSpentTime: 0,
    timerActive: false,
    server: { hobbies: [], hobbyTimes: [], hobbyTimeDetails: []},
    menu: Menu.main, 
    topMenu: null,
  };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'MENU_SELECT_HOBBY':
      return { ...state, selectedItemId: action.id, flow: FlowStep.Idle };
    case 'TOP_MENU_INSTALL':
      return { ...state, topMenu: action.topMenu, flow: FlowStep.TopMenu };
    case 'TIMER_START':
      return { ...state, flow: FlowStep.Timer, timerActive: true, currentSpentTime: 0}
    case 'TIMER_STOP':
      return { ...state, currentSpentTime: action.spent, flow: FlowStep.Details, timerActive: false
      };
    case 'TIMER_CANCEL':
      return { ...state, flow: FlowStep.Idle, timerActive: false}
    case 'TIMER_RESET':
      return { ...state, timerActive: false, flow: FlowStep.Timer}
    case 'SAVE_START':
      return { ...state, flow: FlowStep.Saving };
    case 'SAVE_SUCCESS':
      return {
        ...state,
        flow: FlowStep.Idle,
        currentSpentTime: 0,
        server: { ...state.server, hobbyTimes: action.hobbyTimes },
      };
    case 'SAVE_ERROR':
      return { ...state, flow: FlowStep.Details };
    case 'CANCEL_DETAILS':
      return { ...state, flow: FlowStep.Idle };
    case 'LOAD_HOBBIES':
      return { ...state, server: { ...state.server, hobbies: action.hobbies } };
    case 'ADD_HOBBY': 
      return { 
        ...state, 
        server: {
          ...state.server,
          hobbies: [...state.server.hobbies, action.hobby]  
        }};
    case 'UPDATE_HOBBY': 
        return {
          ...state,
          server: {
            ...state.server,
            hobbies: state.server.hobbies.map(h => (h.id === action.hobby.id ? action.hobby : h))
          }
        };
    case 'LOAD_DETAILS':
      return { ...state, server: { ...state.server, hobbyTimeDetails: action.details } };
    case 'SET_MENU':
      return { ...state, menu: action.menu };
    
    default:
      return state;
  }
}

const api = axios.create({
  withCredentials: true
});




function App() {
  const [t,i18n] = useTranslation();

  const [state, dispatch] = useReducer(reducer, initialState)
  const isDetailsFormActive = state.flow === FlowStep.Details;
  const isWaiting = state.flow === FlowStep.Saving;

  const selectedItem = state.selectedItemId
    ? state.server.hobbies.find(h => h.id === state.selectedItemId)
    : undefined

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

  function handleMenu(menu: Menu) {
    switch (menu) {
      case Menu.statistics:
        //  handleShowDetails();
         break;
      default: 
         break;
    };
   
    dispatch({ type: 'SET_MENU', menu: menu});
  };

  const loadHobbies = async () => {
    const res = await api.get(apiConfig.endpoints.hobby.list());

    dispatch({type: 'LOAD_HOBBIES', hobbies: res.data})
  };

  // Timer
  function onHandleCancelHobbytime() {
    dispatch({type: 'TIMER_CANCEL'});
  };

  function handleTimerStart() {
    dispatch({ type: 'TIMER_START'});
  }

  function handleTimerStop(value: number) {
    dispatch({type: 'TIMER_STOP', spent: value});
  };

  function handleTimerCancel() {
    dispatch({ type: 'CANCEL_DETAILS'});
  } ;

  function handleTimerReset() {
    dispatch({ type: 'TIMER_RESET'})
  };

  async function onSaveHobbyTime(value: number, description: string | undefined) {
    if (!selectedItem) return;
        const json = {
      hobby_id: selectedItem.id,
      spent_time: value,
      description: description
    };

    dispatch({ type: 'SAVE_START'});

    await sleep(1000);

    api.post(apiConfig.endpoints.hobby.addTimes(), json)
    .then((response) => {
      console.log(`responce: ${response}`)
      api.get(apiConfig.endpoints.hobby.times())
        .then((response: { data: HobbyTime[] }) => {
        console.log(response);
        dispatch({type: 'SAVE_SUCCESS', hobbyTimes: response.data});
      });

    }).catch(error => {
      console.error(`error add time: ${error}`);
      dispatch({type: 'SAVE_ERROR'});
    });
  }



  async function handleSubmitForm(name: string, description: string): Promise<boolean> {
    const json = { name: name, description: description }
    try {
      const response = await api.post(apiConfig.endpoints.hobby.addHobby(), json);
      const newHobby = new Hobby(response.data.id, name, description);
      dispatch({type: 'ADD_HOBBY', hobby: newHobby});
      
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
      dispatch({type: 'SAVE_SUCCESS', hobbyTimes: times});

      return true;
    } catch(error) {
      console.error(`error getting today activities: ${error}`);

      return false;
    }  
  }

  async function handleShowDetails(hobbyId: number): Promise<boolean> {
    try {
      let response = await api.get(apiConfig.endpoints.hobby.details(), { params: { hobbyId: hobbyId } })
    
      const newHobbyDetails = response.data.map((item: { hobby: string, description: string; spentTime: number; }) => new HobbyTimeDetail(item.hobby, item.description, item.spentTime));

      dispatch({type: 'LOAD_DETAILS', details: newHobbyDetails});

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
      dispatch({type: 'UPDATE_HOBBY', hobby: updated});

      return true;
    } catch(error) {
      console.error(`error update Hobby: ${error}`);
      
      return false;
    }
  }

  const languages: Language[] = [
      { id: 1, lang: 'en', name: t('app.en') },
      { id: 2, lang: 'fr', name: t('app.fr')},
      { id: 3, lang: 'hy', name: t('app.hy')}
    ];

  function handleLanguageChange(value: number | null) {
    if (!value) return;

    const language = languages.find(h => value === h.id); 
    i18n.changeLanguage(language?.lang); 
  }

  return (
    <>
      <div className='appLayout'>
        <div className='sidebarSlot'>
            <Sidebar onSelect={handleMenu}/>
        </div>
        {isWaiting && <Spinner name={t('statistics.loading')} />}

        <main className='contentMainArea'>
          <div className="contentCard">

            {/* TOP MENU /page aware/ */}
            <div className="topMenu">
            
                { state.topMenu?.actions.map(a => (
                  <Button
                    key={a.id}
                    style={a.style}
                    title={a.title}
                    enabled={a.active || (state.selectedItemId != null)}
                    onClick={a.onClick}
                  />))
                }  

                <div style={{marginLeft: 'auto'}}>
                  <Select
                    items={languages.map(language => ({id: language.id, name: language.name}))}
                    active={languages[0].id}
                    defaultTitle={null}   
                    onChange={(value) => handleLanguageChange(value)}
                  />      
                </div>
            </div>

                {/* PAGE CONTENT */}
            <div>
              { state.menu === Menu.main && (
                <div className="menuPage">
                  <MainPage 
                    selectedHobbyId={state.selectedItemId}
                    state={state}
                    dispatch={dispatch}
                    
                  />

                  <TopModal open={state.flow === FlowStep.Timer} onClose={handleTimerCancel}>
                    <Timer
                      name={selectedItem?.name ?? 'none'}
                      active={state.timerActive}
                      onStartClick={handleTimerStart}
                      onStopClick={handleTimerStop}
                      onCancelClick={handleTimerCancel}
                      onResetClick={handleTimerReset}
                    />
                  </TopModal>

                  <TopModal open={isDetailsFormActive} onClose={onHandleCancelHobbytime}>
                    <FormAlert
                      title={t('hobbyWriteForm.whatIsDone')}
                      currentSpentTime={state.currentSpentTime}
                      onSave={onSaveHobbyTime}
                      onCancel={onHandleCancelHobbytime}
                    />
                  </TopModal>
                </div>
              )}

            

              <div>
                { state.menu === Menu.edit && (
                <div className='menuPage'>
                  <EditorPage
                    selectedHobbyId={state.selectedItemId}
                    state={state}
                    dispatch={dispatch}
                    onUpdateHobby={handleUpdateHobby}
                    onSubmitHobby={handleSubmitForm}
                    onDeleteHobby={handleDelete}
                  />
                </div>                  
                )}
              </div>


              <div>
                { state.menu === Menu.statistics && (
                <div className='menuPage'>
                <StatisticsPage
                  selectedHobbyId={state.selectedItemId}
                  state={state}
                  dispatch={dispatch}
                  hobbyDetailsTime={state.server.hobbyTimeDetails}
                  onHobbyDetails={handleShowDetails}
                  hobbyTimes={state.server.hobbyTimes}
                  onHobbyTimes={loadTimes}
                />                  
                </div>                  
                )}
              </div>
            </div>
          </div>
        </main>


      </div>
    </>
  );
}

export default App;
