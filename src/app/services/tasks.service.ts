import { Injectable } from '@angular/core';
import { Task } from 'src/app/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  compareTasksByDateTime(taskA: Task, taskB: Task) {
    const dateTimeA = new Date(taskA.date + 'T' + taskA.time);
    const dateTimeB = new Date(taskB.date + 'T' + taskB.time);
    if (dateTimeA > dateTimeB) {
      return -1;
    } else if (dateTimeA < dateTimeB) {
      return 1;
    }
    return 0;
  }

  // store task in local storage
  storeTask(task: Task) {
    let taskId: number = task.id;
    localStorage.setItem(task.id.toString(), JSON.stringify(task));
  }

  scrollToTop() {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }, 400);
  }
}
