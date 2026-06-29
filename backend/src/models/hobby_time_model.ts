
class HobbyTime {
  id: number
  spentTime: number
  timestamp: number

  constructor(id: number, spentTime: number, timestamp: number) {
    this.id = id;
    this.spentTime = spentTime;
    this.timestamp = timestamp;
  }
}


module.exports = { HobbyTime };