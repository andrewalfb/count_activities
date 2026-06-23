// Model
export class Hobby {
  name: string;
  description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }
}

// temporary
export const hobbies = [
  new Hobby("English", "All variants"),
  new Hobby("React", 'web using'),
  new Hobby('Armenian', 'All variants'),
  new Hobby('Do sport', 'my activities'),
];