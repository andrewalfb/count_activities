import { Hobby, HobbyTime, HobbyTimeDetail } from "../models/hobby";
import { Menu, TopMenu } from "../models/menu";


export enum FlowStep {
  Idle = 'idle',
  TopMenu = 'top_menu',
  Timer = 'timer',
  Pause = 'timer_pause',
  Details = 'details',
  Saving = 'saving',
};

export enum TimerState {
  Stop = 0,
  Pause,
  Active
}

type ServerState = {
  hobbies: Hobby[];
  hobbyTimes: HobbyTime[];
  hobbyTimeDetails: HobbyTimeDetail[];
};

export type State = {
  flow: FlowStep,
  selectedItemId: number | null,
  currentSpentTime: number,
  timerActive: boolean,
  timerOnMenu: boolean,
  server: ServerState,
  menu: Menu,
  topMenu: TopMenu | null,
  language: string,
}

export type Action = 
  | { type: 'MENU_SELECT_HOBBY'; id: number | null }
  | { type: 'TOP_MENU_INSTALL', topMenu: TopMenu }
  | { type: 'TIMER_START'}
  | { type: 'TIMER_PAUSE', spent: number }
  | { type: 'TIMER_STOP', spent: number }
  | { type: 'TIMER_CANCEL'}
  | { type: 'TIMER_DISPLAY_CLOSE'}
  | { type: 'TIMER_RESET'}
  | { type: 'SAVE_START' }
  | { type: 'SAVE_SUCCESS', hobbyTimes: HobbyTime[] }
  | { type: 'SAVE_ERROR' }
  | { type: 'CANCEL_DETAILS' }
  | { type: 'LOAD_HOBBIES', hobbies: Hobby[] }
  | { type: 'ADD_HOBBY', hobby: Hobby}
  | { type: 'UPDATE_HOBBY', hobby: Hobby}
  | { type: 'LOAD_DETAILS', details: HobbyTimeDetail[] }
  | { type: 'SET_MENU', menu: Menu }
  | { type: 'SET_LANGUAGE', language: string};


export function reducer(state: State, action: Action): State {
  console.log(`reduce: state: ${state.flow}, action: ${action.type}`);
  switch (action.type) {
    case 'MENU_SELECT_HOBBY':
      return { ...state, selectedItemId: action.id, flow: FlowStep.Idle };
    case 'TOP_MENU_INSTALL':
      return { ...state, topMenu: action.topMenu, flow: FlowStep.TopMenu };
    case 'TIMER_START':
      return { ...state, flow: FlowStep.Timer, timerActive: true };
    case 'TIMER_PAUSE':
      return { ...state, flow: FlowStep.Pause, timerActive: false, currentSpentTime: action.spent }
    case 'TIMER_STOP':
      return { ...state, currentSpentTime: action.spent, flow: FlowStep.Details, timerActive: false, timerOnMenu: false
      };
    case 'TIMER_DISPLAY_CLOSE':
      return { ...state, flow: FlowStep.Idle, timerOnMenu: true }
    case 'TIMER_CANCEL':
      return { ...state, flow: FlowStep.Idle, timerActive: false}
    case 'TIMER_RESET':
      return { ...state, timerActive: false, flow: FlowStep.Timer}
    case 'SAVE_START':
      return { ...state, flow: FlowStep.Saving };
    case 'SAVE_SUCCESS':
      return {
        ...state,
        flow: FlowStep.Idle,
        currentSpentTime: 0,
        server: { ...state.server, hobbyTimes: action.hobbyTimes },
      };
    case 'SAVE_ERROR':
      return { ...state, flow: FlowStep.Details };
    case 'CANCEL_DETAILS':
      return { ...state, flow: FlowStep.Idle };
    case 'LOAD_HOBBIES':
      return { ...state, server: { ...state.server, hobbies: action.hobbies } };
    case 'ADD_HOBBY': 
      return { 
        ...state, 
        server: {
          ...state.server,
          hobbies: [...state.server.hobbies, action.hobby]  
        }};
    case 'UPDATE_HOBBY': 
        return {
          ...state,
          server: {
            ...state.server,
            hobbies: state.server.hobbies.map(h => (h.id === action.hobby.id ? action.hobby : h))
          }
        };
    case 'LOAD_DETAILS':
      return { ...state, server: { ...state.server, hobbyTimeDetails: action.details } };
    case 'SET_MENU':
      return { ...state, menu: action.menu };
    case 'SET_LANGUAGE':
        return { ...state, language: action.language};
    
    default: {
      throw Error('Unknown Action: ' + action + 'State: ' + state);
    }
  }
}