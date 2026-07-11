import { Activity, useMemo, useState } from "react";

import Select from "./Select"
import  Button, { ButtonType } from "./Button"
import { Hobby } from "../models/hobby"
import HobbyForm from "./HobbyForm";

interface Props {
    hobbies: Hobby[],
    onUpdateHobby: (hobby: Hobby) => void,
    onSubmitHobby: (name: string, description: string) => Promise<boolean>;
    onDeleteHobby: (hobbyId: number) => Promise<boolean>;
}

export function Editor({ 
    hobbies, 
    onUpdateHobby, 
    onSubmitHobby, 
    onDeleteHobby,
}: Props) {
    const [selectedId, setSelectedId] =  useState<number | null>(null);
    const [isWaiting, setIsWaiting] = useState(false);
    const [isOpenForm, setIsOpenForm] = useState(false);

    const selectedHobby = useMemo(
        () => hobbies.find(h => h.id === selectedId) ?? null,
        [hobbies, selectedId]
    );

    function handleSelect(value: number) {
        setSelectedId(value);
    }

    function updateHobby() {
        if (!selectedHobby) return;

        const update = new Hobby(selectedHobby.id, '', '');
        onUpdateHobby(update);
    }

    async function handleFormSubmit(name: string, description: string) {
        setIsWaiting(true);
        const ok = await onSubmitHobby(name, description);
        setIsWaiting(false);
        
        if (ok) setIsOpenForm(false);
    }

    function handleFormCancel() {
        setIsOpenForm(false);
    }

    async function handleDelete() {
        if (!selectedHobby) return;
        setIsWaiting(true);
        const ok = await onDeleteHobby(selectedHobby.id);
        setIsWaiting(false);

        if (ok) setSelectedId(null);
    }

 
    return (
        <>
            <Activity mode={isOpenForm ? 'hidden' : 'visible'} >
                <div className='columnContent' >   
                    <label>Select hobby:</label>
                    <Select 
                        items={hobbies.map(sel => ({ id: sel.id, name: sel.name }))}
                        onChange={ (value) => {handleSelect(value) }}
                    />

                    <label>add new hobby:</label>
                    <Button 
                        title='add' 
                        type={ButtonType.btnSecond} 
                        onClick={() => {setIsOpenForm(true)}} 
                    />
                    {selectedId && (
                        <>
                            <label>delete hobby:</label>
                            <Button 
                                    title='delete' 
                                    type={ButtonType.btnSecond} 
                                    onClick={handleDelete} 
                                />

                                <label>edit activity:</label>
                                <Button 
                                    title='update' 
                                    type={ButtonType.btnSecond} 
                                    onClick={updateHobby} 
                                />
                        </>                    
                    )}

                </div>  
            </Activity>

            {isOpenForm && (
                <div className='columnContent'>
                    {isWaiting && <div>Saving...</div>}

                    <HobbyForm
                        onSubmit={handleFormSubmit}
                        onCancel={handleFormCancel}
                    />
                </div>
            )}
        </>
    )
}