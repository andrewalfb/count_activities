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
  name: string
  description: string
  spentTime: number
  timestamp: number

  constructor(name: string, description: string, spentTime: number, timestamp: number) {
    this.name = name
    this.description = description
    this.spentTime = spentTime
    this.timestamp = timestamp
  }
}

export class HobbyDetailsTime {
  description: string
  spentTime: number

  constructor(description: string, spentTime: number) {
    this.description = description;
    this.spentTime = spentTime;
  }
}