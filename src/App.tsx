
import { useEffect, useRef, useReducer, useState, useMemo } from 'react';


import { useTranslation } from 'react-i18next';

import './App.css';

import Sidebar from './components/Sidebar/SideBar';
import Select from './components/Select';

import { Hobby, HobbyTime, HobbyTimeDetail } from './models/hobby';
import Button, { ButtonStyle } from './components/Button';
import FormAlert from './components/HobbyWriteForm';

// models and type
import { Menu } from './models/menu';
import { EditorPage } from './components/pages/EditorPage';
import { StatisticsPage } from './components/pages/StatisticsPage';
import TopModal from './components/Alerts/TopModal';
import { Spinner } from './components/Spinner';

import { MainPage } from './components/pages/MainPage';
import { FlowStep, reducer, State } from './hooks/taskReducer';
import { dbManager } from './utils/db';
import TimerDisplay from './components/TimerDisplay';
import { formatTime } from './utils/helpers';
import { pauseIcon, startIcon, stopIcon } from './components/Icons';


function App() {
  const [t, i18n] = useTranslation();

  const [state, dispatch] = useReducer(reducer, initialState)
  const isWaiting = state.flow === FlowStep.Saving;

  const selectedItem = state.selectedItemId
    ? state.server.hobbies.find(h => h.id === state.selectedItemId)
    : undefined

  const initialized = useRef(false);

// new timer behaviour---start

const intervalRef = useRef<number | null>(null);
const startStampRef = useRef<number | null>(null); 
const elapsedBeforeRef = useRef<number>(0); 

const [now, setNow] = useState(() => Date.now());

const secondsPass = useMemo(() => {
  if (startStampRef.current == null) return elapsedBeforeRef.current;
  return elapsedBeforeRef.current + (now - startStampRef.current) / 1000;
}, [now]);

useEffect(() => {
  if (!state.timerActive) {
    if (intervalRef.current != null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return;
  }

  if (startStampRef.current == null) {
    startStampRef.current = Date.now();
  }

  intervalRef.current = window.setInterval(() => {
    setNow(Date.now());
  }, 1000);

  return () => {
    if (intervalRef.current != null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
}, [state.timerActive]);

useEffect(() => {
  if (state.flow === FlowStep.Idle && !state.timerActive) {
    elapsedBeforeRef.current = state.currentSpentTime;
    startStampRef.current = null;
    setNow(Date.now());
  }
}, [state.flow, state.timerActive]);
// --------new timer behaviour-----------End


  useEffect(() => {
    dispatch({
      type: 'SET_LANGUAGE',
      language: i18n.language
    })
  }, [i18n.language]);

  useEffect(() => {

    const bootstrap = async () => {
      if (initialized.current) { return };
      initialized.current = true;

      await dbManager.initAnonAuth();
      await loadHobbies();
    };

    bootstrap().catch(console.error);

    (async () => {
      await dbManager.initDb();
    })();

  }, []);

  function handleMenu(menu: Menu) {
    dispatch({ type: 'SET_MENU', menu: menu });
  };

  const loadHobbies = async () => {
    const res = await dbManager.getHobbiesList();
    dispatch({ type: 'LOAD_HOBBIES', hobbies: res });
  };

  // Timer--Start
  function onHandleCancelHobbytime() {
    startStampRef.current = null;
    elapsedBeforeRef.current = 0;
    dispatch({ type: 'TIMER_CANCEL' });
  };

  function handleTimerStart() {
    if (startStampRef.current == null) {
      startStampRef.current = Date.now();
    }
    elapsedBeforeRef.current = 0;

    dispatch({ type: "TIMER_START" });
  }

  function handleTimerResume() {
    if (startStampRef.current == null) {
      startStampRef.current = Date.now();
    }
    elapsedBeforeRef.current = state.currentSpentTime;

    dispatch({ type: "TIMER_START" });
  }


function freezeElapsedSeconds() {
  const startStamp = startStampRef.current;
  if (startStamp == null) return elapsedBeforeRef.current;

  const finalSeconds =
    elapsedBeforeRef.current + (Date.now() - startStamp) / 1000;

  elapsedBeforeRef.current = finalSeconds;
  startStampRef.current = null;

  return finalSeconds;
}

function handleTimerStop() {
  const spent = freezeElapsedSeconds();
  dispatch({ type: "TIMER_STOP", spent: spent });
}

function handleTimerPause() {
  const spent = freezeElapsedSeconds();
  dispatch({ type: 'TIMER_PAUSE', spent: spent });
}

function handleTimerReset() {
  elapsedBeforeRef.current = 0;
  startStampRef.current = null;
  setNow(Date.now());

  dispatch({ type: "TIMER_RESET" });
}

function handleTimerClose() {
  dispatch({ type: 'TIMER_DISPLAY_CLOSE' });
}

  //Timer----end

  async function onSaveHobbyTime(value: number, description: string | undefined) {
    if (!selectedItem) return;

    dispatch({ type: 'SAVE_START' });

   const newDescription = (description?.length === 0 ? selectedItem.description : description) ?? selectedItem.description;
    try {
      const responseAdd = await dbManager.setHobbyTime(
        selectedItem.id, 
        value, 
        newDescription
      );
      const responseTimes = await dbManager.getHobbyTimeList();
      console.log(`addTime: ${responseAdd}, ${responseTimes}`);
      dispatch({ type: 'SAVE_SUCCESS', hobbyTimes: responseTimes });
    } catch (error) {
      console.error(`error add time: ${error}`);
      dispatch({ type: 'SAVE_ERROR' });
    };
  }


  async function handleSubmitForm(name: string, description: string): Promise<boolean> {
    const json = { name: name, description: description }
    try {
      const newHobby = await dbManager.addHobby(name, description);
      dispatch({ type: 'ADD_HOBBY', hobby: newHobby });

      return true;
    } catch (error) {
      console.error(`error add hobby: ${error}`);

      return false;
    }
  }

  async function handleDelete(hobbyId: number): Promise<boolean> {
    try {
      await dbManager.deleteHobby(hobbyId);
      await loadHobbies();

      return true;
    } catch (error: any) {
      console.error(`error delete Hobby: ${error}`);

      return false;
    }
  }

  async function getSpentTimesToday(): Promise<boolean> {
    try {
      const times = await dbManager.getHobbyTimeList();

      dispatch({ type: 'SAVE_SUCCESS', hobbyTimes: times });

      return true;
    } catch (error) {
      console.error(`error getting today activities: ${error}`);

      return false;
    }
  }

  async function handleShowDetails(hobbyId: number): Promise<boolean> {
    try {
      let newHobbyDetails = await dbManager.getDetailsSpentTimes(hobbyId);

      dispatch({ type: 'LOAD_DETAILS', details: newHobbyDetails });

      return true
    } catch (error) {
      console.error(`error getting details report: ${error}`);

      return false
    }
  }

  async function handleShowRange(hobbyId: number, startDate: Date, endDate: Date) {
    try {
      let newHobbyRangeReport = await dbManager.getSpentTimeRange(startDate, endDate, hobbyId);
      if (newHobbyRangeReport.length == 0) {
        return false;
      }
      dispatch({ type: 'LOAD_RANGE_REPORT', details: newHobbyRangeReport});

      return true
    } catch (error) {
      console.error(`error getting range details report: ${error}`);

      return false
    }
  }


  async function handleUpdateHobby(updated: Hobby): Promise<boolean> {

    const json = { id: updated.id, name: updated.name, description: updated.description };
    try {
      let ok = await dbManager.updateHobby(updated.id, updated.name, updated.description);
      console.log(`result update hobby: ${ok}`);
      dispatch({ type: 'UPDATE_HOBBY', hobby: updated });

      return true;
    } catch (error) {
      console.error(`error update Hobby: ${error}`);

      return false;
    }
  }

  const languages: Language[] = [
    { id: 1, lang: 'en', name: t('app.en') },
    { id: 2, lang: 'fr', name: t('app.fr') },
    { id: 3, lang: 'hy', name: t('app.hy') }
  ];

  function handleLanguageChange(value: number | null) {
    if (!value) return;

    const language = languages.find(h => value === h.id);
    i18n.changeLanguage(language?.lang);
  }

const timerLabel = formatTime(secondsPass); 

  return (
    <>
      <div className='appLayout'>
        <div className='sidebarSlot'>
          <Sidebar onSelect={handleMenu} />
        </div>
        {isWaiting && <Spinner name={t('statistics.loading')} />}

        <main className='contentMainArea'>
          <div className="contentCard">

            {/* TOP MENU /page aware/ */}
            <div className="topMenu">

              {state.topMenu?.actions.map(a => (
                <Button
                  key={a.id}
                  style={a.style}
                  title={a.getTitle()}
                  enabled={a.active || (state.selectedItemId != null)}
                  onClick={a.onClick}
                />))
              }
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
              { state.timerOnMenu && 
                <div className="miniTimer">
                  <span className="miniTimerValue">{timerLabel}</span>
                  <Button
                    icon={state.timerActive ? stopIcon : startIcon }
                    title={t('timer.stop')}
                    style={ButtonStyle.Icon}
                    onClick={state.timerActive ? handleTimerStop : handleTimerResume }
                  />
                  { state.timerActive &&
                  
                    <Button
                      icon={pauseIcon}
                      title={t('timer.stop')}
                      style={ButtonStyle.Icon}
                      onClick={handleTimerPause}
                    />
                  }
                </div>
              }

              <Select
                items={languages.map((language) => ({ id: language.id, name: language.name }))}
                active={languages[0].id}
                defaultTitle={null}
                onChange={(value) => handleLanguageChange(value)}
              />
            </div>

            </div>
            {/* PAGE CONTENT */}
            <div>
              {state.menu === Menu.main && (
                <div className="menuPage">
                  <MainPage
                    state={state}
                    dispatch={dispatch}

                  />

                  <TopModal 
                    open={(state.flow === FlowStep.Timer && !state.timerOnMenu)} 
                    onClose={handleTimerClose}>
                    <TimerDisplay
                      name={selectedItem?.name ?? "none"}
                      active={state.timerActive}
                      secondsPass={secondsPass}
                      onStartClick={handleTimerStart}
                      onStopClick={handleTimerStop}     
                      onCloseClick={handleTimerClose}
                      onResetClick={handleTimerReset}
                    />
                  </TopModal>
                </div>
              )}

              <div>
                {state.menu === Menu.edit && (
                  <div className='menuPage'>
                    <EditorPage
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
                {state.menu === Menu.statistics && (
                  <div className='menuPage'>
                    <StatisticsPage
                      selectedHobbyId={state.selectedItemId}
                      state={state}
                      dispatch={dispatch}
                      hobbyDetailsTime={state.server.hobbyTimeDetails}
                      onHobbyDetails={handleShowDetails}
                      onHobbyTimesRange={handleShowRange}
                      hobbyTimes={state.server.hobbyTimes}
                      onHobbyTimes={getSpentTimesToday}
                    />
                  </div>
                )}
              </div>
                <TopModal 
                  open={state.flow === FlowStep.Details} 
                  onClose={onHandleCancelHobbytime}>
                  <FormAlert
                    title={t('hobbyWriteForm.whatIsDone')}
                    currentSpentTime={state.currentSpentTime}
                    onSave={onSaveHobbyTime}
                    onCancel={onHandleCancelHobbytime}
                  />
                </TopModal>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}


type Language = {
  id: number,
  lang: string,
  name: string
}



const initialState: State = {
  flow: FlowStep.Idle,
  selectedItemId: null,
  currentSpentTime: 0,
  timerActive: false,
  timerOnMenu: false,
  server: { hobbies: [], hobbyTimes: [], hobbyTimeDetails: [] },
  menu: Menu.main,
  topMenu: null,
  language: 'en'
};

export default App;
