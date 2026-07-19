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
    onUpdateHobby: (hobby: Hobby) => Promise<boolean>,
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
    const [hobbyForm, setHobbyForm] = useState({ isOpen: false, isUpdate: false});

    const selectedHobby = useMemo(
        () => hobbies.find(h => h.id === selectedId) ?? null,
        [hobbies, selectedId]
    );

    function handleSelect(value: number) {
        setSelectedId(value);
    }

    async function handleFormSubmit(name: string, description: string) {
        setIsWaiting(true);
        await sleep(1000);
        if (hobbyForm.isUpdate) {
            console.log(`modified: ${name} , ${description}`)
            const ok = await onUpdateHobby(new Hobby(selectedHobby!.id, name, description));
            if (ok) setHobbyForm({isOpen: false, isUpdate: false});
        } else {
            const ok = await onSubmitHobby(name, description);
            if (ok) setHobbyForm({isOpen: false, isUpdate: false});
        }
        setIsWaiting(false);        
    }

    function handleFormCancel() {
        setHobbyForm({isOpen: false, isUpdate: false});
    }

    async function handleDelete() {
        if (!selectedHobby) return;
        setIsWaiting(true);
        await sleep(1000);
        const ok = await onDeleteHobby(selectedHobby.id);
        setIsWaiting(false);

        if (ok) setSelectedId(null);
    }

 
    return (
        <>
            {isWaiting && (<Spinner name={t('editor.saving')}/>)}

            <Activity mode={hobbyForm.isOpen || isWaiting ? 'hidden' : 'visible'} >
                <div className='columnContent' >   
                    <label>{t('editor.selectHobby')}</label>
                    <Select 
                        items={hobbies.map(sel => ({ id: sel.id, name: sel.name }))}
                        onChange={ (value) => {handleSelect(value) }}
                    />

                    <label>{t('editor.addNewHobby')}</label>
                    <Button 
                        title={t('common.add')} 
                        type={ButtonType.btnSecond} 
                        onClick={() => {setHobbyForm({isOpen: true, isUpdate: false})}} 
                    />
                    {selectedId && (
                        <>
                            <label>{t('editor.deleteHobby')}</label>
                            <Button 
                                title={t('common.delete')} 
                                type={ButtonType.btnSecond} 
                                onClick={handleDelete} 
                            />

                            <label>{t('editor.editActivity')}</label>
                            <Button 
                                title={t('common.update')} 
                                type={ButtonType.btnSecond} 
                                onClick={() => {setHobbyForm({isOpen: true, isUpdate: true})}} 
                            />
                    </>                    
                    )}

                </div>  
            </Activity>

            {hobbyForm.isOpen && (
                <div className='columnContent'>
                    <HobbyForm
                        isUpdate={hobbyForm.isUpdate}
                        needUpdateHobby={selectedHobby}
                        onSubmit={handleFormSubmit}
                        onCancel={handleFormCancel}
                    />
                </div>
            )}
        </>
    )
}
