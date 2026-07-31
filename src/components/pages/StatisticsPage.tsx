import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";

import { formatTime } from "../../utils/helpers";
import Button, { ButtonStyle } from "../Button";
import DataTable from "../DataTable";
import { HobbyTimeDetail, HobbyTime } from "../../models/hobby";
import Select from "../Select";
import { Spinner } from "../Spinner";

// only for debug
// import { sleep } from "../../utils/helpers";    
import { Menu, TopMenu } from "../../models/menu";
import { Action, State } from "../../hooks/taskReducer";

interface Props {
    selectedHobbyId: number | null,
    state: State,
    dispatch: React.Dispatch<Action>
    hobbyDetailsTime: HobbyTimeDetail[],
    onHobbyDetails: (hobbyId: number) => Promise<boolean>,
    hobbyTimes: HobbyTime[],
    onHobbyTimes: () => Promise<boolean>;
}

export function StatisticsPage({
    selectedHobbyId,
    state,
    dispatch,
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
            // await sleep(300);
            const ok = await onHobbyDetails(selectedHobby.id);
            if (ok) setIsShowDetailsReport(true);
        } finally {
            setIsWaiting(false);
        }
    }, [ selectedHobby, onHobbyDetails, setIsShowDetailsReport, setIsWaiting ])

    const handleTodayActivitiesReport = useCallback( async () => {
        setIsWaiting(true);
        try {
            // await sleep(300);
            const ok = await onHobbyTimes();
            if (ok) setIsShowTodayActivities(true);
        } finally {
            setIsWaiting(false);
        }        
    }, [setIsWaiting, onHobbyTimes, setIsShowTodayActivities ])

const detailsReportRef = useRef(handleDetailsReport);
const todayActivitiesReportRef = useRef(handleTodayActivitiesReport);
const tRef = useRef(t);

detailsReportRef.current = handleDetailsReport;
todayActivitiesReportRef.current = handleTodayActivitiesReport;

const [topMenu] = useState(() =>
    new TopMenu(Menu.edit, [
        {
            id: 'detailsReport',
            getTitle: () => tRef.current('statistics.timeReport'),
            style: ButtonStyle.Primary,
            active: false,
            onClick: () => detailsReportRef.current(),
        },
        {
            id: 'todayReport',
            getTitle: () => tRef.current('statistics.todayActivities'),
            style: ButtonStyle.Primary,
            active: true,
            onClick: () => todayActivitiesReportRef.current(),
        },
    ])
);

useEffect(() => {
    tRef.current = t;
}, [t]);

useEffect(() => {
    dispatch({ type: 'TOP_MENU_INSTALL', topMenu });
}, [dispatch, topMenu]);



    return (
    <div className="hobbyPage">
        { isWaiting && (<Spinner name={t('statistics.loading')}/>)}

        { !(isShowDetailsReport || isShowTodayActivities || isWaiting) && (
            <Select 
                items={state.server.hobbies.map(sel => ({ id: sel.id, name: sel.name }))}
                active={selectedHobbyId}
                defaultTitle={t('select.default')}
                onChange={ (value) => { dispatch({ type: 'MENU_SELECT_HOBBY', id: value}) }}
            />
        )} 



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
        
    </div>
    );
}
