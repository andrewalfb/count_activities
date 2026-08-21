import express from 'express';
import { 
    hobbyList, 
    addHobbyTime, 
    hobbyTimes, 
    hobbyTimesRange,
    addHobby, 
    detailsSpentHobbyTimes, 
    deleteAllInformationHobby,
    updateExistHobby
} from '../controllers/hobby_controller';

export const router = express.Router();

router.get('/', hobbyList);

router.get('/times', hobbyTimes);
router.get('/times_range', hobbyTimesRange);

router.post('/add_time', addHobbyTime);
router.post('/add', addHobby);
router.get('/details', detailsSpentHobbyTimes);
router.delete('/deleteHobby/:id', deleteAllInformationHobby);
router.post('/updateHobby', updateExistHobby);