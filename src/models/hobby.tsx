

// Model
export class Hobby {
  id: number
  name: string
  description: string

  constructor(id: number, name: string, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}

export class HobbyTime {
  id: number
  spentTime: number
  timestamp: number

  constructor(id: number, spentTime: number, timestamp: number) {
    this.id = id
    this.spentTime = spentTime
    this.timestamp = timestamp
  }
}
