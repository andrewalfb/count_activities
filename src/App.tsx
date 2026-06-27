
import { useState, useEffect } from 'react';

import axios from 'axios';


import './App.css';

import Select from './components/Select';
import Timer from './components/Timer';

import { hobbies, Hobby, HobbyTime } from './models/hobby';
import HobbyForm from './components/HobbyForm';
import Button, { ButtonType } from './components/Button';
// import HobbyTable from './components/HobbyTable';
import DataTable from './components/DataTable';
import { formatTime, startOfLocalDay, isTodayLocal } from './utils/helpers';
import { error } from 'console';

enum State {
  starting = 0,
  adding,
  selected,
  counted,
  finishing
}


function App() {
  const [state, setState] = useState(State.starting);
  
  const [dataHobbies, setDataHobbies] = useState(hobbies);
  const [selectedItem, setSelectedItem] =  useState<{id: string; name: string} | null>(null);

  const [dataHobbyTimes, setDataHobbyTimes] = useState<HobbyTime[]>([]);

  // test backend connectivities
  const [data, setData] = useState();

 
  useEffect(() => {
    axios.get('http://localhost:5001/api/products').then(
     response => {
      setData(response.data);
     } 
    ).catch(error => {
      console.error(error);
    })
  }, [])

    // initDb();

  const rows = joinById(dataHobbies, dataHobbyTimes);

  type JoinedRow = {
    id: string;
    name: string;
    description: string;
    spentTime: number;
  };

  function joinById(hobbies: Hobby[], times: HobbyTime[]): JoinedRow[] {
    const start = startOfLocalDay();
    const spentById = new Map<string, number>();

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


function lookupHobbies(id: string): Hobby | undefined {
  const res = dataHobbies.find(item => {
    return item.id === id
  })

  return res
}

  function onStopClick(value: number) {
    console.log(`spent time to ${selectedItem?.name} = ` + value);
    setState(State.counted);
    if (!selectedItem) return;
    const newHobbyTime = new HobbyTime(selectedItem.id, value);
    let newHobbyTimes = dataHobbyTimes.slice();
    newHobbyTimes.push(newHobbyTime);
    setDataHobbyTimes(newHobbyTimes);
  }


  function handleSubmitForm(name: string, descripton: string) {
    const newHobby = new Hobby(name, descripton);
    let newHobbies = dataHobbies.slice();
    newHobbies.push(newHobby);
    setDataHobbies(newHobbies);
    setState(State.starting);
  };

  function handleSelect(value: string) {
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
        <Timer id={selectedItem.id} name={selectedItem.name} onStopClick={onStopClick} />
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
