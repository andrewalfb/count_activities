
import { useState } from 'react';

import './App.css';

import Select from './components/Select';
import Timer from './components/Timer';

import { hobbies } from './models/hobby';

function App() {
  const [hobby, setHobby] = useState('Make your choice:');

  function onStopClick(value: number) {
    console.log('clicked the button stop: ' + value);
  }

  return (
    <div className='rowContent'>
      <Select 
        names={hobbies.map((hobby) => ( hobby.name))} 
        onChange={ (value) => {setHobby(value);}}
      />

      <Timer onStopClick={onStopClick} />

    </div>
  );
}

export default App;
