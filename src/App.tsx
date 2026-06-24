
import { useState } from 'react';

import './App.css';

import Select from './components/Select';
import Timer from './components/Timer';

import { hobbies, Hobby } from './models/hobby';
import HobbyForm from './components/HobbyForm';

function App() {
  const [dataHobbies, setDataHobbies] = useState(hobbies);
  const [hobby, setHobby] = useState('');
  const [hobbyDescription, setHobbyDescription] = useState('');

 

  function onStopClick(value: number) {
    console.log('clicked the button stop: ' + value);
    console.log(hobbies);
  }


  function submit(name: string, descripton: string) {
    console.log(name, descripton);
    const newHobby = new Hobby(name, descripton);
    let newHobbies = hobbies.slice();
    newHobbies.push(newHobby);
    setDataHobbies(newHobbies);
  };

  return (
    <div className='rowContent'>
      <div className='columnContent'>
        <HobbyForm onSubmit={submit} />
        <Select 
          names={dataHobbies.map((hobby) => ( hobby.name))} 
          onChange={ (value) => {setHobby(value);}}
        />
      </div>

      <Timer onStopClick={onStopClick} />

    </div>
  );
}

export default App;
