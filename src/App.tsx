
import { useState, useEffect, useRef } from 'react';

import axios from 'axios';


import './App.css';
import { apiConfig } from './config/api'

import Select from './components/Select';
import Timer from './components/Timer';

import { Hobby, HobbyTime } from './models/hobby';
import HobbyForm from './components/HobbyForm';
import Button, { ButtonType } from './components/Button';

import DataTable from './components/DataTable';
import { formatTime, startOfLocalDay, isTodayLocal } from './utils/helpers';


enum State {
  starting = 0,
  adding,
  showing,
  selected,
  closeCount
}

const api = axios.create({
  withCredentials: true
});

function App() {
  const [state, setState] = useState(State.starting);
  
  const [dataHobbies, setDataHobbies] = useState<Hobby[]>([]);
  const [selectedItem, setSelectedItem] =  useState<{id: number; name: string} | null>(null);

  const [dataHobbyTimes, setDataHobbyTimes] = useState<HobbyTime[]>([]);

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
    console.log(`spent time to ${selectedItem?.name} = ` + value);
    setState(State.showing);
    if (!selectedItem) return;
  
    const json = {
      hobby_id: selectedItem.id,
      spent_time: value
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

  return (
    <div className='rowContent'>
      { state === State.starting && (
        <div className='columnContent'>
        <label>What will do:</label>
        <Select 
          items={dataHobbies.map(sel => ({ id: sel.id, name: sel.name }))}
          onChange={ (value) => {handleSelect(value) }}
        />

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
      
      { state === State.selected && selectedItem && (
        <Timer 
          id={selectedItem.id} 
          name={selectedItem.name} 
          onStopClick={onStopClick} 
          onResetClick={onResetClick}
          onCloseClick={onCloseClick}
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
          {/* <HobbyTable hobbies={dataHobbies} /> */}
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
    </div>
  );
}

export default App;
