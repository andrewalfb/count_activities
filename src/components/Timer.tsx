import { useState, useRef, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Button, { ButtonStyle }  from "./Button";

import { formatTime } from "../utils/helpers";


interface Props {
    name: string,
    active: boolean,
    onStartClick: () => void,
    onStopClick: (value: number) => void,
    onCancelClick: () => void,
    onResetClick: () => void,
}

 export default function Timer({ 
    name, 
    active, 
    onStartClick,
    onStopClick, 
    onCancelClick,
    onResetClick,
}: Props) {
    const [t] = useTranslation();
    const [ startTime, setStartTime ] = useState(0);
    const [ now, setNow ] = useState(0);
    const intervalRef = useRef<number | null>(null);

    const secondsPass = useMemo(() => {
        if (!startTime || !now) return 0;
        return (now - startTime) / 1000;
    }, [startTime, now]);

    useEffect(() => {
        if (!active) { 
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
    }, [active]);

    function handleStart() {
       onStartClick();
    }

    function handleStop() {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
        }
        onStopClick(secondsPass);
    }


    function handleReset() {
        if (intervalRef.current !== null) {
            const currentTime = Date.now();
            setStartTime(currentTime);
            setNow(currentTime); 
            clearInterval(intervalRef.current);
        }

        onResetClick();
    }
    
    function handleClose() {
        onCancelClick();
    }

    return (
        <div className="columnContent">
            <div className='timeDisplay'>{formatTime(secondsPass)}</div>
            <div className='centerText'><i>{t('timer.timeFor', { name })}</i></div>
            <div className='btn-wrap'>
                <Button title={active ? t('timer.stop') : t('timer.start')} onClick={active ? handleStop : handleStart} />
                <Button title={t('timer.reset')} style={ButtonStyle.Second} onClick={handleReset} />
                <Button title={t('common.close')} style={ButtonStyle.Second} onClick={handleClose} />
            </div>
            
        </div>
    );
 }
