import { useMemo, useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

import Select from "../Select"
import  { ButtonStyle } from "../Button"
import { Hobby } from "../../models/hobby"
import HobbyForm from "../HobbyForm";
import { Spinner } from "../Spinner";
import { State, Action } from "../../App";
import { Menu, TopMenu } from "../../models/menu";

// only for debug
import { sleep } from "../../utils/helpers";



interface Props {
    selectedHobbyId: number | null,
    state: State,
    dispatch: React.Dispatch<Action>,
    onUpdateHobby: (hobby: Hobby) => Promise<boolean>,
    onSubmitHobby: (name: string, description: string) => Promise<boolean>;
    onDeleteHobby: (hobbyId: number) => Promise<boolean>;
}

export function EditorPage({ 
    selectedHobbyId,
    state,
    dispatch,
    onUpdateHobby, 
    onSubmitHobby, 
    onDeleteHobby,
}: Props) {
    const [t] = useTranslation();

    const [isWaiting, setIsWaiting] = useState(false);
    const [hobbyForm, setHobbyForm] = useState({ isOpen: false, isUpdate: false});
    const selectedHobby = useMemo(
        () => state.server.hobbies.find(h => h.id === selectedHobbyId) ?? null,
        [state.server.hobbies, selectedHobbyId]
    );
    
    const topMenu = useMemo(() => new TopMenu(Menu.edit, [
            {
                id: 'add',
                title: t('common.add'),
                style: ButtonStyle.Primary,
                active: true,
                onClick: () => setHobbyForm({isOpen: true, isUpdate: false})
            },
            {
                id: 'edit',
                title: t('common.update'),
                style: ButtonStyle.Primary,
                active: false,
                onClick: () => setHobbyForm({isOpen: true, isUpdate: true})
            },
            {
                id: 'delete',
                title: t('common.delete'),
                style: ButtonStyle.Primary,
                active: false,
                onClick: () => handleDelete()
            },
        ]
    ), [dispatch, t]);

    useEffect(() => {
        dispatch({ type: 'TOP_MENU_INSTALL', topMenu: topMenu})

    }, [dispatch, topMenu]);

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

    const handleDelete = useCallback(async () => {
        if (selectedHobbyId == null) return;

        setIsWaiting(true);
        const ok = await onDeleteHobby(selectedHobbyId);
        setIsWaiting(false);
        if (ok) dispatch({ type: 'MENU_SELECT_HOBBY', id: null});
    }, [ selectedHobbyId, onDeleteHobby ])


 
    return (
        <div className='hobbyPage'>
            { isWaiting && (<Spinner name={t('editor.saving')}/>)}

            { !hobbyForm.isOpen &&
            <Select 
                items={state.server.hobbies.map(sel => ({ id: sel.id, name: sel.name }))}
                onChange={ (value) => { dispatch({ type: 'MENU_SELECT_HOBBY', id: value })}}
                active={selectedHobbyId}
                defaultTitle={t('app.selectHobby')}
            />                 
            }
           

            { hobbyForm.isOpen && (
                <HobbyForm
                    isUpdate={hobbyForm.isUpdate}
                    needUpdateHobby={hobbyForm.isUpdate ? selectedHobby : null}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                />
            )}
        </div>
    )
}
