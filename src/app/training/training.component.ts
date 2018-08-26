import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TrainingService } from './training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {
  runningExerciseSubscription: Subscription;
  ongoingTraining = false;
  constructor(
    private trainingService: TrainingService
  ) { }

  ngOnInit() {
    this.runningExerciseSubscription = this.trainingService.runningExerciseChanged.subscribe(
      (runningExercise) => {
        if (runningExercise) {
          this.ongoingTraining = true;
        } else {
          this.ongoingTraining = false;
        }
      }
    );
  }

  ngOnDestroy() {
    this.runningExerciseSubscription.unsubscribe();
  }
}
