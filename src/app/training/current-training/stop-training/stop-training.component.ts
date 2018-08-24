import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-stop-training',
  templateUrl: './stop-training.component.html',
  styleUrls: ['./stop-training.component.css']
})
export class StopTrainingComponent implements OnInit {
  progress: number;
  constructor(@Inject(MAT_DIALOG_DATA) private passedData: any) { }

  ngOnInit() {
    this.progress = this.passedData.progress;
  }

}
