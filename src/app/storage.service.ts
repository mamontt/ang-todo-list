import { Injectable } from '@angular/core';
// import { triggerAsyncId } from 'async_hooks';
import { Worker } from './classes';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  workers : Worker[] =  [
    {name: "Andrew", surname: "Mamont", age :20},
    {name: "Andrew", surname: "Smith", age: 25}
  ];

  constructor() { }
  public getData() : Worker[] {
    return this.workers;
  }

  public addData(worker : Worker) : void {
    console.log(worker.name, worker.surname, worker.age,'parent now have it');
    this.workers.push(worker);
  }

  

  public deleteData(num: number) : void {
    // debugger;
    console.log(this.workers.splice(num, 1));
    console.log('nice, deleted');
  }
  

}
