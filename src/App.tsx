
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
import { Menu } from './models/menu';
import { EditorPage } from './components/pages/EditorPage';
import { StatisticsPage } from './components/pages/StatisticsPage';
import TopModal from './components/Alerts/TopModal';
import { Spinner } from './components/Spinner';
// import { sleep } from './utils/helpers';
import { MainPage } from './components/pages/MainPage';
import { FlowStep, reducer, State } from './hooks/taskReducer';
import { dbManager } from './utils/db';


function App() {
  const [t, i18n] = useTranslation();

  const [state, dispatch] = useReducer(reducer, initialState)
  // const isDetailsFormActive = state.flow === FlowStep.Details;
  const isWaiting = state.flow === FlowStep.Saving;

  const selectedItem = state.selectedItemId
    ? state.server.hobbies.find(h => h.id === state.selectedItemId)
    : undefined

  const initialized = useRef(false);

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

      // await api.get(apiConfig.endpoints.auth.init());
      await dbManager.initAnonAuth();
      await loadHobbies();
    };

    bootstrap().catch(console.error);

    // add local db
    (async () => {
      await dbManager.initDb();
    })();

  }, []);

  function handleMenu(menu: Menu) {
    switch (menu) {
      case Menu.statistics:
        //  handleShowDetails();
        break;
      default:
        break;
    };

    dispatch({ type: 'SET_MENU', menu: menu });
  };

  const loadHobbies = async () => {
    // const res = await api.get(apiConfig.endpoints.hobby.list());
    const res = await dbManager.getHobbiesList();
    dispatch({ type: 'LOAD_HOBBIES', hobbies: res });
  };

  // Timer
  function onHandleCancelHobbytime() {
    dispatch({ type: 'TIMER_CANCEL' });
  };

  function handleTimerStart() {
    dispatch({ type: 'TIMER_START' });
  }

  function handleTimerStop(value: number) {
    dispatch({ type: 'TIMER_STOP', spent: value });
  };

  function handleTimerCancel() {
    dispatch({ type: 'CANCEL_DETAILS' });
  };

  function handleTimerReset() {
    dispatch({ type: 'TIMER_RESET' })
  };

  async function onSaveHobbyTime(value: number, description: string | undefined) {
    if (!selectedItem) return;
    //   const json = {
    //   hobby_id: selectedItem.id,
    //   spent_time: value,
    //   description: description?.length === 0 ? selectedItem.description : description
    // };

    dispatch({ type: 'SAVE_START' });

    // await sleep(1000);
    /*
        try {
          const responceAdd = await api.post(apiConfig.endpoints.hobby.addTimes(), json);
          const responceTimes = await api.get(apiConfig.endpoints.hobby.times());
          console.log(`addTime: ${responceAdd}, ${responceTimes}`);
          dispatch({type: 'SAVE_SUCCESS', hobbyTimes: responceTimes.data});
        } catch(error) {
          console.error(`error add time: ${error}`);
          dispatch({type: 'SAVE_ERROR'});
        };
    */
    try {
      const responceAdd = await dbManager.setHobbyTime(selectedItem.id, value, selectedItem.description);
      const responceTimes = await dbManager.getHobbyTimeList();
      console.log(`addTime: ${responceAdd}, ${responceTimes}`);
      dispatch({ type: 'SAVE_SUCCESS', hobbyTimes: responceTimes });
    } catch (error) {
      console.error(`error add time: ${error}`);
      dispatch({ type: 'SAVE_ERROR' });
    };
  }


/*
  async function handleSubmitForm(name: string, description: string): Promise<boolean> {
    const json = { name: name, description: description }
    try {
      const response = await api.post(apiConfig.endpoints.hobby.addHobby(), json);
      const newHobby = new Hobby(response.data.id, name, description);
      dispatch({ type: 'ADD_HOBBY', hobby: newHobby });

      return true;
    } catch (error) {
      console.error(`error add hobby: ${error}`);

      return false;
    }
  }
*/

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
/*
  async function handleDelete(hobbyId: number): Promise<boolean> {
    try {
      await api.delete(apiConfig.endpoints.hobby.delete(hobbyId));
      await loadHobbies();

      return true;
    } catch (error: any) {
      console.error(`error delete Hobby: ${error}`);

      return false;
    }
  }
*/
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

/*
  async function getSpentTimesToday(): Promise<boolean> {
    try {
      const res = await api.get(apiConfig.endpoints.hobby.times());
      const times = res.data.map(
        (item: { name: string, description: string, spentTime: number, timestamp: number }) =>
          new HobbyTime(item.name, item.description, item.spentTime, item.timestamp)
      )
      dispatch({ type: 'SAVE_SUCCESS', hobbyTimes: times });

      return true;
    } catch (error) {
      console.error(`error getting today activities: ${error}`);

      return false;
    }
  }
*/
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

  /*
  async function handleShowDetails(hobbyId: number): Promise<boolean> {
    try {
      let response = await api.get(apiConfig.endpoints.hobby.details(), { params: { hobbyId: hobbyId } })

      const newHobbyDetails = response.data.map((item: { hobby: string, description: string; spentTime: number; }) => new HobbyTimeDetail(item.hobby, item.description, item.spentTime));

      dispatch({ type: 'LOAD_DETAILS', details: newHobbyDetails });

      return true
    } catch (error) {
      console.error(`error getting details report: ${error}`);

      return false
    }
  }
    */
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

/*
  async function handleUpdateHobby(updated: Hobby): Promise<boolean> {

    const json = { id: updated.id, name: updated.name, description: updated.description };
    try {
      let ok = await api.post(apiConfig.endpoints.hobby.updateHobby(), json);
      console.log(`result update hobby: ${ok}`);
      dispatch({ type: 'UPDATE_HOBBY', hobby: updated });

      return true;
    } catch (error) {
      console.error(`error update Hobby: ${error}`);

      return false;
    }
  }
*/
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

              <div style={{ marginLeft: 'auto' }}>
                <Select
                  items={languages.map(language => ({ id: language.id, name: language.name }))}
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

                  <TopModal open={state.flow === FlowStep.Details} onClose={onHandleCancelHobbytime}>
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
                      hobbyTimes={state.server.hobbyTimes}
                      onHobbyTimes={getSpentTimesToday}
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


type Language = {
  id: number,
  lang: string,
  name: string
}

const api = axios.create({
  withCredentials: true
});


const initialState: State = {
  flow: FlowStep.Idle,
  selectedItemId: null,
  currentSpentTime: 0,
  timerActive: false,
  server: { hobbies: [], hobbyTimes: [], hobbyTimeDetails: [] },
  menu: Menu.main,
  topMenu: null,
  language: 'en'
};

export default App;
