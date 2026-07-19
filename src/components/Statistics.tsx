import { Activity, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { formatTime } from "../utils/helpers";
import Button, { ButtonType } from "./Button";
import DataTable from "./DataTable";
import { Hobby, HobbyTimeDetail, HobbyTime } from "../models/hobby";
import Select from "./Select";
import { Spinner } from "./Spinner";

// only for debug
import { sleep } from "../utils/helpers";

interface Props {
    hobbies: Hobby[],
    hobbyDetailsTime: HobbyTimeDetail[],
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
        try {
            await sleep(3000);
            const ok = await onHobbyDetails(selectedHobby.id);
            if (ok) setIsShowDetailsReport(true);
        } finally {
            setIsWaiting(false);
        }
    }


    async function handleTodayActivitiesReport() {
        setIsWaiting(true);
        try {
            await sleep(1000);
            const ok = await onHobbyTimes();
            if (ok) setIsShowTodayActivities(true);
        } finally {
            setIsWaiting(false);
        }
    }

    return (
    <>
        { isWaiting && (<Spinner name={t('statistics.loading')}/>)}
        <Activity mode={isShowDetailsReport || isShowTodayActivities || isWaiting ? 'hidden' : 'visible'} >  
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
                    title={t('common.close')}
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
                    title={t('common.close')}
                    type={ButtonType.btnSecond}
                    onClick={() => setIsShowTodayActivities(false)}
                />   
              </div>
        </Activity>
    </>
    );
}
