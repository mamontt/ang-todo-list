import { Component } from '@angular/core';
import { Worker } from './classes';
import { StorageService } from './storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {



  // public workers : Worker[] =  [
  //   {name: "Andrew", surname: "Mamont", age :20},
  //   {name: "Andrew", surname: "Smith", age: 25}
  // ];

  // receiveFromChild(worker) : void {
  //   this.workers.push(new Worker(worker.name, worker.surname, worker.age));
  // }
}
