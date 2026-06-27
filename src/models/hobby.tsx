import { lookup } from "dns";



// Model
export class Hobby {
  id: string
  name: string
  description: string

  constructor(name: string, description: string) {
    this.id = getUID()
    this.name = name
    this.description = description
  }
}

export class HobbyTime {
  id: string
  spentTime: number
  timestamp: number

  constructor(id: string, spentTime: number) {
    this.id = id
    this.spentTime = spentTime
    this.timestamp = Date.now()
  }
}

function getUID() {
    return  Math.random().toString(36).slice(2) + Date.now().toString(36);
}


// temporary
export let hobbies = [
  new Hobby("English", "All variants"),
  new Hobby("React", 'web using'),
  new Hobby('Armenian', 'All variants'),
  new Hobby('Do sport', 'my activities'),
];


type Persisted = {
  hobbies: { id: string; name: string; description: string }[];
  hobbyTimes: { id: string; spentTime: number; timestamp: number }[];
};

const STORAGE_KEY = "hobbyData:v1";

function loadPersisted(): Persisted {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { hobbies: [], hobbyTimes: [] };
  return JSON.parse(raw) as Persisted;
}

function savePersisted(data: Persisted) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}