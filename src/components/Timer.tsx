import { useState, useRef } from "react";
import Button, { ButtonType }  from "./Button";


interface Props {
    onStopClick: (value: number) => void
}

 export default function Timer({ onStopClick}: Props) {
    const [ startTime, setStartTime ] = useState(0);
    const [ now, setNow ] = useState(0);
    const intervalRef = useRef<number | null>(null);

    const [ isWorking, setIsWorking ] = useState(false);

    function handleStart() {
        const currentTime = Date.now();
        setStartTime(currentTime);
        setNow(currentTime);
        setIsWorking(true);

        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
        }
        
        intervalRef.current = window.setInterval(() => {
            setNow(Date.now());
        }, 1000);
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
            
    }
  }

    function formatTime(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const second = Math.floor(seconds % 60);
        
        const mm = String(minutes).padStart(2, '0');
        const ss = String(second).padStart(2, '0');

        return `${hours}:${mm}:${ss}`;
    }

    let secondsPass = 0;
    if (startTime != null && now != null) {
        secondsPass = (now - startTime) / 1000;
    }

    return (
        <div className="columnContent">
            <div className='timeDisplay'>{formatTime(secondsPass)}</div>
            <div className='centerText'><i>Time passed</i></div>
            <div className='btn-wrap'>
                <Button title={isWorking ? 'Stop' : 'Start'} onClick={isWorking ? handleStop : handleStart} />
                <Button title='Reset' type={ButtonType.btnSecond} onClick={handleReset} />
            </div>
            
        </div>
    );
 }
