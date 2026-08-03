/* This temporary file with functions working with api /backend/ */

import { apiConfig } from "../config/api";
import { Hobby, HobbyTime } from "../models/hobby";
import { sleep } from "./helpers";
import axios from 'axios';

const api = axios.create({
  withCredentials: true
});

 // await api.get(apiConfig.endpoints.auth.init());

  async function onSaveHobbyTime(selectedItem: Hobby, value: number, description: string | undefined) {
    if (!selectedItem) return;
      const json = {
      hobby_id: selectedItem.id,
      spent_time: value,
      description: description?.length === 0 ? selectedItem.description : description
    };

    await sleep(300);
    try {
          const responceAdd = await api.post(apiConfig.endpoints.hobby.addTimes(), json);
          const responceTimes = await api.get(apiConfig.endpoints.hobby.times());
          console.log(`addTime: ${responceAdd}, ${responceTimes}`);
        //   dispatch({type: 'SAVE_SUCCESS', hobbyTimes: responceTimes.data});
        } catch(error) {
          console.error(`error add time: ${error}`);
        //   dispatch({type: 'SAVE_ERROR'});
        };
  }


    const loadHobbies = async () => {
      const res = await api.get(apiConfig.endpoints.hobby.list());

    //   dispatch({ type: 'LOAD_HOBBIES', hobbies: res });
    };


  async function handleSubmitForm(name: string, description: string): Promise<boolean> {
    const json = { name: name, description: description }
    try {
      const response = await api.post(apiConfig.endpoints.hobby.addHobby(), json);
      const newHobby = new Hobby(response.data.id, name, description);
    //   dispatch({ type: 'ADD_HOBBY', hobby: newHobby });

      return true;
    } catch (error) {
      console.error(`error add hobby: ${error}`);

      return false;
    }
  }

  
    async function handleDelete(hobbyId: number): Promise<boolean> {
      try {
        await api.delete(apiConfig.endpoints.hobby.delete(hobbyId));
        await loadHobbies();
  
        return true;
      } catch (error: any) {
        console.error(`error delete Hobby: ${error}`);
  
        return false;
      }
    }
  
    
      async function getSpentTimesToday(): Promise<boolean> {
        try {
          const res = await api.get(apiConfig.endpoints.hobby.times());
          const times = res.data.map(
            (item: { name: string, description: string, spentTime: number, timestamp: number }) =>
              new HobbyTime(item.name, item.description, item.spentTime, item.timestamp)
          )
        //   dispatch({ type: 'SAVE_SUCCESS', hobbyTimes: times });
    
          return true;
        } catch (error) {
          console.error(`error getting today activities: ${error}`);
    
          return false;
        }
      }
    
    
    async function handleShowDetails(hobbyId: number): Promise<boolean> {
        try {
        let response = await api.get(apiConfig.endpoints.hobby.details(), { params: { hobbyId: hobbyId } })
    
        const newHobbyDetails = response.data.map((item: { hobby: string, description: string; spentTime: number; }) => new HobbyTimeDetail(item.hobby, item.description, item.spentTime));
    
        // dispatch({ type: 'LOAD_DETAILS', details: newHobbyDetails });
    
        return true
        } catch (error) {
        console.error(`error getting details report: ${error}`);
    
        return false
        }
    }
    
    
    async function handleUpdateHobby(updated: Hobby): Promise<boolean> {

        const json = { id: updated.id, name: updated.name, description: updated.description };
        try {
            let ok = await api.post(apiConfig.endpoints.hobby.updateHobby(), json);
            console.log(`result update hobby: ${ok}`);
            // dispatch({ type: 'UPDATE_HOBBY', hobby: updated });

            return true;
        } catch (error) {
            console.error(`error update Hobby: ${error}`);

            return false;
        }
    }
    