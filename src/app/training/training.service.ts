import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

import { Exercise } from './exercise.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  runningExerciseChange = new Subject<Exercise>();
  private availableExercises: Exercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
  ];
  private runningExercise: Exercise;
  private exercises: Exercise[] = [];
  constructor() { }

  getAvailableExercises() {
    return this.availableExercises.slice();
  }

  startExercise(selectId: string) {
    this.runningExercise = this.availableExercises.find( e => e.id === selectId );
    this.runningExerciseChange.next({...this.runningExercise});
  }

  completeExercise() {
    this.exercises.push({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed'
    });
    this.runningExercise = null;
    this.runningExerciseChange.next(null);
  }

  cancelExercise(progress: number) {
    this.exercises.push({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.runningExerciseChange.next(null);
  }

  getRunningExersise() {
    return {...this.runningExercise};
  }

  getCompletedOrCancelledExersises() {
    return this.exercises.slice();
  }
}
