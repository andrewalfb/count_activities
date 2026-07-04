
import { useState, useEffect } from 'react';

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
  selected,
  counted,
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

  useEffect(() => {
    api.get(apiConfig.endpoints.hobby.list()).then(
     response => {
      const hobbies = response.data.map(
        (h: { id: number; name: string; description: string }) => { 
          return new Hobby(h.id, h.name, h.description)
        }
      );
      setDataHobbies(hobbies);
     } 
    ).catch(error => {
      console.error(error);
    })
  }, [])

  useEffect(() => {
    api.get(apiConfig.endpoints.hobby.times()).then(
      response => {
        const hobbyTimes = response.data.map(
          (h: { id: number; hobbyId: number, spentTime: number, timestamp: number}) => {
            return new HobbyTime(h.hobbyId, h.spentTime, h.timestamp)
          }
        );
        setDataHobbyTimes(hobbyTimes);
      }
    ).catch(error => {
      console.error(error);
    })
  }, [])

  const rows = joinById(dataHobbies, dataHobbyTimes);

  type JoinedRow = {
    id: number;
    name: string;
    description: string;
    spentTime: number;
  };

  function joinById(hobbies: Hobby[], times: HobbyTime[]): JoinedRow[] {
    const start = startOfLocalDay();
    const spentById = new Map<number, number>();

  for (const t of times) {
    if (t.timestamp < start) continue;
    spentById.set(t.id, (spentById.get(t.id) ?? 0) + t.spentTime);
  }
    
    return hobbies.map(h => ({
      id: h.id,
      name: h.name,
      description: h.description,
      spentTime: spentById.get(h.id) ?? 0,
    }));
  }


function lookupHobbies(id: number): Hobby | undefined {
  const res = dataHobbies.find(item => {
    return item.id === id
  })

  return res
}

  function onStopClick(value: number) {
    console.log(`spent time to ${selectedItem?.name} = ` + value);
    setState(State.counted);
    if (!selectedItem) return;
    const newHobbyTime = new HobbyTime(selectedItem.id, value, Date.now());
    let newHobbyTimes = dataHobbyTimes.slice();
    newHobbyTimes.push(newHobbyTime);
    setDataHobbyTimes(newHobbyTimes);
  
    const json = {
      hobby_id: newHobbyTime.id,
      spent_time: newHobbyTime.spentTime,
      timestamp: newHobbyTime.timestamp
    };

    api.post(apiConfig.endpoints.hobby.addTimes(), json)
    .then((response) => {
      console.log(`responce: ${response}`)
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

        <label>or add new activity /hobby/:</label>
        <Button 
          title='add' 
          type={ButtonType.btnSecond} 
          onClick={ () => {
            setState(State.adding)}} 
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

      { state === State.counted && (
        <div className='columnContent'>
          <Button 
            title='Back'
            type={ButtonType.btnSecond}
            onClick={() => {setState(State.starting)}}
          />
          <br/>
          {/* <HobbyTable hobbies={dataHobbies} /> */}
          <DataTable 
            items={rows}
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
