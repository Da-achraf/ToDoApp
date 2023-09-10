import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TaskService } from './../../services/tasks.service';

import {
  faCircleInfo,
  faCircleXmark,
  faComment,
  faPenFancy,
  faRotateLeft,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-to-do-app',
  templateUrl: './to-do-app.component.html',
  styleUrls: ['./to-do-app.component.css'],
  providers: [DatePipe],
})
export class ToDoAppComponent implements OnInit {
  tasks: Task[] = [];

  id: number = 0;
  title: string = '';
  description: string = '';
  dateValue: any = new Date();
  timeValue: any = new Date();

  descriptionPopUpContent: string = '';
  descriptionPopUpTitle: string = '';

  // Font icons
  faPenFancy = faPenFancy;
  faTrash = faTrash;
  faRotateLeft = faRotateLeft;
  faCircleInfo = faCircleInfo;
  faComment = faComment;
  faCircleXmark = faCircleXmark;

  editMode: boolean = false;
  completed: boolean = false;
  infoVisible: boolean = true;
  descriptionVisible: boolean = false;

  selectedTask: Task = new Task({});

  constructor(private taskService: TaskService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.initializeDateAndTime();
    this.tasks = this.getStoredTasks();
    this.hideInfoPopUp();
  }

  initializeDateAndTime() {
    this.dateValue = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.timeValue = this.datePipe.transform(new Date(), 'HH:mm');
  }

  onAdd(value: any) {
    const id: number = this.getTaskIdCount();
    const addedTask: Task = new Task({
      id: id,
      title: value.title,
      date: value.date,
      time: value.time,
      description: value.description,
    });
    this.tasks.unshift(addedTask);
    this.taskService.storeTask(addedTask);
    this.incrementTasksCount(addedTask.id);
  }

  onSave(taskToSave: Task) {
    this.editMode = false;
    taskToSave.id = this.id;
    this.tasks = this.tasks.map((task: Task) => {
      return task.id === taskToSave.id ? taskToSave : task;
    });
    this.taskService.storeTask(taskToSave);
    this.resetForm();
  }

  onCompleted(task: Task) {
    task.completed = !task.completed;
    this.taskService.storeTask(task);
  }

  onRollback() {
    this.editMode = false;
    this.resetForm();
  }

  onDelete(taskId: number) {
    this.tasks = this.tasks.filter((task: Task) => task.id != taskId);
    localStorage.removeItem(taskId.toString());
    this.resetForm();
  }

  onEdit(task: Task) {
    this.editMode = true;
    this.descriptionVisible = false;
    this.id = task.id;
    this.title = task.title;
    this.dateValue = task.date;
    this.timeValue = task.time;
    this.description = task.description;
    this.taskService.scrollToTop();
  }

  onEditFromDescriptionBox() {
    this.onEdit(this.selectedTask);
  }

  onViewDescription(task: Task) {
    this.editMode = false;
    this.resetForm();
    this.taskService.scrollToTop();
    this.selectedTask = task;
    this.descriptionVisible = true;
    this.descriptionPopUpContent = task.description;
    this.descriptionPopUpTitle = task.title;
  }

  // From localstorage, get the id to assign to the new created task
  getTaskIdCount(): number {
    let numberOfStoredTasks = this.getStoredTasks().length;
    if (numberOfStoredTasks === 0) return 0;
    let id: any = localStorage.getItem('idCount');
    return id && numberOfStoredTasks != 0 ? Number.parseInt(id) : 0;
  }

  // Get stored tasks in localStorage
  getStoredTasks(): Task[] {
    let tasks: Task[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i)!;
      let localStorageItem = JSON.parse(localStorage.getItem(key)!);
      localStorageItem instanceof Object ? tasks.push(localStorageItem) : '';
    }
    return tasks.sort(this.taskService.compareTasksByDateTime);
  }

  // incrementTasksCount in localstorage
  incrementTasksCount(count: number) {
    localStorage.setItem('idCount', JSON.stringify(++count));
  }

  resetForm() {
    this.initializeDateAndTime();
    this.title = '';
    this.description = '';
  }

  hideInfoPopUp() {
    setTimeout(() => {
      this.infoVisible = false;
    }, 6000);
  }
}
