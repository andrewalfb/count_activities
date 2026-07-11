import { useState } from "react";
import Button, { ButtonType } from "./Button";

interface Props {
    title: string,
    currentSpentTime: number,
    onSave: (spent: number, description: string | undefined) => void
}

export default function FormAlert({ title, currentSpentTime, onSave }: Props ){

    const [description, setDescription] = useState("");
    let spentTime = currentSpentTime


    return (
        <>
            <div
                style={{
                    background: "white",
                    padding: 16,
                    borderRadius: 10,
                    width: 320,
                }}
                >
                <div style={{ fontWeight: 700, marginBottom: 8 }}>
                    { title }
                </div>

                <form
                    onSubmit={(e) => {
                    e.preventDefault();
                    // handle submit
                    onSave(currentSpentTime, description);
                    }}
                >
                    <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="email@example.com"
                    style={{ width: "100%", padding: 8, marginBottom: 12 }}
                    />

                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <Button 
                        type={ButtonType.btnPrimary}
                        onClick={() => { onSave(spentTime, description); }}
                        title='Save'
                    />
                    <Button 
                        type={ButtonType.btnSecond}
                        onClick={() => {} }
                        title='Cancel'
                    />
                    </div>
                </form>
            </div>
        </>
    );
}
