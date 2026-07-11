import { Activity, useMemo, useState } from "react";

import { formatTime } from "../utils/helpers";
import Button, { ButtonType } from "./Button";
import DataTable from "./DataTable";
import { Hobby, HobbyDetailsTime, HobbyTime } from "../models/hobby";
import Select from "./Select";


interface Props {
    hobbies: Hobby[],
    hobbyDetailsTime: HobbyDetailsTime[],
    onHobbyDetails: (hobbyId: number) => Promise<boolean>,
    hobbyTimes: HobbyTime[],
    onHobbyTimes: () => Promise<boolean>;
}

export function Statistics({
    hobbies,
    hobbyDetailsTime,
    onHobbyDetails,
    hobbyTimes,
    onHobbyTimes,
}: Props) {
    const [selectedId, setSelectedId] =  useState<number | null>(null);
    const [isWaiting, setIsWaiting] = useState(false);
    
    const [isShowDetailsReport, setIsShowDetailsReport] = useState(false);
    const [isShowTodayActivities, setIsShowTodayActivities] = useState(false);

    const selectedHobby = useMemo(
        () => hobbies.find(h => h.id === selectedId) ?? null,
        [hobbies, selectedId]
    );

    function handleSelect(value: number) {
        setSelectedId(value);
    }

    async function handleDetailsReport() {
        if (!selectedHobby) return;
        setIsWaiting(true);
        const ok = await onHobbyDetails(selectedHobby.id);
        setIsWaiting(false);
        if (ok) setIsShowDetailsReport(true);
    }


    async function handleTodayActivitiesReport() {
        setIsWaiting(true);
        const ok = await onHobbyTimes();
        setIsWaiting(false);
        if (ok) setIsShowTodayActivities(true);
    }

    return (
    <>
        <Activity mode={isShowDetailsReport || isShowTodayActivities ? 'hidden' : 'visible'} >  
            <div className='columnContent'>
                <label>Select hobby:</label>
                <Select 
                    items={hobbies.map(sel => ({ id: sel.id, name: sel.name }))}
                    onChange={ (value) => {handleSelect(value) }}
                />
            { selectedId && (
                <Button
                    title='time report'
                    type={ButtonType.btnSecond}
                    onClick={handleDetailsReport}
                />
            )}

            <Button
                title='today activities'
                type={ButtonType.btnSecond}
                onClick={handleTodayActivitiesReport}
            />

            </div>
        </Activity>  

        <Activity mode={isShowDetailsReport ? 'visible' : 'hidden'} >
            <div className="columnContent" >
                <DataTable
                    title={`Details report: ${selectedHobby?.name}`}
                    items={hobbyDetailsTime}
                    columns={[
                        { header: 'Description', cell: (h) => h.description },
                        { header: 'Spent Time', cell: (h) => formatTime(h.spentTime) }
                    ]} 
                />
                <Button
                    title='Close'
                    type={ButtonType.btnSecond}
                    onClick={() => setIsShowDetailsReport(false)}
                />                
            </div>

        </Activity>

        <Activity mode={isShowTodayActivities ? 'visible' : 'hidden'}>
              <div className='columnContent'>
                <DataTable 
                  title={`Today Activities report`}
                  items={hobbyTimes}
                  columns={[
                    { header: 'Name', cell: (h) => h.name },
                    { header: 'Description', cell: (h) => h.description },
                    { header: 'Spent Time', cell: (h) => formatTime(h.spentTime) }
                  ]}
                />
                <Button
                    title='Close'
                    type={ButtonType.btnSecond}
                    onClick={() => setIsShowTodayActivities(false)}
                />   
              </div>
        </Activity>
    </>
    );
}
