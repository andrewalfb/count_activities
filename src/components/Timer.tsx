import { useState, useRef } from "react";
import Button, { ButtonType }  from "./Button";

import { formatTime } from "../utils/helpers";



interface Props {
    id: string
    name: string
    onStopClick: (value: number) => void
}

 export default function Timer({ id, name, onStopClick}: Props) {
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

    let secondsPass = 0;
    if (startTime != null && now != null) {
        secondsPass = (now - startTime) / 1000;
    }

    return (
        <div className="columnContent">
            <div className='timeDisplay'>{formatTime(secondsPass)}</div>
            <div className='centerText'><i>Time for {name}</i></div>
            <div className='btn-wrap'>
                <Button title={isWorking ? 'Stop' : 'Start'} onClick={isWorking ? handleStop : handleStart} />
                <Button title='Reset' type={ButtonType.btnSecond} onClick={handleReset} />
            </div>
            
        </div>
    );
 }
