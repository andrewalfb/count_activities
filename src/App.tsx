
import { useState, useEffect, useRef } from 'react';

import axios from 'axios';


import './App.css';
import { apiConfig } from './config/api'

import Select from './components/Select';
import Timer from './components/Timer';

import { Hobby, HobbyTime, HobbyDetailsTime } from './models/hobby';
import HobbyForm from './components/HobbyForm';
import Button, { ButtonType } from './components/Button';

import DataTable from './components/DataTable';
import { formatTime, startOfLocalDay, isTodayLocal } from './utils/helpers';

import FormAlert from './components/HobbyWriteForm';
import { setSelectionRange } from '@testing-library/user-event/dist/utils';


enum State {
  starting = 0,
  adding,
  showing,
  selected,
  closeCount,
  startCounting,
  stopCounting,
  showDetailsHobby
}

const api = axios.create({
  withCredentials: true
});

function App() {
  const [state, setState] = useState(State.starting);
  
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

      const [hobbyRes, timesRes] = await Promise.all([
        api.get(apiConfig.endpoints.hobby.list()),
        api.get(apiConfig.endpoints.hobby.times()),
      ]);

      const hobbies = hobbyRes.data.map(
        (h: { id: number; name: string; description: string }) =>
          new Hobby(h.id, h.name, h.description)
      );

      setDataHobbies(hobbies);
    };

    bootstrap().catch(console.error);

  }, []);

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
    setState(State.showing);
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
    setState(State.starting);
  } 

  function handleSubmitForm(name: string, description: string) {

    const json = {
      name: name,
      description: description
    };
    api.post(apiConfig.endpoints.hobby.addHobby(), json)
    .then((response) => {
      console.log(`response: ${response.data}`)
    const newHobby = new Hobby(response.data.id, name, description);
    let newHobbies = dataHobbies.slice();
    newHobbies.push(newHobby);
    setDataHobbies(newHobbies);
    setState(State.starting);
    }).catch(error => {
      console.error(`error add hobby: ${error}`);
    });
  };

  function handleSelect(value: number) {
    const prop = lookupHobbies(value);
    if (!prop) return;
    setSelectedItem({id: value, name: prop.name});
    setState(State.selected);
  } 

  function handleShowDetails() {
    api.get(apiConfig.endpoints.hobby.details(), { params: { hobbyId: selectedItem?.id } })
    .then((response: { data: HobbyDetailsTime[] }) => {
      const newHobbyDetails = response.data.map(item => new HobbyDetailsTime(item.description, item.spentTime));
      setDataHobbyDetailsTime(newHobbyDetails);
      setState(State.showDetailsHobby);
    })
  }

  return (
    <div className='rowContent'>
      { (state === State.starting || state === State.selected) && (
        <div className='columnContent'>
          <label>What will do:</label>
          <Select 
            items={dataHobbies.map(sel => ({ id: sel.id, name: sel.name }))}
            onChange={ (value) => {handleSelect(value) }}
          />

          {state === State.selected && (
            <>
              <label>Start timer for {selectedItem?.name}</label>
              <Button
                title="start"
                type={ButtonType.btnPrimary}
                onClick={() => {setState(State.startCounting)}}
              />

              <label>Show details for {selectedItem?.name}</label>
              <Button
                title="show"
                type={ButtonType.btnPrimary}
                onClick={handleShowDetails}
              />

            </>
          )}

          <label>or add new activity:</label>
          <Button 
            title='add' 
            type={ButtonType.btnSecond} 
            onClick={ () => {
              setState(State.adding)}} 
          />

          <label>or see today activities:</label>
          <Button 
            title='show' 
            type={ButtonType.btnSecond} 
            onClick={ () => {
              setState(State.showing)}} 
          />

        </div>
      )}

      { state === State.adding && (
        <HobbyForm onSubmit={handleSubmitForm} />
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
          title='Save?'
          currentSpentTime={currentSpentTime}
          onSave={ onSaveHobbyTime }
        />
      )}

      { state === State.showing && (
        <div className='columnContent'>
          <Button 
            title='Back'
            type={ButtonType.btnSecond}
            onClick={() => {setState(State.starting)}}
          />
          <br/>

          <DataTable 
            items={dataHobbyTimes}
            columns={[
              { header: 'Name', cell: (h) => h.name },
              { header: 'Description', cell: (h) => h.description },
              { header: 'Spent Time', cell: (h) => formatTime(h.spentTime) }
            ]}
          />
        </div>
      )}

      { state === State.showDetailsHobby && (
        <div className='columnContent'>
          <Button 
            title='Back'
            type={ButtonType.btnSecond}
            onClick={() => {setState(State.starting)}}
          />
          <br/>

          <DataTable 
            items={dataHobbyDetailsTime}
            columns={[
              { header: 'Description', cell: (h) => h.description },
              { header: 'Spent Time', cell: (h) => formatTime(h.spentTime) }
            ]}
          />
        </div>
      )}

    </div>
  );
}

export default App;
