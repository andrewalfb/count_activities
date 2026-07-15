import { useState, useRef, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Button, { ButtonType }  from "./Button";

import { formatTime } from "../utils/helpers";



interface Props {
    id: number,
    name: string,
    active: boolean,
    onStopClick: (value: number) => void,
    onResetClick: () => void,
    onCloseClick: () => void
}

 export default function Timer({ id, name, onStopClick, active, onResetClick, onCloseClick }: Props) {
    const [t] = useTranslation();
    const [ startTime, setStartTime ] = useState(0);
    const [ now, setNow ] = useState(0);
    const intervalRef = useRef<number | null>(null);

    const [ isWorking, setIsWorking ] = useState(active);

    const secondsPass = useMemo(() => {
        if (!startTime || !now) return 0;
        return (now - startTime) / 1000;
    }, [startTime, now]);

    useEffect(() => {
        if (!isWorking) { 
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }
        const currentTime = Date.now();
        setStartTime(currentTime);
        setNow(currentTime);

        intervalRef.current = window.setInterval(() => {
            setNow(Date.now());
        }, 1000);

        return () => {
            if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            }
        };
    }, [isWorking]);

    function handleStart() {
        setIsWorking(true)
    }

    function handleStop() {
        setIsWorking(false);
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
        }
        onStopClick(secondsPass);
    }


    function handleReset() {
        setIsWorking(false);
        if (intervalRef.current !== null) {
            const currentTime = Date.now();
            setStartTime(currentTime);
            setNow(currentTime); 
            clearInterval(intervalRef.current);
            
            onResetClick();
        }
    }

    function handleClose() {
        setIsWorking(false);
        onCloseClick();
    }

    return (
        <div className="columnContent">
            <div className='timeDisplay'>{formatTime(secondsPass)}</div>
            <div className='centerText'><i>{t('timer.timeFor', { name })}</i></div>
            <div className='btn-wrap'>
                <Button title={isWorking ? t('timer.stop') : t('timer.start')} onClick={isWorking ? handleStop : handleStart} />
                <Button title={t('timer.reset')} type={ButtonType.btnSecond} onClick={handleReset} />
                <Button title={t('timer.close')} type={ButtonType.btnSecond} onClick={handleClose} />
            </div>
            
        </div>
    );
 }
