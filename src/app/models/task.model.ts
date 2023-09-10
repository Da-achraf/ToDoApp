export class Task {
  id!: number;
  title!: string;
  date!: string;
  time!: string;
  description!: string;
  completed!: boolean;

  constructor(obj: any) {
    this.id = obj.id;
    this.title = obj.title;
    this.date = obj.date;
    this.time = obj.time;
    this.description = obj.description || 'No description.';
    this.completed = obj.completed || false;
  }
}
