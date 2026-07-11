import express from 'express';
import { hobbyList, addHobbyTime, hobbyTimes, addHobby, detailsSpentHobbyTimes, deleteAllInformationHobby} from '../controllers/hobby_controller';

export const router = express.Router();

router.get('/', hobbyList);
router.get('/times', hobbyTimes);
router.post('/add_time', addHobbyTime);
router.post('/add', addHobby);
router.get('/details', detailsSpentHobbyTimes);
router.delete('/deleteHobby/:id', deleteAllInformationHobby);
