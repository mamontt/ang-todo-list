import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Worker } from '../classes';
import {StorageService} from '../storage.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent {
  constructor(private storageService: StorageService){}

  public name: string;
  public surname: string;
  public age: number;

  // @Output() 
  // public outToParent = new EventEmitter();
 
  sendToParent() {
    
    let worker = new Worker(this.name, this.surname, this.age);
    this.storageService.addData(worker);
    console.log(this.name, this.surname, this.age, 'child sent it correct');
  }

}
