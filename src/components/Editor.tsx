import { Activity, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import Select from "./Select"
import  Button, { ButtonType } from "./Button"
import { Hobby } from "../models/hobby"
import HobbyForm from "./HobbyForm";

// only for debug
import { sleep } from "../utils/helpers";
import { Spinner } from "./Spinner";

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
    const [t] = useTranslation();
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
        await sleep(3000);
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
        await sleep(3000);
        const ok = await onDeleteHobby(selectedHobby.id);
        setIsWaiting(false);

        if (ok) setSelectedId(null);
    }

 
    return (
        <>
            {isWaiting && (<Spinner name={t('editor.saving')}/>)}

            <Activity mode={isOpenForm || isWaiting ? 'hidden' : 'visible'} >
                <div className='columnContent' >   
                    <label>{t('editor.selectHobby')}</label>
                    <Select 
                        items={hobbies.map(sel => ({ id: sel.id, name: sel.name }))}
                        onChange={ (value) => {handleSelect(value) }}
                    />

                    <label>{t('editor.addNewHobby')}</label>
                    <Button 
                        title={t('editor.add')} 
                        type={ButtonType.btnSecond} 
                        onClick={() => {setIsOpenForm(true)}} 
                    />
                    {selectedId && (
                        <>
                            <label>{t('editor.deleteHobby')}</label>
                            <Button 
                                    title={t('editor.delete')} 
                                    type={ButtonType.btnSecond} 
                                    onClick={handleDelete} 
                                />

                                <label>{t('editor.editActivity')}</label>
                                <Button 
                                    title={t('editor.update')} 
                                    type={ButtonType.btnSecond} 
                                    onClick={updateHobby} 
                                />
                        </>                    
                    )}

                </div>  
            </Activity>

            {isOpenForm && (
                <div className='columnContent'>
                    <HobbyForm
                        onSubmit={handleFormSubmit}
                        onCancel={handleFormCancel}
                    />
                </div>
            )}
        </>
    )
}
