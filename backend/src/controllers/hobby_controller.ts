
import { getHobbiesList, getSpentTimesToday, setHobby, setHobbyTime } from '../database';

import type { Request, Response  } from 'express';



export const hobbyList = function (req: Request, res: Response) {
    const userId = req.cookies.anon_id;
    const rows = getHobbiesList(userId);
    res.json(rows);
};


export const hobbyTimes = function (req: Request, res: Response) {
    const userId = req.cookies.anon_id;
    const rows = getSpentTimesToday(userId);
    res.json(rows);
};

export const addHobbyTime = function (req: Request, res: Response) {  
    setHobbyTime(req.body.hobby_id, req.body.spent_time, req.body.timestamp);
    
    res.send('OK');
};

export const addHobby = function (req: Request, res: Response) {
    const id = setHobby(req.cookies.anon_id, req.body.name, req.body.description);
    res.json({
        message: 'ok',
        id: id
    });
}
