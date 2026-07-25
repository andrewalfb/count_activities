import { Activity, useEffect, useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { formatTime } from "../../utils/helpers";
import Button, { ButtonStyle } from "../Button";
import DataTable from "../DataTable";
import { HobbyTimeDetail, HobbyTime } from "../../models/hobby";
import Select from "../Select";
import { Spinner } from "../Spinner";
import { State } from "../../App";
import { OnToolbarChange } from "../../types/toolbar";

// only for debug
import { sleep } from "../../utils/helpers";

interface Props {
    selectedHobbyId: number | null,
    state: State,
    onSelectedHobbyIdChange: React.Dispatch<React.SetStateAction<number | null>>,
    onToolbarChange: OnToolbarChange,
    hobbyDetailsTime: HobbyTimeDetail[],
    onHobbyDetails: (hobbyId: number) => Promise<boolean>,
    hobbyTimes: HobbyTime[],
    onHobbyTimes: () => Promise<boolean>;
}

export function StatisticsPage({
    selectedHobbyId,
    state,
    onSelectedHobbyIdChange,
    onToolbarChange,
    hobbyDetailsTime,
    onHobbyDetails,
    hobbyTimes,
    onHobbyTimes,
}: Props) {
    const [t] = useTranslation();
    const [isWaiting, setIsWaiting] = useState(false);
    
    const [isShowDetailsReport, setIsShowDetailsReport] = useState(false);
    const [isShowTodayActivities, setIsShowTodayActivities] = useState(false);

    const selectedHobby = useMemo(
        () => state.server.hobbies.find(h => h.id === selectedHobbyId) ?? null,
        [state.server.hobbies, selectedHobbyId]
    );

    const handleDetailsReport = useCallback(async () => {
        if (!selectedHobby) return;
        setIsWaiting(true);
        try {
            await sleep(300);
            const ok = await onHobbyDetails(selectedHobby.id);
            if (ok) setIsShowDetailsReport(true);
        } finally {
            setIsWaiting(false);
        }
    }, [ selectedHobby, onHobbyDetails, setIsShowDetailsReport, setIsWaiting ])

    const handleTodayActivitiesReport = useCallback( async () => {
        setIsWaiting(true);
        try {
            await sleep(300);
            const ok = await onHobbyTimes();
            if (ok) setIsShowTodayActivities(true);
        } finally {
            setIsWaiting(false);
        }        
    }, [setIsWaiting, onHobbyTimes, setIsShowTodayActivities ])


    useEffect(() => {

        onToolbarChange({
            actions: [
                {
                    id: 'detailsReport',
                    title: t('statistics.timeReport'),
                    style: ButtonStyle.Primary,
                    enabled: selectedHobbyId != null,
                    onClick: () => handleDetailsReport()
                },
                {
                    id: 'todayReport',
                    title: t('statistics.todayActivities'),
                    style: ButtonStyle.Primary,
                    enabled: true,
                    onClick: () => handleTodayActivitiesReport()                   
                }
            ]
        })
    }, [ selectedHobbyId, handleDetailsReport, handleTodayActivitiesReport, onToolbarChange, t ])

    return (
    <>
        { isWaiting && (<Spinner name={t('statistics.loading')}/>)}
        <Activity mode={isShowDetailsReport || isShowTodayActivities || isWaiting ? 'hidden' : 'visible'} >  
            <label>{t('statistics.selectHobby')}</label>
            <Select 
                items={state.server.hobbies.map(sel => ({ id: sel.id, name: sel.name }))}
                active={selectedHobbyId}
                defaultTitle={t('select.default')}
                onChange={ (value) => {onSelectedHobbyIdChange(value) }}
            />
        </Activity>  

        { isShowDetailsReport && (
            <>
                <DataTable
                    title={t('statistics.detailsReport', { name: selectedHobby?.name ?? '' })}
                    items={hobbyDetailsTime}
                    columns={[
                        { header: t('statistics.hobby'), cell: (h) => h.hobby },
                        { header: t('statistics.description'), cell: (h) => h.description },
                        { header: t('statistics.spentTime'), cell: (h) => formatTime(h.spentTime) }
                    ]} 
                />
                <Button
                    title={t('common.close')}
                    style={ButtonStyle.Second}
                    onClick={() => setIsShowDetailsReport(false)}
                />                
            </>
        )}


        { isShowTodayActivities && (
            <>
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
                    style={ButtonStyle.Second}
                    onClick={() => setIsShowTodayActivities(false)}
                />               
            </>
        )}
    </>
    );
}
