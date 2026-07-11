import { useEffect, useState } from "react";
import Button, { ButtonType } from "./Button";


interface Props {
    name?: string | null,
    description?: string | null,
    onSubmit: (name: string, description: string) => void,
    onCancel: () => void
}

export default function HobbyForm({ 
  name = '', 
  description = '', 
  onSubmit,
  onCancel,
 }: Props) {

    const [hobby, setHobby] = useState(name ?? '');
    const [hobbyDescription, setHobbyDescription] = useState(description ?? '');

    useEffect(() => {
      setHobby(name ?? '');
      setHobbyDescription(description ?? '');
    }, [name, description]);

    const onHandleSubmitForm = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimName = hobby.trim();
        const trimDescription = hobbyDescription.trim();

        if (!trimName && !trimDescription) return;

        onSubmit(hobby, hobbyDescription);
  };

  return (
    <form 
     className='hobbyForm'
     method="post" onSubmit={onHandleSubmitForm}>
      <div className='hobbyForm__row'>
        <label style={{ minWidth: 160 }}>Name hobby</label>
        <input placeholder="new hobby" value={hobby} onChange={(e) => setHobby(e.currentTarget.value)} />
      </div>

      <div className='hobbyForm__row'>
        <label style={{ minWidth: 160 }}>Description hobby</label>
        <input
          placeholder="descripton hobby"
          value={hobbyDescription}
          onChange={(e) => setHobbyDescription(e.currentTarget.value)}
        />
      </div>

      <div className='hobbyForm__actions'>
        <Button buttonType="submit" type={ButtonType.btnPrimary} onClick={() => {}} title="Save" />
        <Button type={ButtonType.btnSecond} onClick={onCancel} title="Cancel" />
      </div>
    </form>
  );

}