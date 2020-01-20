import { Component, OnInit, Input } from '@angular/core';
import { Worker } from '../classes';
import { StorageService } from '../storage.service';
// import { Worker } from 'cluster';


@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss'],
  
})
export class PrintComponent  implements OnInit {
  private workers : Worker[];
  
  constructor(private storageService: StorageService){} 
  
  ngOnInit(){
    this.workers = this.storageService.getData();
    console.log(this.workers,'we have it now');
  } 

  public deleteOnIndex(index: number) {
    
    this.storageService.deleteData(index);
    console.log(index, 'child sent this index');
  }


}
