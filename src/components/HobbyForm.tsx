import { useState } from "react";


interface Props {
    onSubmit: (name: string, descripton: string) => void
}

export default function HobbyForm({ onSubmit }: Props) {

    const [hobby, setHobby] = useState('');
    const [hobbyDescription, setHobbyDescription] = useState('');

    const onHandleSubmitForm = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(hobby, hobbyDescription);
  };

    return (
        <>
        <form method='post' onSubmit={onHandleSubmitForm}>
          <label>
            Name  hobby: <input
              placeholder='new hobby'
              value={hobby}
              onChange={(e) => {
                setHobby(e.currentTarget.value)
              }}
           />  
          </label>
          <br/>
          <label>
            Description hobby: <input
              placeholder='descripton hobby'
              value={hobbyDescription}
              onChange={(e) => {
                setHobbyDescription(e.currentTarget.value)
              }}
           />  
          </label>
          <br />
          <button type='submit'>Add</button>
        </form>
        </>
    );
}