import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { Subscription } from 'rxjs';
import { UiService } from '../../shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[];
  availableExercisesSubscription: Subscription;
  isLoading = false;
  private loadingSubscription: Subscription;

  constructor(
    private trainingService: TrainingService,
    private uiService: UiService
  ) { }

  ngOnInit() {
    this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(
      isLoading => this.isLoading = isLoading
    );
    this.availableExercisesSubscription = this.trainingService.availableExercisesChanged
      .subscribe(exercises => this.exercises = exercises);
    this.fecthAvailableExercises();
  }

  ngOnDestroy() {
    if (this.availableExercisesSubscription) {
      this.availableExercisesSubscription.unsubscribe();
    }
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }

  fecthAvailableExercises() {
    this.trainingService.fecthAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}
