import { useState } from "react";
import Button, { ButtonType } from "./Button";

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

    const [description, setDescription] = useState("");
    let spentTime = currentSpentTime


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
                        placeholder='What is done'
                        style={{ width: "100%", padding: 8, marginBottom: 12 }}
                    />

                    <div className='formActions'>
                        <Button 
                            buttonType='submit'
                            type={ButtonType.btnPrimary}
                            onClick={() => { onSave(spentTime, description); }}
                            title='Save'
                        />
                        <Button 
                            type={ButtonType.btnSecond}
                            onClick={onCancel}
                            title='Cancel'
                        />
                    </div>
                </div>

            </form>
        </div>
    );
}
