import { useMemo, useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import Select from "../Select"
import  { ButtonStyle } from "../Button"
import { Hobby } from "../../models/hobby"
import HobbyForm from "../HobbyForm";
import { Spinner } from "../Spinner";
import { Menu, TopMenu } from "../../models/menu";
import { Action, State } from "../../hooks/taskReducer";

// only for debug
// import { sleep } from "../../utils/helpers";



interface Props {
    state: State,
    dispatch: React.Dispatch<Action>,
    onUpdateHobby: (hobby: Hobby) => Promise<boolean>,
    onSubmitHobby: (name: string, description: string) => Promise<boolean>;
    onDeleteHobby: (hobbyId: number) => Promise<boolean>;
}

export function EditorPage({ 
    state,
    dispatch,
    onUpdateHobby, 
    onSubmitHobby, 
    onDeleteHobby,
}: Props) {
    const [t] = useTranslation();
    const tRef = useRef(t);

    const [isWaiting, setIsWaiting] = useState(false);
    const [hobbyForm, setHobbyForm] = useState({ isOpen: false, isUpdate: false});
    const selectedHobby = useMemo(
        () => state.server.hobbies.find(h => h.id === state.selectedItemId) ?? null,
        [state.server.hobbies, state.selectedItemId]
    );


    function handleFormCancel() {
        setHobbyForm({isOpen: false, isUpdate: false});
    }

    async function handleDelete() {
        if (state.selectedItemId == null) return;

        setIsWaiting(true);
        const ok = await onDeleteHobby(state.selectedItemId);
        setIsWaiting(false);
        if (ok) dispatch({ type: 'MENU_SELECT_HOBBY', id: null});
    }

    
    const [topMenu] = useState(() => 
        new TopMenu(Menu.edit, [
            {
                id: 'add',
                getTitle: () => tRef.current('common.add'),
                style: ButtonStyle.Primary,
                active: true,
                onClick: () => setHobbyForm({isOpen: true, isUpdate: false})
            },
            {
                id: 'edit',
                getTitle: () => tRef.current('common.update'),
                style: ButtonStyle.Primary,
                active: false,
                onClick: () => setHobbyForm({isOpen: true, isUpdate: true})
            },
            {
                id: 'delete',
                getTitle: () => tRef.current('common.delete'),
                style: ButtonStyle.Primary,
                active: false,
                onClick: () => handleDelete()
            },
        ]
    ));

    useEffect(() => {
        tRef.current = t;
    }, [t]);

    useEffect(() => {
        dispatch({ type: 'TOP_MENU_INSTALL', topMenu });
    }, [dispatch, topMenu]);

    async function handleFormSubmit(name: string, description: string) {
        setIsWaiting(true);
        // await sleep(500);

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
 
    return (
        <div className='hobbyPage'>
            { isWaiting && (<Spinner name={t('editor.saving')}/>)}

            { !hobbyForm.isOpen &&
            <Select 
                items={state.server.hobbies.map(sel => ({ id: sel.id, name: sel.name }))}
                onChange={ (value) => { dispatch({ type: 'MENU_SELECT_HOBBY', id: value })}}
                active={state.selectedItemId}
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
