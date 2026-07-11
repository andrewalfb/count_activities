
import { getHobbiesList, getSpentTimesToday, setHobby, setHobbyTime, getDetailsSpentTimes, deleteHobby } from '../database';

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
    setHobbyTime(req.body.hobby_id, req.body.spent_time, req.body.description);
    
    res.send('OK');
};

export const addHobby = function (req: Request, res: Response) {
    const id = setHobby(req.cookies.anon_id, req.body.name, req.body.description);
    res.json({
        message: 'ok',
        id: id
    });
}

export const detailsSpentHobbyTimes = function(req: Request, res: Response) {
    const rows = getDetailsSpentTimes(Number(req.query.hobbyId));

    return res.json(rows);
}

export const deleteAllInformationHobby = (req: Request, res: Response) => {
  const hobbyIdRaw = req.params.id;

  const hobbyId = Number(hobbyIdRaw);
  if (!Number.isFinite(hobbyId)) return res.status(400).json({ message: "Wrong hobbyId" });

  try {
    const rowsDeleted = deleteHobby(hobbyId);
    console.log(`delete: ${rowsDeleted}`);

    if (rowsDeleted === 0) return res.status(404).json({ message: "Hobby not found" });

    return res.sendStatus(200);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Failed to delete hobby information" });
  }
};