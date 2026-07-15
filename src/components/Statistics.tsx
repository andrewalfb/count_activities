import { Activity, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

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
    const [t] = useTranslation();
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
                <label>{t('statistics.selectHobby')}</label>
                <Select 
                    items={hobbies.map(sel => ({ id: sel.id, name: sel.name }))}
                    onChange={ (value) => {handleSelect(value) }}
                />
            { selectedId && (
                <Button
                    title={t('statistics.timeReport')}
                    type={ButtonType.btnSecond}
                    onClick={handleDetailsReport}
                />
            )}

            <Button
                title={t('statistics.todayActivities')}
                type={ButtonType.btnSecond}
                onClick={handleTodayActivitiesReport}
            />

            </div>
        </Activity>  

        <Activity mode={isShowDetailsReport ? 'visible' : 'hidden'} >
            <div className="columnContent" >
                <DataTable
                    title={t('statistics.detailsReport', { name: selectedHobby?.name ?? '' })}
                    items={hobbyDetailsTime}
                    columns={[
                        { header: t('statistics.description'), cell: (h) => h.description },
                        { header: t('statistics.spentTime'), cell: (h) => formatTime(h.spentTime) }
                    ]} 
                />
                <Button
                    title={t('statistics.close')}
                    type={ButtonType.btnSecond}
                    onClick={() => setIsShowDetailsReport(false)}
                />                
            </div>

        </Activity>

        <Activity mode={isShowTodayActivities ? 'visible' : 'hidden'}>
              <div className='columnContent'>
                <DataTable 
                  title={t('statistics.todayActivitiesReport')}
                  items={hobbyTimes}
                  columns={[
                    { header: t('statistics.name'), cell: (h) => h.name },
                    { header: t('statistics.description'), cell: (h) => h.description },
                    { header: t('statistics.spentTime'), cell: (h) => formatTime(h.spentTime) }
                  ]}
                />
                <Button
                    title={t('statistics.close')}
                    type={ButtonType.btnSecond}
                    onClick={() => setIsShowTodayActivities(false)}
                />   
              </div>
        </Activity>
    </>
    );
}
