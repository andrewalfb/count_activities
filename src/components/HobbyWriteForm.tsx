import { useState } from "react";
import { useTranslation } from "react-i18next";
import Button, { ButtonStyle } from "./Button";

interface Props {
    title: string,
    currentSpentTime: number,
    onSave: (spent: number, description: string | undefined) => void,
    onCancel: () => void
}

export default function FormAlert({ 
    title, 
    currentSpentTime, 
    onSave, 
    onCancel
}: Props ){

    const [t] = useTranslation();
    const [description, setDescription] = useState("");
    const [spentTime, setSpentTime] = useState(currentSpentTime.toString());


    return (

        <div className='formCard'>
            <div className='formTitle'>{ title }</div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onSave(currentSpentTime, description);
                }}
            >
                <div className='formColumn'>
                    <input
                        className='formInput'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={t('hobbyWriteForm.whatIsDone')}
                    />
                    <label>{t('hobbyWriteForm.spentTime')}</label>
                    <input 
                        className='formInput'
                        value={spentTime}
                        onChange={(e) => {
                            const next = e.target.value;
                            // if (!/^(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)$/.test(next)) return;
                            if (!/^[0-9]*\.?[0-9]*$/.test(next)) return;

                            setSpentTime(next); 
                        }}
                    />

                    <div className='formActions'>
                        <Button
                            style={ButtonStyle.Primary}
                            onClick={() => { 
                                const newSpent = Number(spentTime)
                                onSave(newSpent > 0 ? newSpent : currentSpentTime, description); 
                            }}
                            title={t('common.save')}
                        />
                        <Button 
                            style={ButtonStyle.Second}
                            onClick={onCancel}
                            title={t('common.cancel')}
                        />
                    </div>
                </div>

            </form>
        </div>
    );
}
